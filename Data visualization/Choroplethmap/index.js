import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { feature } from "https://cdn.jsdelivr.net/npm/topojson-client@3/+esm";

const educationData = await d3.json(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
);
const countyData = await d3.json(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
);

const counties = feature(countyData, countyData.objects.counties).features;
const educationMap = new Map(educationData.map((d) => [d.fips, d]));
const width = 900;
const height = 500;
const margin = { top: 20, left: 20, bottom: 30, right: 20 };

const colorScale = d3
  .scaleQuantize()
  .domain(d3.extent(educationData, (d) => d.bachelorsOrHigher))
  .range(d3.schemeBlues[9]);

const container = d3.select(".container");
const svg = container.append("svg").attr("viewBox", `0 0 ${width} ${height} `);
const tooltip = container.append("div").attr("id", "tooltip");

const path = svg
  .append("g")
  .attr("transform-origin", `center`)
  .attr("transform", `translate(0,${margin.top - 50}),scale(0.7)`)
  .selectAll("path")
  .data(counties)
  .join("path")
  .each((d) => {
    const edu = educationMap.get(d.id);
    d.education = edu || {};
  })
  .attr("class","county")
  .attr("data-fips", (d) => d.id)
  .attr("data-state", (d) => d.education.state)
  .attr("data-area-name", (d) => d.education.area_name)
  .attr("data-education", (d) => d.education.bachelorsOrHigher)
  .attr("d", d3.geoPath())
  .attr("stroke", "#ccc")
  .attr("stroke-width", 0.5)
  .attr("fill", (d) => {
    const edu = educationMap.get(d.id);
    return edu ? colorScale(edu.bachelorsOrHigher) : "#ccc";
  })
  .on("mouseover", (e, d) => {
    tooltip.transition().duration(200).style("opacity", 1);
    tooltip.style("visibility", "visible");
    tooltip.style("left", `${e.clientX + 10}px`);
    tooltip.style("top", `${e.clientY + 10}px`);
    tooltip.html(`
      <p>${d.education.area_name},${d.education.state}</p>
      <p>${d.education.bachelorsOrHigher}%</p>
      `);
      tooltip.attr("data-education",d.education.bachelorsOrHigher)
  })
  .on("mouseout", (e) => {
    tooltip.transition().duration(200).style("opacity", 0);
    tooltip.style("visibility", "hidden");
  });

const legendWidth = 150;
const legendHeight = 10;
const legendScale = d3
  .scaleLinear()
  .domain(colorScale.domain())
  .range([0, legendWidth]);

const legendData = colorScale.range().map((d) => {
  const [min, max] = colorScale.invertExtent(d);
  return { color: d, min, max };
});

const legend = svg
  .append("g")
  .attr("id","legend")
  .attr(
    "transform",
    `translate(${width - legendWidth - 150},${height - margin.bottom})`
  );

legend
  .selectAll("rect")
  .data(legendData)
  .join("rect")
  .attr("fill", (d) => d.color)
  .attr("x", (d) => legendScale(d.min))
  .attr("y", 0)
  .attr("width", (d) => legendScale(d.max) - legendScale(d.min))
  .attr("height", legendHeight);

legend
  .append("g")
  .attr("transform", `translate(0,10)`)
  .call(
    d3
      .axisBottom(legendScale)
      .tickValues(legendData.map((d) => d.min).concat(legendData.at(-1).max))
      .tickFormat((d) => Math.round(d))
  );

const heading = svg.append("g").attr("transform", `translate(${width / 2},20)`);

heading
  .append("text")
  .attr("id","title")
  .attr("font-size", "1.5rem")
  .attr("font-weight", "500")
  .attr("text-anchor", "middle")
  .text("United States Educational Attainment");
heading
  .append("text")
  .attr("id","description")
  .attr("font-size", "1rem")
  .attr("font-weight", "400")
  .attr("text-anchor", "middle")
  .attr("y", "1em")
  .text(
    "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
  );
