
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param brushSelection an instance of the BrushSelection class
 */
function LocChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
LocChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#map3").classed("content", true);
    self.svgBounds = 1440;//divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds - self.margin.left - self.margin.right;
    self.svgHeight = 750;

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

      /*  self.y = d3.scaleBand()
          .rangeRound([0, 50])
         .paddingInner(0.1);

        self.x = d3.scaleLinear()
            .range([0, self.svgWidth]);*/

            self.x = d3.scaleBand()
              .rangeRound([0,self.svgWidth-150])
              .paddingInner(0.2)
              .domain(d3.range(1,50));

    self.y = d3.scaleLinear()
        .range([self.svgHeight,110]);

    self.xAxis = d3.axisBottom()
        .scale(self.x);

    self.yAxis = d3.axisLeft()
        .scale(self.y);

    self.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + self.svgHeight + ")");

    self.svg.append("g")
        .attr("class", "y-axis axis");

    // Axis title
    self.svg.append("text")
        .attr("x", self.svgWidth/2 - 100)
        .attr("y", self.svgHeight)
        .text("Bachelor Candidate Home Locations");

  self.svg.append("text")
            .attr("x", self.svgWidth/2-100)
            .attr("y", 15)
            .text("Bachelor Candidate Success By State");

  self.svg.append("text")
      .attr("x", -390)
      .attr("y", 20)
      .text("# of Candidates")
      .attr("transform", "rotate(270)");
};

LocChart.prototype.chooseloc = function (d) {
  if(d.key == "Alabama"){
    return "South";
  }
  else if(d.key == "Alaska"){
    return "West";
  }
  else if(d.key == "Arizona"){
    return "South";
  }
  else if(d.key == "Arkansas"){
      return "South";
  }
  else if(d.key == "California"){
    return "West";
  }
  else if(d.key == "Colorado"){
    return "West";
  }
  else if(d.key == "Connecticut"){
    return "Northeast";
  }
  else if(d.key == "Delaware"){
      return "South";
  }
  else if(d.key == "D.C."){
      return "South";
  }
  else if(d.key == "Florida"){
      return "South";
  }
  else if(d.key == "Georgia"){
    return "South";
  }
  else if(d.key == "Hawaii"){
    return "West";
  }
  else if(d.key == "Idaho"){
    return "West";
  }
  else if(d.key == "Illinois"){
    return "Midwest";
  }
  else if(d.key == "Indiana"){
      return "Midwest";
  }
  else if(d.key == "Iowa"){
      return "Midwest";
  }
  else if(d.key == "Kansas"){
    return "Midwest";
  }
  else if(d.key == "Kentucky"){
      return "South";
  }
  else if(d.key == "Louisiana"){
      return "South";
  }
  else if(d.key == "Maine"){
    return "Northeast";
  }
  else if(d.key == "Maryland"){
    return "South";
  }
  else if(d.key == "Massachusetts"){
     return "Northeast";
  }
  else if(d.key == "Michigan"){
    return "Northeast";
  }
  else if(d.key == "Minnesota"){
      return "Midwest";
  }
  else if(d.key == "Mississippi"){
    return "South";
  }
  else if(d.key == "Missouri"){
      return "Midwest";
  }
  else if(d.key == "Montana"){
    return "West";
  }
  else if(d.key == "Nebraska"){
      return "Midwest";
  }
  else if(d.key == "Nevada"){
    return "West";
  }
  else if(d.key == "New Hampshire"){
      return "Northeast";
  }
  else if(d.key == "New Jersey"){
    return "Northeast";
  }
  else if(d.key == "New Mexico"){
    return "West";
  }
  else if(d.key == "New York"){
    return "Northeast";
  }
  else if(d.key == "North Carolina"){
    return "South";
  }
  else if(d.key == "North Dakota"){
      return "Midwest";
  }
  else if(d.key == "Ohio"){
      return "Midwest";
  }
  else if(d.key == "Oklahoma"){
      return "South";
  }
  else if(d.key == "Oregon"){
    return "West";
  }
  else if(d.key == "Pennsylvania"){
    return "Northeast";
  }
  else if(d.key == "Rhode Island"){
    return "Northeast";
  }
  else if(d.key == "South Carolina"){
    return "South";
  }
  else if(d.key == "South Dakota"){
      return "Midwest";
  }
  else if(d.key == "Tennessee"){
      return "South";
  }
  else if(d.key == "Texas"){
      return "South";
  }
  else if(d.key == "Utah"){
    return "West";
  }
  else if(d.key == "Vermont"){
      return "Northeast";
  }
  else if(d.key == "Virginia"){
      return "South";
  }
  else if(d.key == "Washington"){
    return "West";
  }
  else if(d.key == "West Virginia"){
      return "South";
  }
  else if(d.key == "Wisconsin"){
      return "Midwest";
  }
  else if(d.key == "Wyoming"){
  return "West";
  }
  else{
    return "None";
  }
}

/**
 * Creates the map
 * @param newbysentence sentiment data based on each sentence for every story
 * @param newbystory sentimnent data for each story
 **/

