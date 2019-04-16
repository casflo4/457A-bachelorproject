
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
    self.svgBounds = 750;//divelectoralVotes.node().getBoundingClientRect().width;
    self.svgWidth = self.svgBounds - self.margin.left - self.margin.right;
    self.svgHeight = 500;

    self.greenIcon = L.icon({
    iconUrl: 'public/css/images/leaf-green.png',
    shadowUrl: 'public/css/images/leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

self.redIcon = L.icon({
iconUrl: 'public/css/images/leaf-red.png',
shadowUrl: 'public/css/images/leaf-shadow.png',

iconSize:     [38, 95], // size of the icon
shadowSize:   [50, 64], // size of the shadow
iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
shadowAnchor: [4, 62],  // the same for the shadow
popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

self.orangeIcon = L.icon({
iconUrl: 'public/css/images/leaf-orange.png',
shadowUrl: 'public/css/images/leaf-shadow.png',

iconSize:     [38, 95], // size of the icon
shadowSize:   [50, 64], // size of the shadow
iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
shadowAnchor: [4, 62],  // the same for the shadow
popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

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
              mapboxUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
              mapboxAttribution =  '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
              self.streets = L.tileLayer(mapboxUrl, {id: 'MapID', attribution: mapboxAttribution});
};

/**
 * Creates the map
 * @param newbysentence sentiment data based on each sentence for every story
 * @param newbystory sentimnent data for each story
 **/

LocMap.prototype.update = function(data1,data2,data3,data6,data7,data8,data9){
  var self = this;
  self.zoom = 4.375;
  if (self.map && self.map.remove) {
  self.map.off();
  self.map.remove();
}

  winners = [];
  seasonlength = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  data3.forEach(function(d,i){
    if (parseInt(d.Elimination_Week)>seasonlength[parseInt(d.Season)-1]){
      seasonlength[parseInt(d.Season)-1] = parseInt(d.Elimination_Week);
    }
    if (parseInt(d.Place)==1 || d.Outcome=="Winner"){
      var popupContent = "<strong>Name: </strong>"+d.Name+" "+d["Last Name"];
      popupContent+= "<br/><strong>From: </strong>"+d.City+", "+d.State;
      popupContent+= "<br/><strong>Aired on: </strong>Season "+d.Season;
      popupContent+= "<br/><strong>Eliminated on: </strong>Week "+d.Elimination_Week;
      popupContent+= "<br/><strong>Occupation: </strong>"+d.Occupation;
      var marker = L.marker(d.LatLng,{icon: self.greenIcon})
         .bindPopup(popupContent)
      winners.push(marker);
    }
  });
winners = L.layerGroup(winners);
  var better = [];
  var worse = [];
  var regions = [];
  betterthanhalf = data3.filter(function(d,i){
    if (parseInt(d.Elimination_Week)>=(seasonlength[parseInt(d.Season)-1]/2)){
      return d;
    }
  });

  worsethanhalf = data3.filter(function(d,i){
    if (parseInt(d.Elimination_Week)<(seasonlength[parseInt(d.Season)-1]/2)){
      return d;
    }
  });

    betterthanhalf.forEach(function(d,i){
        if (parseInt(d.Place)!=1 & !d.Outcome!="Winner"){
      var popupContent = "<strong>Name: </strong>"+d.Name+" "+d["Last Name"];
      popupContent+= "<br/><strong>From: </strong>"+d.City+", "+d.State;
      popupContent+= "<br/><strong>Aired on: </strong>Season "+d.Season;
      popupContent+= "<br/><strong>Eliminated on: </strong>Week "+d.Elimination_Week;
      popupContent+= "<br/><strong>Occupation: </strong>"+d.Occupation;
        var marker = L.marker(d.LatLng,{icon: self.orangeIcon})
           .bindPopup(popupContent)
      better.push(marker);
    }
  });

  worsethanhalf.forEach(function(d,i){
      if (parseInt(d.Place)!=1 & !d.Outcome!="Winner"){
    var popupContent = "<strong>Name: </strong>"+d.Name+" "+d["Last Name"];
    popupContent+= "<br/><strong>From: </strong>"+d.City+", "+d.State;
    popupContent+= "<br/><strong>Aired on: </strong>Season "+d.Season;
    popupContent+= "<br/><strong>Eliminated on: </strong>Week "+d.Elimination_Week;
    popupContent+= "<br/><strong>Occupation: </strong>"+d.Occupation;
      var marker = L.marker(d.LatLng,{icon: self.redIcon})
         .bindPopup(popupContent)
    worse.push(marker);
  }
});

  better = L.layerGroup(better);
  worse = L.layerGroup(worse);

  var geoJson1 = L.geoJson(data6, {
    style: {color: "#4281A4", opacity: 0.5},
    weight: 5,
    fillOpacity: 0.5,
  });

  regions.push(geoJson1);

  var geoJson2 = L.geoJson(data7, {
    style: {color: "#9CAFB7", opacity: 0.5},
    weight: 5,
    fillOpacity: 0.5,
  });

  regions.push(geoJson2);

  var geoJson3 = L.geoJson(data8, {
    style: {color: "#63ADF2", opacity: 0.5},
    weight: 5,
    fillOpacity: 0.5,
  });

  regions.push(geoJson3);

  var geoJson4 = L.geoJson(data9, {
    style: {color: "#545E75", opacity: 0.5},
    weight: 5,
    fillOpacity: 0.5,
  });

  regions.push(geoJson4);

  regions = L.layerGroup(regions);


  self.map = L.map('map', {
      center: [37.8, -96.9],
      zoom: 3,
      //removeOutsideVisibleBounds: true,
      layers: [self.streets, better, worse,regions, winners]
  });
  var baseMaps = {
    "<span style='color: gray, opacity: .5'>Streets</span>": self.streets
  };

  var overlayMaps = {
      "Regions": regions,
      "Contestants (eliminated after halfway point)": better,
      "Contestants (eliminated before halfway point)": worse,
      "Winners": winners
  };

  L.control.layers(baseMaps, overlayMaps).addTo(self.map);
};
