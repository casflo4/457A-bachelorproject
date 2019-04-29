/**
 * Constructor for the SeasonTree
 * @param _allData all data
 **/
function SeasonTree(_allData) {
  var vis = this;

  this.data = _allData;

  vis.displayData = [];

  vis.init();

  vis.div = d3.select("#tree").append("div").attr("class", "tooltip").style("opacity", 0); //tooltip
};

/**
 * Init vis
 **/
SeasonTree.prototype.init = function() {
  var vis = this;
  self.margin = {
    top: 10,
    right: 20,
    bottom: 30,
    left: 20
  };

  //create the svg
  var div = d3.select("#tree").classed("view", true);
  vis.svgWidth = div.node().getBoundingClientRect().width - self.margin.left - self.margin.right - 50;
  vis.svgHeight = 570;
  vis.imgWidth = 195.84;
  vis.svg = div.append("svg")
    .attr("width", vis.svgWidth + 50)
    .attr("height", vis.svgHeight);
    //get season from page
  var season = document.getElementById('ranking-type-tree').value;
  //load the data with the season parameter
  vis.loadData(season);
};

/**
 * Loads the data
 * @param season current season data being visualized
 **/
SeasonTree.prototype.loadData = function(season) {
  var vis = this;
  //clear display Data array
  vis.displayData = [];
  var finalWeek = 0;
  vis.displayData[0] = [];
  //iterate through data
  vis.data.forEach(function(a) {
    if (parseInt(a.Season) == season) {
        //set the 0 element of the array to the winner
      if (a.Outcome == "Winner") {
        vis.displayData[0] = [{
          first_name: a.Name,
          elimination_week: a.Elimination_Week,
          last_name: a['Last Name'],
          occupation: a.Occupation,
          age: +a.Age,
          city: a.City,
          state: a.State,
          country: a.Country,
          place: a.Place
        }];
      }
      //set final week as the max elimination week
      if (a.Elimination_Week > finalWeek) {
        finalWeek = a.Elimination_Week;
      }
    }
  });
  //add data to array in order of place
  //each row is an elimination week
  for (var i = finalWeek; i > 0; --i) {
    var row = [];
    vis.data.forEach(function(a) {
      if (parseInt(a.Season) == season) {
        if (a.Elimination_Week == i && a.Outcome != "Winner") {
          row.push({
            first_name: a.Name,
            elimination_week: a.Elimination_Week,
            last_name: a['Last Name'],
            occupation: a.Occupation,
            age: +a.Age,
            city: a.City,
            state: a.State,
            country: a.Country,
            place: a.Place
          });
        }
      }
    });
    //add the row to the displaydata
    if (row.length != 0) {
      vis.displayData.push(row);
    }
//update the vis with the new data
  vis.update();
}
};

/**
 * Creates updates the chart
 **/
