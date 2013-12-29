_d_.onResize();

queue()
  .defer(d3.json, 'data/issues.json')
  .defer(d3.json, 'data/characters.json')
  .await(function(err, issueFile, charFile) { 
    if (err) console.log(err);
      _d_.main(issueFile, charFile);
    });
 
$('.loading-bar').width(300)

_d_.main = function (issueFile, charFile) {

  _d_.svg = d3.select("#svg-container");

  _d_.issuePubl = _.object(_.pluck(issueFile, 'sequence'),_.pluck(issueFile, 'publication'));
  _d_.issueDate = _.object(_.pluck(issueFile, 'sequence'),_.pluck(issueFile, 'pub_date'));
  _d_.charArray = charFile;

  // SCALES FOR UPPER LEFT CHART - characterTime
  _d_.cline = d3.select('#char-time').node();
  _d_.cscale = d3.scale.linear()
    .range([0, _d_.cline.getTotalLength()])
    .domain([1940, 2012]);

  _d_.gline = d3.select('#gline').node();
  _d_.gscale = d3.scale.linear()
    .range([0, _d_.gline.getTotalLength()+3])
    .domain([1940, 2012]);

  _d_.rscale = d3.scale.linear()
    .range([235, 185])
    .domain([1940, 2011]);

  _d_.zoomHandler = _d_.zoom();

  // SCALE FOR TIMELINE - drawNode
  _d_.tline = d3.select('#spiral').node();
  _d_.tscale = d3.scale.linear()
    .range([0, _d_.tline.getTotalLength()])
    .domain([0, issueFile.length - 1]);

  _d_.storyArray = [];
  _d_.counter = 0;
  _.each(issueFile, function (issue) {
    _d_.counter++
    _.each(issue.stories, function (story) {
      story.sort=_d_.counter;
     _d_.storyArray.push(story)
    })
  })
  _.sortBy(_d_.storyArray, function (d) { return d.sort });

  _d_.cSlider = $('#cSlider');
  _d_.cSlider.noUiSlider({
     range: [0,100],
     start: 80,
     handles: 1,
     step: 1,
     slide: _d_.onSlide,
     set: _d_.onChange
  });
  _d_.sSlider = $('#sSlider');
  _d_.sSlider.noUiSlider({
     range: [0,100],
     start: 0,
     handles: 1,
     slide: _d_.onSlide,
     set: _d_.onChange
  });

  _d_.bars(charFile);
  _.each(issueFile, function (elem, i) {
    _d_.drawNode(elem,i);
  });
  _d_.lights();
  _d_.cSlider.val(5, true)
};

$('#zoomin, #zoomout').on("click", function (e) {
  e.preventDefault();
  _d_.zoomHandler.zoom(this.id);
});

$('#panleft, #panright, #panup, #pandown').on("click", function (e) {
  e.preventDefault();
  _d_.zoomHandler.pan(this.id);
});

$(window).on("resize", function() {
  _d_.onResize();
});