import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 950,
  height = 500,
  margin = { left: 60, right: 20, top: 70, bottom: 40 };

const data = await d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
);

// console.log(data)

const yearDomain = [...new Set(data.monthlyVariance.map((d) => d.year))];
const monthDomain = [...Array(12).keys()];
const baseTemp = data.baseTemperature;
const varianceDomain = d3.extent(data.monthlyVariance.map((d) => d.variance));

const xScale = d3
  .scaleBand()
  .domain(yearDomain)
  .range([margin.left, width - margin.right])
  .padding(0.05);

const yScale = d3
  .scaleBand()
  .domain(monthDomain)
  .range([margin.top, height - margin.bottom])
  .padding(0.05);

const colorScale = d3
  .scaleSequential(d3.interpolateViridis)
  .domain(varianceDomain);

const tooltip = d3.select("body").append("div").attr("id", "tooltip");

const svg = d3
  .select("#heatmap")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`);

const cell = svg
  .append("g")
  .selectAll(".cell")
  .data(data.monthlyVariance)
  .enter()
  .append("rect")
  .classed("cell", true)
  .attr("data-month", (d) => d.month - 1)
  .attr("data-year", (d) => d.year)
  .attr("data-temp", (d) => (baseTemp + d.variance).toFixed(2))
  .attr("x", (d) => xScale(d.year))
  .attr("y", (d) => yScale(d.month - 1))
  .attr("width", xScale.bandwidth())
  .attr("height", yScale.bandwidth())
  .attr("fill", (d) => colorScale(d.variance));

cell
  .on("mouseover", function (e) {
    tooltip.transition().duration(200).style("opacity", "1");
    tooltip
      .style("left", `${e.clientX + 10}px`)
      .style("top", `${e.clientY + 10}px`)
      // .style("transform","translate(-100%,0%)")
      .attr("data-year", this.getAttribute("data-year")).html(`
    <p>${this.dataset.year} ${this.dataset.month}</p>
    <p>${this.dataset.temp}&deg;</p>
    `);
  })
  .on("mouseout", () => {
    tooltip.transition().duration(200).style("opacity", "0");
  });

svg
  .append("g")
  .attr("id", "x-axis")
  .style("color", "#abc4d1")
  .attr("transform", `translate(0,${margin.top})`)
  .call(
    d3.axisTop(xScale).tickValues(xScale.domain().filter((d) => d % 10 === 0))
  );

svg
  .append("g")
  .attr("id", "y-axis")
  .style("color", "#abc4d1")
  .attr("transform", `translate(${margin.left},0)`)
  .call(
    d3
      .axisLeft(yScale)
      .tickFormat((d) => d3.timeFormat("%B")(new Date(2000, d)))
  );

const heading = svg
  .append("g")
  .attr("transform", `translate(${width / 2},20)`)
  .attr("fill", "#ababab");

heading
  .append("text")
  .attr("id", "title")
  .attr("font-size", "1.8rem")
  .attr("text-anchor", "middle")
  .attr("font-weight", "600")
  .text("Monthly Global Land-Surface Temperature");

heading
  .append("text")
  .attr("id", "description")
  .attr("y", "1.4rem")
  .attr("text-anchor", "middle")
  .attr("font-size", "1rem")
  .attr("font-weight", "600")
  .text("1753 - 2015: base temperature 8.66°C");

const numColor = 10;
const step = (varianceDomain[1] - varianceDomain[0]) / numColor;
const legendValues = d3.range(0,numColor).map(i => varianceDomain[0]+i*step);


const legendGroup = svg
  .append("g")
  .attr("id", "legend")
  .attr("transform", `translate(100,${height - 30})`);
  
  const legendRectWidth = 40;
  const legendRectHeight = 10;
  const legendScale = d3
  .scaleLinear()
  .domain(varianceDomain)
  .range([0, legendRectWidth * numColor]);
  

legendGroup
  .selectAll("rect")
  .data(legendValues)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * legendRectWidth)
  .attr("width", legendRectWidth)
  .attr("height", legendRectHeight)
  .attr("fill", (d) => colorScale(d));

legendGroup
  .append("g")
  .attr("transform", `translate(0,${legendRectHeight})`)
  .call(d3.axisBottom(legendScale).tickValues(legendValues).tickFormat(d => d3.format(".2f")(baseTemp + d)));

console.log(monthDomain)


