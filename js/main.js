const promises = [d3.csv("data/population-by-age.csv")];

Promise.all(promises).then(function (data) {
  const dataToUse = data[0];

  const width = 500;
  const height = 500;

  const color = d3
    .scaleOrdinal()
    .domain(dataToUse.map((d) => d.name))
    .range(
      d3
        .quantize(
          (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
          dataToUse.length
        )
        .reverse()
    );

  const myArcs = d3.pie().value(function (d) {
    return d.value;
  })(dataToUse);

  const arcLabel = function () {
    return d3.arc().innerRadius(200).outerRadius(200);
  };

  const allMyArcs = d3.arc().innerRadius(100).outerRadius(240);

  const svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + 260 + "," + 240 + ")");

  svg
    .append("g")
    .attr("stroke", "white")
    .selectAll("path")
    .data(myArcs)
    .enter()
    .append("path")
    .attr("fill", (d) => color(d.data.name))
    .attr("d", allMyArcs);

  svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(myArcs)
    .enter()
    .append("text")
    .attr("transform", (d) => `translate(${arcLabel().centroid(d)})`)
    .call((text) =>
      text
        .append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text((d) => d.data.name)
    )
    .call((text) =>
      text
        .filter((d) => d.endAngle - d.startAngle > 0.25)
        .append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text((d) => d.value.toLocaleString())
    );
});
