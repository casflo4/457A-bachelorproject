/**
 * Constructor for the LocChart
 */
function LocChart() {

  var self = this;
  self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
LocChart.prototype.init = function() {
  var self = this;
  self.margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
  };

  //Gets access to the div element created for this chart from HTML
  var divelectoralVotes = d3.select("#map3").classed("content", true);
  self.svgBounds = 750; //divelectoralVotes.node().getBoundingClientRect().width;
  self.svgWidth = self.svgBounds - self.margin.left - self.margin.right;
  self.svgHeight = 400;

  //creates svg element within the div
  self.svg = divelectoralVotes.append("svg")
    .attr("width", self.svgWidth)
    .attr("height", self.svgHeight)

  //creates x scale
  self.x = d3.scaleBand()
    .range([0, self.svgWidth - 51])
    .paddingInner(0.2)
    .domain(d3.range(0, 50));

  //creates y scale
  self.y = d3.scaleLinear()
    .range([self.svgHeight - 25, 80]);

  //creates x axis
  self.xAxis = d3.axisBottom()
    .scale(self.x);

  //creates g for x axis
  self.svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + self.svgHeight + ")");

  //creates g for y axis
  self.svg.append("g")
    .attr("class", "y-axis axis");

  //x axis title
  self.svg.append("text")
    .attr("x", self.svgWidth / 2 - 10)
    .attr("y", self.svgHeight)
    .text("Home Location");

  //graph title
  self.svg.append("text")
    .attr("x", self.svgWidth / 2 - 100)
    .attr("y", 15)
    .text("Bachelor Candidate Success By Home Locations");

  //y axis title
  self.svg.append("text")
    .attr("x", -220)
    .attr("y", 20)
    .text("# of Candidates")
    .attr("transform", "rotate(270)");
};
/**
 * Assigns region to state
 */
LocChart.prototype.chooseloc = function(d) {
  if (d.key == "Alabama") {
    return "South";
  } else if (d.key == "Alaska") {
    return "West";
  } else if (d.key == "Arizona") {
    return "South";
  } else if (d.key == "Arkansas") {
    return "South";
  } else if (d.key == "California") {
    return "West";
  } else if (d.key == "Colorado") {
    return "West";
  } else if (d.key == "Connecticut") {
    return "Northeast";
  } else if (d.key == "Delaware") {
    return "South";
  } else if (d.key == "D.C.") {
    return "South";
  } else if (d.key == "Florida") {
    return "South";
  } else if (d.key == "Georgia") {
    return "South";
  } else if (d.key == "Hawaii") {
    return "West";
  } else if (d.key == "Idaho") {
    return "West";
  } else if (d.key == "Illinois") {
    return "Midwest";
  } else if (d.key == "Indiana") {
    return "Midwest";
  } else if (d.key == "Iowa") {
    return "Midwest";
  } else if (d.key == "Kansas") {
    return "Midwest";
  } else if (d.key == "Kentucky") {
    return "South";
  } else if (d.key == "Louisiana") {
    return "South";
  } else if (d.key == "Maine") {
    return "Northeast";
  } else if (d.key == "Maryland") {
    return "South";
  } else if (d.key == "Massachusetts") {
    return "Northeast";
  } else if (d.key == "Michigan") {
    return "Northeast";
  } else if (d.key == "Minnesota") {
    return "Midwest";
  } else if (d.key == "Mississippi") {
    return "South";
  } else if (d.key == "Missouri") {
    return "Midwest";
  } else if (d.key == "Montana") {
    return "West";
  } else if (d.key == "Nebraska") {
    return "Midwest";
  } else if (d.key == "Nevada") {
    return "West";
  } else if (d.key == "New Hampshire") {
    return "Northeast";
  } else if (d.key == "New Jersey") {
    return "Northeast";
  } else if (d.key == "New Mexico") {
    return "West";
  } else if (d.key == "New York") {
    return "Northeast";
  } else if (d.key == "North Carolina") {
    return "South";
  } else if (d.key == "North Dakota") {
    return "Midwest";
  } else if (d.key == "Ohio") {
    return "Midwest";
  } else if (d.key == "Oklahoma") {
    return "South";
  } else if (d.key == "Oregon") {
    return "West";
  } else if (d.key == "Pennsylvania") {
    return "Northeast";
  } else if (d.key == "Rhode Island") {
    return "Northeast";
  } else if (d.key == "South Carolina") {
    return "South";
  } else if (d.key == "South Dakota") {
    return "Midwest";
  } else if (d.key == "Tennessee") {
    return "South";
  } else if (d.key == "Texas") {
    return "South";
  } else if (d.key == "Utah") {
    return "West";
  } else if (d.key == "Vermont") {
    return "Northeast";
  } else if (d.key == "Virginia") {
    return "South";
  } else if (d.key == "Washington") {
    return "West";
  } else if (d.key == "West Virginia") {
    return "South";
  } else if (d.key == "Wisconsin") {
    return "Midwest";
  } else if (d.key == "Wyoming") {
    return "West";
  } else {
    return "None";
  }
}

/**
 * Creates the chart
 * @param data1 candidate data #1
 * @param data2 candidate data #2
 * @param data3  candidate data #3
 **/
