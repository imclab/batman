var _d_ = {
  getStoryData: function (d) {
    var p = {
      publ: _d_.issuePubl[d.sequence],
      nmbr: d.sequence,
      name: d.title,
      page: d.pages,
      pncl: d.pencils.split(";"),
      inks: d.inks.split(";"),
      clrs: d.colors.split(";"),
      chrs: _.uniq(_.pluck(d.charData, 'charName'))
    };
    return p;
  },
  getLayout: function (data) {
    var pack = d3.layout.pack()
      .size([1000, 1000])
      .value(function(d) { return d.page_count; });

    return _.rest(pack.nodes({name: 'root', children: data }));
  },
  setStorySlide: function (character) {
    var upper, matches, data, stories = [];
    _.each(_d_.storyArray, function (story) {
      matches = _.where(story.charData, {charName: character})
      if (matches.length > 0) {
        stories.push(story)
      }
    });
    _d_.charStoryArray = stories;
    _d_.sSlider.noUiSlider({ range: [0, stories.length - 1] }, true);
    _d_.sSlider.val(0);
    data = _d_.charStoryArray[0];
    _d_.onStory(data);
  },
  onSlide: function () {
    var slider = this.context.id, value = Math.floor(this.val());
    if (slider === 'cSlider') {
      var data = _d_.charArray[value];
      $('.cSliderLabel').html(data.name);
    }
    if (slider === 'sSlider') {
      var data = _d_.charStoryArray[value];
      _d_.svg.selectAll(".guide.point").remove();
      _d_.svg.selectAll(".story.circle")
        .classed("selected", function (e) { return (data.title === e.title) && (data.sequence === e.sequence); });
    }
  },
  onChange: function () {
    var slider = this.context.id, value = Math.floor(this.val());
    if (slider === 'cSlider') {
      var data = _d_.charArray[value];
      _d_.onCharacter(data);
      $('.cSliderLabel').html(data.name);
      _d_.setStorySlide(data.name)
    }
    if (slider === 'sSlider') {
      var data = _d_.charStoryArray[value];
      _d_.onStory(data);
    }
  },
  onCharacter: function (d) {
    var storyIDs = _.pluck(d.recs, 'stry'),
        issueIDs = _.pluck(d.recs, 'isse'),
        minIssue = _.min(issueIDs);

    _d_.svg.selectAll(".character.rect")
      .classed("selected", function (e) { return d.name === e.name; })

    _d_.svg.select("#characterName").text(d.name + " (appears " + d.aprs + " times)")

    d3.selectAll(".story.circle")
      .classed("appearance", function (d) { return _.indexOf(storyIDs, d.storyID) !== -1; });

    d3.selectAll(".issue.circle")
      .classed("appearance", function (d) { return _.indexOf(issueIDs, d.data.issue_id) !== -1; });

    _d_.characterTime(d.recs);
  },
  onStory: function (d) {
    var temp, head, data, point, c;

    _d_.svg.selectAll(".story.circle")
      .classed("selected", function (e) { return (d.title === e.title) && (d.sequence === e.sequence); })

    if (d.colors){
      data = _d_.getStoryData(d);
      temp = Handlebars.compile($('#story-template').html());
      c = _.pluck(d.charData, 'charName');

      d3.selectAll(".character.rect")
        .classed("appearance", function (d) { return _.indexOf(c, d.name) !== -1; })

      $('#character-info').html(temp(data));

      point = _d_.gline.getPointAtLength(_d_.gscale(parseInt(_d_.issueDate[d.sequence].substring(0,4))));
      _d_.svg.selectAll(".guide.point").remove();
      _d_.svg.append("circle")
        .attr("class", "guide point")
        .attr("r", 5)
        .attr("cx", point.x)
        .attr("cy", point.y);
    } 
  },
  zoom: function () {
    var p = {}, 
        min = -7, 
        max = 7, 
        cur = 0,
        offX = 0,
        offY = 0,
        size = 1000;

    p.transform = function () {
      var x = -((size * cur / 10) / 2) + offX;
      var y = -((size * cur / 10) / 2) + offY;
      var s = (cur / 10) + 1;
      d3.select("#svg-container")
        .attr("transform", "translate(" + x + " " + y + ") scale(" + s + ")");
    };
    p.pan = function (dir) {
      if (dir==="panleft") offX += 50;
      if (dir==="panright") offX -= 50;
      if (dir==="panup") offY += 50;
      if (dir==="pandown") offY -= 50;
      this.transform();
    };
    p.zoom = function (dir) {
      if (dir === "zoomin") {
        if (cur === max) return;
        cur++;
        this.transform();
      } else {
        if (cur === min) return;
        cur--;
        this.transform();
      }
    };

    return p;
  },
  onResize: function () {
    var aspect = 1000 / 1000, chart = $("#main-svg");
    var targetWidth = chart.parent().width();
    chart.attr("width", targetWidth);
    chart.attr("height", targetWidth / aspect);
  }
};