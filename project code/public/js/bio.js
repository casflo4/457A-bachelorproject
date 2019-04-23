function Bio(_allData) {
  var vis = this;

  this.data = _allData;

  vis.displayData = {};

  vis.init();

};


Bio.prototype.init = function() {
  var vis = this;
  self.margin = {
    top: 10,
    right: 20,
    bottom: 30,
    left: 20
  };

  var div = d3.select("#bio");
  vis.svgWidth = div.node().getBoundingClientRect().width;
  vis.svgHeight = 440;

  vis.svg = div.append("svg")
    .attr("width", vis.svgWidth)
    .attr("height", vis.svgHeight);
  var season = document.getElementById('ranking-type-tree').value;
  console.log(season);
  vis.loadData(season);
};

Bio.prototype.loadData = function(season) {
  var vis = this;
  var dataset = Array.from(vis.data);
  for (var i = 0; i < dataset.length; ++i) {
    if (dataset[i].Season == season) {
      vis.displayData = dataset[i];
    }
  }
  console.log(vis.displayData);
  vis.update();
};




Bio.prototype.update = function() {
  var vis = this;
  vis.svg.selectAll("circle").remove();
  vis.svg.selectAll("text").remove();
  vis.svg.selectAll("image").remove();
  if (vis.displayData["Last Name - Winner"] == "Winner") {
    vis.svg.append("text")
      .text(vis.displayData["First Name - Bachelor"] + " " + vis.displayData["Last Name - Bachelor"])
      .attr("x", vis.svgWidth / 2)
      .attr("y", 60)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 18);
    vis.svg.append("image")
      .attr("xlink:href", vis.displayData.Picture)
      .attr("height", 180)
      .attr("width", 180)
      .attr("x", function() {
        return (vis.svgWidth - 180) / 2;
      })
      .attr("y", 110);
    vis.svg.append("text")
      .text("Outcome:")
      .attr("x", vis.svgWidth / 2)
      .attr("y", 320)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 15);
    vis.svg.append("text")
      .text(vis.displayData["Marriage Status"])
      .attr("x", vis.svgWidth / 2)
      .attr("y", 340)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 15);
  } else {
    vis.svg.append("text")
      .text(vis.displayData["First Name - Bachelor"] + " " + vis.displayData["Last Name - Bachelor"])
      .attr("x", vis.svgWidth / 2)
      .attr("y", 40)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 18);
    vis.svg.append("text")
      .text("and")
      .attr("x", vis.svgWidth / 2)
      .attr("y", 60)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 15);
    vis.svg.append("text")
      .text(vis.displayData["First Name - Winner"] + " " + vis.displayData["Last Name - Winner"])
      .attr("x", vis.svgWidth / 2)
      .attr("y", 80)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 18);
    vis.svg.append("image")
      .attr("xlink:href", vis.displayData.Picture)
      .attr("height", 180)
      .attr("width", 180)
      .attr("x", function() {
        return (vis.svgWidth - 180) / 2;
      })
      .attr("y", 110);
    vis.svg.append("text")
      .text("Relationship Outcome:")
      .attr("x", vis.svgWidth / 2)
      .attr("y", 320)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 15);
    vis.svg.append("text")
      .text(vis.displayData["Marriage Status"])
      .attr("x", vis.svgWidth / 2)
      .attr("y", 340)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 15);
  }
}