LocChart.prototype.update = function(data1, data2, data3) {
  //removes existing rects
  d3.selectAll(".axis").remove().exit();
  d3.selectAll("rect").remove().exit();

  var self = this;

  self.worseCount = 0;
  seasonlength = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  //calculates the number of contestants in each season
  data3.forEach(function(d, i) {
    if (parseInt(d.Elimination_Week) > seasonlength[parseInt(d.Season) - 1]) {
      seasonlength[parseInt(d.Season) - 1] = parseInt(d.Elimination_Week);
    }
  });

  //nests contestants based on state and combining results D.C and D.C.
  var og = d3.nest()
    .key(function(d) {
      if (d.State == "D.C") {
        return "D.C.";
      } else {
        return d.State;
      }
    })
    .entries(data3);

  //filtering the winners
  var winners = data3.filter(function(d, i) {
    if (parseInt(d.Place) == 1 || d.Outcome == "Winner") {
      return d;
    }
  });

  //nests winners based on state and combining results D.C and D.C.
  var winnersnested = d3.nest()
    .key(function(d) {
      if (d.State == "D.C") {
        return "D.C.";
      } else {
        return d.State;
      }
    })
    .entries(winners);

  //sorted nested contestants
  og.sort(function(x, y) {
    return d3.descending(x.values.length, y.values.length);
  });

  //input x's domain based on the contestants state
  self.x.domain(og.map(function(d) {
    return d.key;
  }))

  //determine the width based upon the number of states present for the season
  self.newwidth = (self.svgWidth - 45) / og.length;

  //input x's domain based on the state with the most contestants
  self.y.domain([0, og[0].values.length]);

  values = [];
  var x = 0;

  //change bounds based upon max y value
  if (og[0].values.length == 66) {
    while (x <= og[0].values.length) {
      values.push(x);
      x += 3;
    }
  } else {
    while (x <= og[0].values.length) {
      values.push(x);
      x++;
    }
  }

  //create y axis
  self.yAxis = d3.axisLeft()
    .scale(self.y)
    .tickValues(values)
    .tickFormat(d => (d));

  //create base rects for worse than half
  var rect = self.svg.selectAll("rect")
    .data(og);

  rect.enter().append("rect")
    .transition()
    .duration(250)
    .ease(d3.easeLinear)
    .attr("fill", function(d, i) {
      return "rgb(225,75,108)";
    })
    .attr("y", function(d, i) {
      //count non-winners into better and worse than half
      self.worseCount = 0;
      self.betterCount = 0;
      self.winner = 0;
      d.values.forEach(function(d1, i) {
        if (parseInt(d1.Place) == 1 || d1.Outcome == "Winner") {
          self.winner++;
        } else {
          if (parseInt(d1.Elimination_Week) >= (seasonlength[parseInt(d1.Season) - 1] / 2)) {
            self.betterCount++;
          } else {
            self.worseCount++;
          }
        }
      });

      //figure the vertical length of 1 contestant
      lengthofsegment = (self.svgHeight - 25 - 80) / og[0].values.length;

      //append more rectancles for better than half
      self.svg.append("rect")
        .transition()
        .duration(250)
        .ease(d3.easeLinear)
        .attr("fill", function() {
          return "rgb(243,188,65)";
        })
        .attr("y", function() {
          return self.svgHeight - self.winner * lengthofsegment - self.betterCount * lengthofsegment - 80;
        })
        .attr("x", function() {
          return (self.newwidth * i) + 50;
        })
        .attr("width", self.newwidth - 5)
        .attr("height", function() {
          return self.betterCount * lengthofsegment;
        });

      //return y for worse than half
      return self.svgHeight - self.winner * lengthofsegment - self.worseCount * lengthofsegment - self.betterCount * lengthofsegment - 80;
    })
    .attr("x", function(d, i) {
      return (self.newwidth * i) + 50;
    })
    .attr("width", self.newwidth - 5)
    .attr("height", function(d, i) {

      //append winner rects
      winnersnested.forEach(function(d1, i1) {
        if (d1.key == d.key) {
          self.svg.append("rect")
            .transition()
            .duration(250)
            .ease(d3.easeLinear)
            .attr("fill", function() {
              return "rgb(174,221,92)";
            })
            .attr("y", function() {
              return self.svgHeight - (d1.values.length * lengthofsegment) - 80;
            })
            .attr("x", function() {
              return (self.newwidth * i) + 50;
            })
            .attr("width", self.newwidth - 5)
            .attr("height", function() {
              return d1.values.length * lengthofsegment;
            });
        }
      })
      //calculate height of worse than half rect
      self.worseCount = 0;
      self.betterCount = 0;
      self.winner = 0;
      d.values.forEach(function(d1, i) {
        if (parseInt(d1.Place) == 1 || d1.Outcome == "Winner") {
          self.winner++;
        } else {
          if (parseInt(d1.Elimination_Week) >= (seasonlength[parseInt(d1.Season) - 1] / 2)) {
            self.betterCount++;
          } else {
            self.worseCount++;
          }
        }
      });

      return self.worseCount * lengthofsegment;
    })

  //append x axis and rotate
  var groupx = self.svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(" + self.margin.left + "," + (self.svgHeight - self.margin.bottom - 50) + ")")
    .call(self.xAxis)
    .selectAll("text")
    .text(function(d) {
      if (d == "") {
        return "Other";
      } else {
        return d;
      }
    })
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
      return "rotate(-45)"
    });

  //append y axis and rotate
  var groupy = self.svg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", "translate(" + self.margin.left + "," + (self.margin.top - 85) + ")")
    .call(self.yAxis);
};
