
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param brushSelection an instance of the BrushSelection class
 */
function LocMap(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
LocMap.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#map").classed("content", true);
    self.svgBounds = 500;//divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds - self.margin.left - self.margin.right;
    self.svgHeight = 500;

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

LocMap.prototype.update = function(data1,data2,data3){
  var self = this;
  map = L.map('map').setView([37.8, -96.9], 4.375);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

console.log(data3);

states = L.layerGroup().addTo(map);
 var count=0;
  data3.forEach(function(d,i){
    if (d.LatLng!=null){
    var marker = L.marker(d.LatLng).addTo(map);
    var popupContent = "<strong>Name: </strong>"+d.Name+" "+d["Last Name"];
    popupContent+= "<br/><strong>From: </strong>"+d.City+", "+d.State;
    popupContent+= "<br/><strong>Aired on: </strong>Season "+d.Season;
    popupContent+= "<br/><strong>Eliminated on: </strong>Week "+d.Elimination_Week;
    popupContent+= "<br/><strong>Occupation: </strong>"+d.Occupation;
    var marker = L.marker(d.LatLng)
       .bindPopup(popupContent)

    states.addLayer(marker);
  }
  else{
    //console.log(d);
    count++;
  }
  });
 //console.log(count);
};
