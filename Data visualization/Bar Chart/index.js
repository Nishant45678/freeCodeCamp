import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const height = 500;
const width = 900;
const margin = { t: 30, r: 40, b: 50, l: 60 };

const data = await d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
);

const x = d3
  .scaleTime()
  // .domain(d3.extent(data.data, (d) => new Date(d[0])))
  .domain([new Date(data.from_date), new Date(data.to_date)])
  .range([margin.l, width - margin.r]);

const y = d3
  .scaleLinear()
  .domain([0, d3.max(data.data, (d) => d[1])])
  .range([height - margin.b, margin.t]);

const gridLines = d3
  .axisLeft(y)
  .tickSize(-(width - margin.l - margin.r))
  .tickFormat("");

  
  const svg = d3
  .select("#container")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("width", "100%");
  
  const tooltip = d3.select("#container")
  .append("div")
  .attr("id","tooltip");

svg
  .selectAll("rect")
  .data(data.data)
  .enter()
  .append("rect")
  .attr("class","bar")
  .attr("data-date",d=>d[0])
  .attr("data-gdp",d=>d[1])
  .attr("width", (width - margin.l - margin.r) / data.data.length)
  .attr("height", (d) => height - margin.b - y(d[1]))
  .attr("x", (d) => x(new Date(d[0])))
  .attr("y", (d) => y(d[1]))
  .attr("fill", "#85a0bd")
  .on("mouseover",function(e,d){
    d3.select(this).transition().duration(100).attr("fill","#3f648c");
    tooltip.transition().duration(200).style("opacity",0.9);
    tooltip.html(`${new Date(d[0]).getFullYear()}<br>$${d[1].toFixed(1)} Billion`)
    .attr("data-date",d[0])
    .style("left", `${e.pageX+10}px`)
    .style("top",`${e.pageY+5}px`); 
  })
  .on("mouseout",function(){
    d3.select(this).transition().duration(100).attr("fill","#85a0bd")
    tooltip.transition().duration(500).style("opacity",0)
  });

const grid = svg
  .append("g")
  .attr("transform", `translate(${margin.l},0)`)
  .call(gridLines);

grid.selectAll("line").attr("stroke", "#6a89ab");

grid.select(".domain").remove();

const yAxis = svg
  .append("g")
  .attr("id","y-axis")
  .attr("transform", `translate(${margin.l},0)`)
  .call(d3.axisLeft(y).tickSize(0))

  yAxis.selectAll(".tick")
  .attr("class","tick")

  yAxis
  .select(".domain")
  .remove();

svg
  .append("g")
  .attr("id","x-axis")
  .attr("transform", `translate(0,${height - margin.b})`)
  .call(d3.axisBottom(x).ticks(10))
  .selectAll(".tick")
  .attr("class","tick");

svg.append("text")
.attr("id","title")
.attr("x",width/2)
.attr("y",margin.t + 30)
.attr("text-anchor","middle")
.attr("font-size","1.7em")
.attr("font-weight","500")
.text("U.S. GDP Growth Over Time");

svg.append("text")
.attr("x",width/2)
.attr("y",height)
.attr("text-anchor","middle")
.attr("font-size","1em")
.text("Year");

svg.append("text")
.attr("x",20)
.attr("y",height/2)
.attr("text-anchor","middle")
.attr("font-size","1em")
.attr("transform-origin",`20 ${height/2}`)
.attr("transform","rotate(-90)")
.text("GDP in Billion")