_d_.bars = function (data) {

  var svg = d3.select("#svg-container")
  var path = d3.select('#cline').node();
  var lineScale = d3.scale.linear()
    .range([0, path.getTotalLength()])
    .domain([0, data.length * 1.98]);

  var heightScale = d3.scale.sqrt()
    .range([0, 75])
    .domain([0, d3.max(data, function (d) { return d.aprs })]);

  var rotateScale = d3.scale.linear()
    .range([180, -5])
    .domain([0, data.length]);

  function getTranslate (d, i) {
    var p = path.getPointAtLength(lineScale(i));
    var r = rotateScale(i);
    return "translate(" + p.x + "," + p.y + ")rotate(" + (-r) + ")"
  }

  var characters = svg.selectAll(".character node")
      .data(data)
      .enter().append("g").attr("class", "character-g")
      .attr("transform", function (d, i) { return getTranslate(d,i) });

  characters.append("rect")
      .attr("class", "character rect")
      .attr("width", 12)
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", function (d) { return heightScale(d.aprs); });

  characters.append("text")
      .attr("class", "character text")
      .attr("x", 0)
      .attr("y", 0)
      .style("pointer-events", "none")
      .text(function (d, i) { return d.name; })
      .attr("transform", "translate(6 0) rotate(90)"); 
}


