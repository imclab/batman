_d_.drawNode = function (issue, iIndex) {

  function positionLabel (p) {
   if (iIndex === 0) return {x: 465, y: 522};
   if (iIndex === 1) return {x: 441, y: 519};
   if (iIndex === 2) return {x: 429, y: 499};
   var r = 18;
   var c = {x: 456, y: 517};
   var dx = p.x - c.x, dy = c.y - p.y;
   var rx = Math.atan(Math.abs(dx)/Math.abs(dy));
   if (dx >= 0) {
     if (dy >= 0) {
        return {x: p.x + r * Math.cos((Math.PI / 2) + rx), y: p.y + r * Math.sin((Math.PI / 2) + rx)}
      } else {
        return {x: p.x + r * Math.cos(1.5 * Math.PI - rx), y: p.y + r * Math.sin(1.5 * Math.PI - rx)}
      }
   } else {
     if (dy >= 0) {
        return {x: p.x + r * Math.cos(Math.PI/2- rx), y: p.y + r * Math.sin(Math.PI/2 - rx)}
     } else {
        return {x: p.x + r * Math.cos(1.5 * Math.PI + rx), y: p.y + r * Math.sin(1.5 * Math.PI + rx)}
     }
   }
  }

  function getRoot(i) {
    var k = _.toArray(i.stories);
    return {data: i, children: k};
  }

  var cntr = _d_.tline.getPointAtLength(_d_.tscale(iIndex));
  var diam = 18;
  var coor = {x: cntr.x - (diam / 2), y: cntr.y - (diam / 2)};
  var labl = positionLabel(cntr)
  var pack = d3.layout.pack()
    .size([diam, diam])
    .value(function (d) { return d.pages; });

  var container = _d_.svg.append("g")
    .attr("class", "issue-g")
    .attr("transform", "translate(" + coor.x + "," + coor.y + ")")

  var node = container.datum(getRoot(issue)).selectAll(".node")
      .data(pack.nodes)
    .enter().append("g")
      .attr("class", function (d) { return d.children ? "issue node" : "story node"; })
      .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })

  node.append("circle")
    .attr("class", function (d) {
      return d.children ? "issue circle" : ("story circle d" + _d_.issueDate[d.sequence].substring(0,3));
    })
    .attr("r", function (d) { return  d.r; })
    .on("mouseover", function (d) { _d_.onStory.call(this, d) })

  _d_.svg.append("text") 
    .attr("class", "issue label")
    .style("font-size", "9px")
    .text(issue.sequence)
    .attr("transform", "translate(" + (labl.x - (issue.sequence.length < 4 ? Math.pow(issue.sequence.length,2): 8)) + "," + (labl.y + 5) + ")");

}