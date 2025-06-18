import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 900;
const height = 500;
const margin = { top: 40, right: 170, bottom: 0, left: 0 };
const dataLinks = [
  {
    label: "Kickstarter Pledge",
    description:
      "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
  },
  {
    label: "Movies Sales",
    description: "Top 100 Highest Grossing Movies Grouped By Genre",
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
  },
  {
    label: "VideoGame Sales",
    description: "Top 100 most sold video games grouped by platform",
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
  },
];
let url;
let headingLabel;
let headingDescription;

const container = d3.select("#container");
const radioContainer = container.append("div").attr("id", "data-links-wrapper");
const tooltip = container.append("div").attr("id", "tooltip");

const label = radioContainer
  .selectAll(".data-links")
  .data(dataLinks)
  .join("label")
  .attr("class", "data-links");

label
  .append("input")
  .attr("type", "radio")
  .attr("name", "data")
  .attr("value", (d) => d.url)
  .property("checked", (d, i) => i === 0)
  .on("click", async (e, d) => {
    url = d.url;
    headingLabel = d.label;
    headingDescription = d.description;
    await updateData();
  });
label.append("span").text((d) => d.label);

url ??= dataLinks[0].url;
headingLabel ??= dataLinks[0].label;
headingDescription ??= dataLinks[0].description;

const svg = container.append("svg");

svg.attr("viewBox", `0 0 ${width} ${height}`);
const updateData = async () => {
  const root = d3
    .hierarchy(await d3.json(url))
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  d3
    .treemap()
    .size([
      width - margin.right - margin.left,
      height - margin.top - margin.bottom,
    ])
    .padding(2)(root);

  svg.selectAll("*").remove();

  const colorScale = d3
    .scaleOrdinal()
    .domain([...new Set(root.leaves().map((d) => d.data.category))])
    .range(d3.schemeCategory10);

  const nodes = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .selectAll(".node")
    .data(root.leaves())
    .join("g")
    .attr("class", "node");

  const rects = nodes
    .append("rect")
    .attr("class", "tile")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", (d) => colorScale(d.data.category));

  nodes
    .append("foreignObject")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .append("xhtml:div")
    .style("width", "100%")
    .style("height", "100%")
    .style("font-size", "0.7rem")
    .style("text-align", "center")
    .style("overflow", "hidden")
    .style("display", "block")
    .style("word-wrap", "break-word")
    .style("cursor","default")
    .text((d) => d.data.name);

  nodes
    .on("mouseover", (e,d) => {
      tooltip.transition().duration(200).style("opacity", "1");
      tooltip.style("visibility", "visible");
      tooltip.attr("data-value", d.data.value);
    })
    .on("mousemove", (e, d) => {
      tooltip.style("left", `${e.clientX + 10}px`);
      tooltip.style("top", `${e.clientY + 10}px`);
      tooltip.html(`
      <p><strong>name</strong>:${d.data.name}</p>
      <p><strong>category</strong>:${d.data.category}</p>
      <p><strong>value</strong>:${d.data.value}</p>
      `);
    })
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", "0");
    });

  const heading = svg
    .append("g")
    .attr("transform", `translate(${width / 2},20)`);

  heading
    .append("text")
    .attr("id", "title")
    .attr("font-size", "1.2rem")
    .attr("font-weight", "600")
    .attr("text-anchor", "middle")
    .text(headingLabel);

  heading
    .append("text")
    .attr("id", "description")
    .attr("y", "1rem")
    .attr("font-size", "1rem")
    .attr("font-weight", "500")
    .attr("text-anchor", "middle")
    .text(headingDescription);

  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - margin.right},${margin.top})`)
    .attr("id", "legend");

  const legendGroup = legend.selectAll("g").data(colorScale.domain()).join("g");
  const legendLength = 20;

  legendGroup
    .append("rect")
    .attr("class", "legend-item")
    .attr("x", legendLength)
    .attr("y", (d, i) => i * legendLength)
    .attr("width", legendLength)
    .attr("height", legendLength)
    .attr("fill", (d) => colorScale(d));

  legendGroup
    .append("text")
    .attr("x", 2 * legendLength + 10)
    .attr("y", (d, i) => i * legendLength + 10)
    .attr("text-anchor", "left")
    .attr("dominant-baseline", "middle")
    .text((d) => d);
};

await updateData();
