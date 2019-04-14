
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
    var divelectoralVotes = d3.select("#map").classed("content", true);
    self.svgBounds = 1000;//divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds - self.margin.left - self.margin.right;
    self.svgHeight = 1000;

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

        self.y = d3.scaleBand()
          .rangeRound([0, 50])
         .paddingInner(0.1);

        self.x = d3.scaleLinear()
            .range([0, self.svgWidth]);


        self.reptext =  self.svg.append("text")
            .attr("x",self.svgWidth-60)
            .attr("y",45)
            .attr("class","electoralVoteText");

        self.demtext = self.svg.append("text")
            .attr("x",30)
            .attr("y",45)
            .attr("class","electoralVoteText");

          self.indtext = self.svg.append("text")
            .attr("class","electoralVoteText");

            self.votestoWin = self.svg.append("text")
              .attr("x",self.svgWidth/2)
              .attr("y",40);
};

/**
 * Creates the map
 * @param newbysentence sentiment data based on each sentence for every story
 * @param newbystory sentimnent data for each story
 **/

LocChart.prototype.update = function(data1,data2,data3,data6,data7,data8,data9){
  var self = this;

};