LocChart.prototype.update = function(data1,data2,data3,data6,data7,data8,data9){

  d3.selectAll(".axis").remove().exit();
  d3.selectAll("rect").remove().exit();

  var self = this;
self.worseCount = 0;
  seasonlength = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  data3.forEach(function(d,i){
    if (parseInt(d.Elimination_Week)>seasonlength[parseInt(d.Season)-1]){
      seasonlength[parseInt(d.Season)-1] = parseInt(d.Elimination_Week);
    }
  });

  var og = d3.nest()
      .key(function(d){
        if (d.State=="D.C"){
          return "D.C.";
        }
        else{
        return d.State;
      }
      })
      .entries(data3);

var winners = data3.filter(function(d,i){
      if (parseInt(d.Place)==1 || d.Outcome=="Winner"){
        return d;
      }
    });

var winnersnested = d3.nest()
    .key(function(d){
      if (d.State=="D.C"){
        return "D.C.";
      }
      else{
      return d.State;
    }
    })
    .entries(winners);

    og.sort(function(x,y){
      return d3.descending(x.values.length,y.values.length);
    });

    self.x.domain(og.map(function(d) {
        return d.key;
    }))

    self.newwidth = (self.svgWidth-144)/ og.length;

    self.y.domain([0,66]);

    var rect = self.svg.selectAll("rect")
         .data(og);
    rect.enter().append("rect")
          .attr("fill",function(d,i){
            /*
            if (LocChart.prototype.chooseloc(d)=="Northeast"){
              return 'rgba(99,173,242,.5)';//"#63ADF2";
            }
            else if (LocChart.prototype.chooseloc(d)=="Midwest"){
                return 'rgba(84,94,117,.5)';//"#545E75";
            }
            else if (LocChart.prototype.chooseloc(d)=="South"){
                return 'rgba(156,175,183,.5)';//"#9CAFB7";
            }
            else if (LocChart.prototype.chooseloc(d)=="West"){
                return 'rgba(66,1-29,164,.5)';//"#4281A4";
            }
            else{
              return "black";
            }*/
            return "rgb(225,75,108)";
          })
          .attr("y", function(d,i) {
            self.worseCount = 0;
            self.betterCount = 0;
            self.winner = 0;
            d.values.forEach(function(d1,i){
              if (parseInt(d1.Place)==1 || d1.Outcome=="Winner"){
                self.winner++;
              }
              else{
              if (parseInt(d1.Elimination_Week)>=(seasonlength[parseInt(d1.Season)-1]/2)){
                self.betterCount++;
              }
              else{
                self.worseCount++;
              }
            }
            });

            self.svg.append("rect")
                    .attr("fill",function(){
                      return "rgb(243,188,65)";
                    })
                    .attr("y", function() {
                      return self.svgHeight-self.winner*9.6969-self.betterCount*9.6969-80;
                    })
                    .attr("x", function() {
                        return (self.newwidth*i)+50;
                    })
                    .attr("width", self.newwidth-5)
                    .attr("height", function(){
                      return self.betterCount*9.6969;
                    });
            return self.svgHeight-self.winner*9.6969-self.worseCount*9.6969-self.betterCount*9.6969-80;
          })
          .attr("x", function(d,i) {
            return (self.newwidth*i)+50;
          })
          .attr("width", self.newwidth-5)
          .attr("height", function(d,i){
            winnersnested.forEach(function(d1,i1){
              if (d1.key==d.key){
                self.svg.append("rect")
                    .attr("fill",function(){
                      return "rgb(174,221,92)";
                    })
                    .attr("y", function() {
                      return self.svgHeight-(d1.values.length*9.6969)-80;
                    })
                    .attr("x", function() {
                        return (self.newwidth*i)+50;
                    })
                    .attr("width", self.newwidth-5)
                    .attr("height", function(){
                      return d1.values.length*9.6969;
                    });
              }
            })

            self.worseCount = 0;
            self.betterCount = 0;
            self.winner = 0;
            d.values.forEach(function(d1,i){
              if (parseInt(d1.Place)==1 || d1.Outcome=="Winner"){
                self.winner++;
              }
              else{
              if (parseInt(d1.Elimination_Week)>=(seasonlength[parseInt(d1.Season)-1]/2)){
                self.betterCount++;
              }
              else{
                self.worseCount++;
              }
            }
            });

            return self.worseCount*9.6969;
          })

      var groupx = self.svg.append("g")
    		.attr("class", "axis x-axis")
    		.attr("transform", "translate("+self.margin.left+","+(self.svgHeight-self.margin.bottom-50)+")")
      	.call(self.xAxis)
        .selectAll("text")
        .text(function(d){
          if (d==""){
            return "Other";
          }else{
              return d;
          }
        })
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-45)"
        });

    	var groupy = self.svg.append("g")
    			.attr("class", "axis y-axis")
    			.attr("transform", "translate("+self.margin.left+","+(self.margin.top-110)+")")
    			.call(self.yAxis);
};
