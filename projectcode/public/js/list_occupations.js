function ListOccupations(_allData, _categoriesData) {
  var vis = this;

  vis.data = _allData;

  vis.categoriesData = _categoriesData;

  vis.displayData = {};

  vis.best_unique = [];
  vis.worst_unique = [];
  vis.best_common = [];
  vis.worst_common = [];

  vis.arr = [];

  vis.init();
};

ListOccupations.prototype.init = function() {
  var vis = this;
  vis.margin = {
    top: 10,
    right: 20,
    bottom: 30,
    left: 50
  };

  //selects the div from html
  var div = d3.select("#list-occupations").classed("view", true);

  vis.svgWidth = 500;
  vis.svgHeight = 480;

  vis.svg = div.append("svg")
    .attr("width", vis.svgWidth)
    .attr("height", vis.svgHeight)

  vis.wrangleData();
};

ListOccupations.prototype.wrangleData = function() {
  var vis = this;

  vis.categoriesData.forEach(function(d) {
    d.Elimination_Week = +d.Elimination_Week;
  });

  //groups the data by occupation, giving each a value of count and average elimination week
  var nest = d3.nest()
    .key(function(d) {
      return d.Occupation;
    })
    .rollup(function(leaves) {
      var sum = d3.sum(leaves, function(d) {
        return (d.Elimination_Week)
      });
      var count = leaves.length;
      var avg_elim_week = sum / count;
      return {
        "count": count,
        "avg_elim_week": avg_elim_week
      };
    })

  vis.displayData = nest.entries(vis.categoriesData);

  //return only unique jobs
  var uniqueJobs = vis.displayData.filter(function(d) {
    return d.value.count === 1;
  })

  //sort descending by elimination week to get the best unique jobs
  vis.best_unique = uniqueJobs.sort(function(a, b) {
    return b.value.avg_elim_week - a.value.avg_elim_week
  }).slice(0, 10);

  //sort ascending by elimination week to get the worst unique jobs
  vis.worst_unique = uniqueJobs.sort(function(a, b) {
    return a.value.avg_elim_week - b.value.avg_elim_week
  }).slice(0, 10);


  // var commonJobs = vis.displayData.filter(function(d){
  //     return d.value.count > 3;
  // })

  // vis.best_common = commonJobs.sort(function(a,b){
  //     return b.value.avg_elim_week - a.value.avg_elim_week
  // }).slice(0,10);

  // vis.worst_common = commonJobs.sort(function(a,b){
  //     return a.value.avg_elim_week - b.value.avg_elim_week
  // }).slice(0,10);

  //Check the toggle button for if the user wants to view the worst or best jobs
  //Change the array being used in the update function based on the user's selection
  $(document).ready(function() {
    if (toggle.checked == true) {
      vis.arr = vis.best_unique;
    } else {
      vis.arr = vis.worst_unique;
    }
    $("#toggle").change(function() {
      if (vis.arr === vis.worst_unique) {
        vis.arr = vis.best_unique;
      } else {
        vis.arr = vis.worst_unique;
      }
      vis.update()
    })
  })

}

ListOccupations.prototype.update = function() {
  var vis = this;

  rowHeight = vis.svgHeight / 13;
  rowMargin = rowHeight / 2;

  vis.svg.selectAll(".jobtitle").remove();

  //add roses to the vis
  vis.svg.selectAll("image")
    .data(vis.arr)
    .enter()
    .append("image")
    .attr("xlink:href", "public/css/images/rose2.png")
    .attr("style", "opacity:.7")
    .attr("height", rowHeight)
    .attr("width", rowHeight)
    .attr("x", rowHeight / 2)
    .attr("y", function(d, i) {
      return rowHeight * i + rowMargin;
    })

//add numbers to the roses
  vis.svg.selectAll(".num")
    .data(vis.arr)
    .enter()
    .append("text")
    .attr("class", "num")
    .attr("x", function(d, i) {
      if (i + 1 == 10) {
        return rowHeight - rowHeight / 9 - 5;
      } else {
        return rowHeight - rowHeight / 9;
      }

    })
    .attr("y", function(d, i) {
      return rowHeight * (i + 1) + rowHeight / 10 + 1;
    })
    .style("fill", "white")
    .style("font-size", 18)
    .text(function(d, i) {
      var n = i + 1
      return n.toString();
    })

  //add job titles
  vis.svg.selectAll(".jobtitle")
    .data(vis.arr)
    .enter()
    .append("text")
    .attr("class", "jobtitle")
    .attr("x", rowHeight * 2)
    .attr("y", function(d, i) {
      return rowHeight * (i + 1) + rowHeight / 10;
    })
    .style("fill", "black")
    .style("font-size", 16)
    .text(function(d) {
      return d.key;
    })

}
