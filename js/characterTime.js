_d_.characterTime = function (data) {
  var years = _.toArray(_.groupBy(data, function (d) { return d.year; }))

  var ascale = d3.scale.sqrt()
    .range([0, 45])
    .domain([0, d3.max(years, function (d) { return d.length })]);

  function getTranslate (year) {
    var p = _d_.cline.getPointAtLength(_d_.cscale(year));
    var r = _d_.rscale(year);
    return "translate(" + p.x + "," + p.y + ")rotate(" + (-r) + " 3 0)";
  }

  d3.select("#svg-container").selectAll(".character.point").remove();
  d3.select("#svg-container").selectAll(".character.point")
    .data(years)
    .enter().append("rect")
    .attr("class", function (d) { return "character point d" + String(d[0].year).substring(0,3); })
    .attr("width", 6)
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", function (d) { return ascale(d.length); })
    .attr("transform", function (d, i) { return getTranslate(d[0].year) });
}
