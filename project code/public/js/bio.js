//constructor
function Bio(_allData) {
  var vis = this;

  this.data = _allData;

  vis.displayData = {};

  vis.init();

};

//function init
Bio.prototype.init = function() {
  var vis = this;
  self.margin = {
    top: 10,
    right: 20,
    bottom: 30,
    left: 20
  };
  //create the svg for the bio
  var div = d3.select("#bio");
  vis.svgWidth = div.node().getBoundingClientRect().width;
  vis.svgHeight = 440;
  vis.svg = div.append("svg")
    .attr("width", vis.svgWidth)
    .attr("height", vis.svgHeight);
    //get season from page
  var season = document.getElementById('ranking-type-tree').value;
  //load data with season as param
  vis.loadData(season);
};

//function load data
//param season is the current season being visualized
Bio.prototype.loadData = function(season) {
  var vis = this;
  //create an array from the dataset
  var dataset = Array.from(vis.data);
  //select the correct season from the dataset as the displaydata
  for (var i = 0; i < dataset.length; ++i) {
    if (dataset[i].Season == season) {
      vis.displayData = dataset[i];
    }
  }
  //update the visualization
  vis.update();
};

//function update
Bio.prototype.update = function() {
  var vis = this;
  //remove all elements from svg
  vis.svg.selectAll("circle").remove();
  vis.svg.selectAll("text").remove();
  vis.svg.selectAll("image").remove();
  //if there is no winner, display accordingly
  if (vis.displayData["Last Name - Winner"] == "Winner") {
    //append name of bachelor
    vis.svg.append("text")
      .text(vis.displayData["First Name - Bachelor"] + " " + vis.displayData["Last Name - Bachelor"])
      .attr("x", vis.svgWidth / 2)
      .attr("y", 60)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 18);
      //append image of bachelor
    vis.svg.append("image")
      .attr("xlink:href", vis.displayData.Picture)
      .attr("height", 180)
      .attr("width", 180)
      .attr("x", function() {
        return (vis.svgWidth - 180) / 2;
      })
      .attr("y", 110);
      //append text outcome text
    vis.svg.append("text")
      .text("Outcome:")
      .attr("x", vis.svgWidth / 2)
      .attr("y", 320)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 15);
      //append status text
    vis.svg.append("text")
      .text(vis.displayData["Marriage Status"])
      .attr("x", vis.svgWidth / 2)
      .attr("y", 340)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 15);
  }
  //if there was a winner
  else {
    //append the bachelor's name
    vis.svg.append("text")
      .text(vis.displayData["First Name - Bachelor"] + " " + vis.displayData["Last Name - Bachelor"])
      .attr("x", vis.svgWidth / 2)
      .attr("y", 40)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 18);
      //append and
    vis.svg.append("text")
      .text("and")
      .attr("x", vis.svgWidth / 2)
      .attr("y", 60)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 15);
      //append winner name
    vis.svg.append("text")
      .text(vis.displayData["First Name - Winner"] + " " + vis.displayData["Last Name - Winner"])
      .attr("x", vis.svgWidth / 2)
      .attr("y", 80)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 18);
      //append image of couple
    vis.svg.append("image")
      .attr("xlink:href", vis.displayData.Picture)
      .attr("height", 180)
      .attr("width", 180)
      .attr("x", function() {
        return (vis.svgWidth - 180) / 2;
      })
      .attr("y", 110);
      //append relationship outcome text
    vis.svg.append("text")
      .text("Relationship Outcome:")
      .attr("x", vis.svgWidth / 2)
      .attr("y", 320)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 15);
      //append current status of relationship
    vis.svg.append("text")
      .text(vis.displayData["Marriage Status"])
      .attr("x", vis.svgWidth / 2)
      .attr("y", 340)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 15);
  }
}
