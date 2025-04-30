import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const data = await d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
);

const width = 950;
const height = 500;
const margin = { top: 40, right: 200, bottom: 55, left: 80 };
const parseTime = d3.timeParse("%M:%S");
data.forEach((d) => {
  d.parsedTime = parseTime(d.Time);
});
const yScale = d3
  .scaleTime()
  .domain(d3.extent(data, (d) => d.parsedTime))
  .nice()
  .range([height - margin.bottom, margin.top]);

const xScale = d3
  .scaleLinear()
  .domain([d3.min(data, (d) => d.Year ), d3.max(data, (d) => d.Year)])
  .nice()
  .range([margin.left, width - margin.right]);

const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`);

const tooltip = d3.select("body").append("div").attr("id", "tooltip");

const color = d3.scaleOrdinal(d3.schemeCategory10);

const horizontalLine = svg
  .append("line")
  .attr("class", "guide-line")
  .attr("stroke", "steelblue")
  .attr("strokeWidth", "1px")
  .style("opacity", "0");

const verticalLine = svg
  .append("line")
  .attr("class", "guide-line")
  .attr("stroke", "steelblue")
  .attr("strokeWidth", "1px");

svg
  .append("g")
  .attr("id", "x-axis")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
  .attr("font-size", "1rem")
  .attr("font-weight", "600");

svg
  .append("g")
  .attr("id", "y-axis")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")))
  .attr("font-size", "1rem")
  .attr("font-weight", "600");

svg
  .append("text")
  .attr("id", "title")
  .attr("x", width / 2)
  .attr("y", margin.top - 20)
  .attr("text-anchor", "middle")
  .attr("font-weight", "500")
  .attr("font-size", "1.5rem")
  .text(
    "Fastest Cyclists Up Alpe d'Huez – With and Without Doping Allegations"
  );

svg
  .append("text")
  .attr("x", (width - margin.left - margin.right) / 2)
  .attr("y", height - 10)
  .attr("text-anchor", "middle")
  .attr("font-weight", "500")
  .attr("font-size", "1.1rem")
  .text("Year of Climb");

svg
  .append("text")
  .attr("x", 20)
  .attr("y", height / 2 - 5)
  .attr("text-anchor", "middle")
  .attr("font-weight", "500")
  .attr("font-size", "1.1rem")
  .attr("transform-origin", `20 ${height / 2}`)
  .attr("transform", "rotate(-90)")
  .text("Climb Time in (minute:seconds)");

const dots = svg
  .selectAll(".dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("cx", (d) => xScale(d.Year))
  .attr("cy", (d) => yScale(d.parsedTime))
  .attr("r", "5")
  .attr("data-xvalue", (d) => d.Year)
  .attr("data-yvalue", (d) => d.parsedTime.toISOString())
  .attr("fill", (d) => color(d.Doping !== "") + "ab")
  .attr("stroke", "#000");

dots
  .on("mouseover", function (e, d) {
    const cx = this.getAttribute("cx");
    const cy = this.getAttribute("cy");
    const dataX = this.dataset.xvalue
    tooltip.transition().duration(200).style("opacity", "0.9");
    tooltip.attr("data-year",dataX)
    tooltip.style("top", e.pageY + 5 + "px");
    tooltip.style("left", e.pageX + 10 + "px");
    tooltip.html(`<div>
    <p><strong>${d.Name}</strong>(${d.Year}) ,${d.Nationality}</p>
    <p><strong>Time: </strong>${d.Time}</p>
    <p><strong>Doping: </strong>${d.Doping || "No doping allegations"}</p>
  </div>`);
    horizontalLine
      .transition()
      .duration(200)
      .style("opacity", "0.6")
      .attr("x1", margin.left + "px")
      .attr("y1", cy + "px")
      .attr("x2", cx + "px")
      .attr("y2", cy + "px");
    verticalLine
      .transition()
      .duration(200)
      .style("opacity", "0.6")
      .attr("x1", cx + "px")
      .attr("y1", height - margin.bottom + "px")
      .attr("x2", cx + "px")
      .attr("y2", cy + "px");
  })
  .on("mouseout", function () {
    tooltip.transition().duration(200).style("opacity", "0");
    d3.selectAll(".guide-line")
      .transition()
      .duration(200)
      .style("opacity", "0");
  });
const legend = svg.append("g").attr("id","legend")
const labeleGroup = legend
  .selectAll("g")
  .data(color.domain())
  .enter()
  .append("g")
  .attr("transform", (d,i)=>`translate(${width-margin.right} ${height / 2+i*20})`);

labeleGroup.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("width", 20)
.attr("height", 15)
.attr("fill", d=>color(d));
labeleGroup.append("text")
.attr("x", 30)
.attr("y", 8)
.attr("text-anchor","start")
.attr("alignment-baseline","middle")
.text(d=>d?"With Doping Alligation":"No Dopping Alligation")