SeasonTree.prototype.update = function() {
  var vis = this;
  //add background image to svg
  vis.svg.selectAll("image").remove();
  vis.svg.append("image")
    .attr("xlink:href", "public/css/images/rose.png")
    .attr("height", 570)
    .attr("width", 177.48)
    .attr("x", function() {
      return (vis.svgWidth - vis.imgWidth) / 2;
    })
    .style("opacity", 0.6);
    //remove all circles and text from svg
  vis.svg.selectAll("circle").remove();
  vis.svg.selectAll("text").remove();
  //if there is a winner, append circle and text for winner
  if (vis.displayData[0].length != 0) {
    //create winner circle with tooltip
    vis.svg.append("circle")
      .attr("r", 35)
      .attr("cx", vis.svgWidth / 2 - 20)
      .attr("cy", 85)
      .data(vis.displayData[0])
      .on("mouseover", function(d) {
        vis.div.transition().duration(200).style("opacity", .9);
        vis.div.html("<strong>" + d.first_name + " " + d.last_name + "</strong>, " + d.age + "<br><p>" +
            d.city + ", " + d.state + ", " + d.country + "<br>" +
            d.occupation + "</p>")
          .style("left", (d3.event.pageX) - 345 + "px")
          .style("top", (d3.event.pageY) - 910 + "px")
          .attr("class", "d3-tip");

      })
      .on("mouseout", function(d) {
        vis.div.transition().duration(500).style("opacity", 0);
      })
      .on("mousemove", function(d) {
        vis.div
          .style("left", (d3.event.pageX) - 345 + "px")
          .style("top", (d3.event.pageY) - 910 + "px");
      });
      //create winner text with tooltip
    vis.svg.append("text")
      .text(vis.displayData[0][0].first_name)
      .attr("x", vis.svgWidth / 2 - 20)
      .attr("y", 85)
      .style("fill", "white")
      .style("text-anchor", "middle")
      .style("font-size", 14)
      .data(vis.displayData[0])
      .on("mouseover", function(d) {
        vis.div.transition().duration(200).style("opacity", .9);
        vis.div.html("<strong>" + d.first_name + " " + d.last_name + "</strong>, " + d.age + "<br><p>" +
            d.city + ", " + d.state + ", " + d.country + "<br>" +
            d.occupation + "</p>")
          .style("left", (d3.event.pageX) - 345 + "px")
          .style("top", (d3.event.pageY) - 910 + "px")
          .attr("class", "d3-tip");

      })
      .on("mouseout", function(d) {
        vis.div.transition().duration(500).style("opacity", 0);
      })
      .on("mousemove", function(d) {
        vis.div
          .style("left", (d3.event.pageX) - 345 + "px")
          .style("top", (d3.event.pageY) - 910 + "px");
      });
      //append text "winner"
    vis.svg.append("text")
      .text("Winner")
      .attr("x", vis.svgWidth / 2 - 20)
      .attr("y", 21)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 28)
  }
  //iterate through dataset and create circles for each contestant
  var row = 0;
  for (var i = 1; i < vis.displayData.length; ++i) {
    //increment row when for loop increments
    row += 1;
    //append text to show elimination week
    vis.svg.append("text")
      .text("Eliminated Week " + vis.displayData[i][0].elimination_week)
      .attr("x", function() {
        if (i % 2 == 0) {
          return vis.svgWidth / 2 - 145;
        } else {
          return vis.svgWidth / 2 + 130;
        }
      })
      .attr("y", function() {
        return 78 + 45 * (row);
      })
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", 18)
      //iterate through each contestant eliminated that week
    for (var j = 0; j < vis.displayData[i].length; ++j) {
        //if the contestant is the 6th or 12th increment the row
      if (j == 6 || j == 12) {
        row += 1;
      }
      //create circles for each contestant that week
      vis.svg.append("circle")
        .attr("r", 22)
        .attr("cx", function() {
            //set x position based on which contestant they are
          if (j > 11 && i % 2 == 0) {

            return vis.svgWidth / 2 - 45 - 45 * (j - 12);
          } else if (j > 11) {
            return vis.svgWidth / 2 + 40 + 45 * (j - 12);
          } else if (j > 5 && i % 2 == 0) {

            return vis.svgWidth / 2 - 45 - 45 * (j - 6);
          } else if (j > 5) {
            return vis.svgWidth / 2 + 40 + 45 * (j - 6);
          }
          if (i % 2 == 0) {
            return vis.svgWidth / 2 - 45 - 45 * j;
          } else {
            return vis.svgWidth / 2 + 40 + 45 * j;
          }
        })
        .attr("cy", function() {
            //set y position based on current row
          return 108 + 45 * (row);
        })
        .datum(vis.displayData[i][j])
        .on("mouseover", function(d) {
          vis.div.transition().duration(200).style("opacity", .9);
          vis.div.html("<strong>" + d.first_name + " " + d.last_name + "</strong>, " + d.age + "<br><p>" +
              d.city + ", " + d.state + ", " + d.country + "<br>" +
              d.occupation + "</p>")
            .style("left", (d3.event.pageX) - 345 + "px")
            .style("top", (d3.event.pageY) - 910 + "px")
            .attr("class", "d3-tip");

        })
        .on("mouseout", function(d) {
          vis.div.transition().duration(500).style("opacity", 0);
        })
        .on("mousemove", function(d) {
          vis.div
            .style("left", (d3.event.pageX) - 345 + "px")
            .style("top", (d3.event.pageY) - 910 + "px");
        });
        //append text for each contestant's name
      vis.svg.append("text")
        .text(vis.displayData[i][j].first_name)
        .attr("x", function() {
            //set x position based on position in array
          if (j > 11 && i % 2 == 0) {

            return vis.svgWidth / 2 - 45 - 45 * (j - 12);
          } else if (j > 11) {
            return vis.svgWidth / 2 + 40 + 45 * (j - 12);
          } else if (j > 5 && i % 2 == 0) {

            return vis.svgWidth / 2 - 45 - 45 * (j - 6);
          } else if (j > 5) {
            return vis.svgWidth / 2 + 40 + 45 * (j - 6);
          }
          if (i % 2 == 0) {
            return vis.svgWidth / 2 - 45 - 45 * j;
          } else {
            return vis.svgWidth / 2 + 40 + 45 * j;
          }
        })
        .attr("y", function() {
            //set y position based on row
          return 108 + 45 * (row);
        })
        .style("fill", "white")
        .style("text-anchor", "middle")
        .style("font-size", 6)
        .datum(vis.displayData[i][j])
        .on("mouseover", function(d) {
          vis.div.transition().duration(200).style("opacity", .9);
          vis.div.html("<strong>" + d.first_name + " " + d.last_name + "</strong>, " + d.age + "<br><p>" +
              d.city + ", " + d.state + ", " + d.country + "<br>" +
              d.occupation + "</p>")
            .style("left", (d3.event.pageX) - 345 + "px")
            .style("top", (d3.event.pageY) - 910 + "px")
            .attr("class", "d3-tip");

        })
        .on("mouseout", function(d) {
          vis.div.transition().duration(500).style("opacity", 0);
        })
        .on("mousemove", function(d) {
          vis.div
            .style("left", (d3.event.pageX) - 345 + "px")
            .style("top", (d3.event.pageY) - 910 + "px");
        });
    }
  }
}
