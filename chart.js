// Create function
function chart(data, params) {
  // save main div element in variable
  const container = d3.select(params.container);

  // define metrics of svg and chart
  const width = container.node().getBoundingClientRect().width;
  const height = container.node().getBoundingClientRect().height;
  const marginTop = 30;
  const marginBottom = 40;
  const marginLeft = 70;
  const marginRight = 20;
  const chartWidth = width - marginLeft - marginRight;
  const chartHeight = height - marginTop - marginBottom;

  // add heading

  // container
  //   .append("div")
  //   .attr("class", "heading")
  //   .attr("width", width)
  //   .append("text")
  //   .text(
  //     "Countries are divided in five income groups, all of them have their own color. Scatter plot shows relationship between GDP per capita and Life expectancy in those countries. You can filter relationships by income groups:"
  //   );
  // create buttons

  const groups = [
    "Low income",
    "Lower middle income",
    "No classification",
    "Upper middle income",
    "High income",
  ];

  container
    .append("div")
    .attr("class", "income-group")
    .attr("width", width)
    .append("text");

  const income = d3
    .select(".income-group")
    .selectAll("button")
    .data(groups)
    .join("button")
    .attr("class", (d) => d.split(" ")[0])
    .text((d) => d)
    .on("click", function (d) {
      drawCircles(data.filter((x) => x.group === d.target.innerText));
    });

    console.log(data)

  // create scales and axis
  const xScale = d3
    .scaleLog()
    .domain([80, d3.max(data.map((d) => d.gdp))])
    .range([0, chartWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([50, d3.max(data.map((d) => d.expectancy))])
    .range([chartHeight, marginTop]);

  const xaxis = d3.axisBottom(xScale);
  const yaxis = d3.axisLeft(yScale);

  // create svg element and append to container

  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // create g element and add axis

  const g = svg.append("g").attr("class", "axis");

  g.append("g")
    .attr("class", "axis")
    .attr("opacity", 0)
    .call(xaxis)
    .attr("transform", `translate(${marginLeft}, ${chartHeight})`)
    .transition()
    .duration(2000)
    .attr("opacity", 1)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", function () {
      return "rotate(-55)";
    })
    .attr("y", 15)
    .attr("dy", "-0.01em");

  g.append("g")
    .attr("class", "axis")
    .call(yaxis)
    .attr("transform", `translate(${marginLeft})`)
    .attr("opacity", 0)
    .transition()
    .duration(800)
    .attr("opacity", 1);

  // add labels

  svg
    .append("text")
    .attr("x", chartWidth / 2)
    .attr("y", height - 25)
    .text("GDP per capita ($)");

  svg
    .append("text")
    .attr("x", marginLeft - 50)
    .attr("y", chartHeight / 2)
    .text("Life expectancy")
    .attr("transform", `rotate(-90, ${marginLeft - 50}, ${chartHeight / 2})`);

  // create chartgroup variable

  const chartgroup = g.append("g").attr("class", "chart");
  // create scales for circle radius and color

  const rScale = d3
    .scaleLinear()
    .domain([
      d3.min(data.map((d) => d.gdp)),
      10000,
      d3.max(data.map((d) => d.gdp)),
    ])
    .range([2, 15, 30]);

  const cScale = d3
    .scaleOrdinal()
    .domain(groups)
    .range([
      "rgba(50, 59, 235, 0.5)",
      "rgba(226, 50, 235, 0.5)",
      "rgba(235, 226, 47, 0.5)",
      "rgba(137, 21, 232, 0.5)",
      "rgba(235, 163, 47, 0.5)",
    ]);

  // create circles function for scaterrplot
  function drawCircles(data) {
    const circle = chartgroup
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("r", 0.5)
      .attr("cx", (d) => xScale(d.gdp))
      .attr("cy", (d) => yScale(d.expectancy))
      .attr("fill", (d) => cScale(d.group))
      .attr("opacity", 0);

    //transition

    circle
      .transition()
      .duration(1000)
      .attr("r", (d) => rScale(d.gdp))
      .attr("opacity", 1);

    // tippy popup
    circle.each(function (d) {
      if (this._tippy) this._tippy.destroy()
      tippy(this, {
        content: `<div class=popup> 
        <h3> ${d.country} </h3>
        Income Group: ${d.group}
        </br>
        GDP: ${d.gdp}$ per capita
        <br/>
        Life expectancy: ${d.expectancy}<br/>       
        </div>`,
        allowHTML: true,
        arrow: false,
      });
    });
  }

  drawCircles(data);
}
