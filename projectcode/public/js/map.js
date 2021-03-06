/**
 * Constructor for the LocMap
 *
 * @param _data1 GeoJson data for region 1
 * @param _data2 GeoJson data for region 2
 * @param _data3 GeoJson data for region 3
 * @param _data4 GeoJson data for region 5
 */
function LocMap(_data1, _data2, _data3, _data4) {
  this.data1 = _data1;
  this.data2 = _data2;
  this.data3 = _data3;
  this.data4 = _data4;
  var self = this;
  self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
LocMap.prototype.init = function() {
  var self = this;
  self.margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
  };

  //Gets access to the div element created for this chart from HTML
  var divelectoralVotes = d3.select("#map").classed("content", true);
  self.svgBounds = 400; //divelectoralVotes.node().getBoundingClientRect().width;
  self.svgWidth = self.svgBounds - self.margin.left - self.margin.right;
  self.svgHeight = 400;

  //Icons from https://leafletjs.com/examples/custom-icons/
  self.greenIcon = L.icon({
    iconUrl: 'public/css/images/leaf-green.png',
    shadowUrl: 'public/css/images/leaf-shadow.png',

    iconSize: [38, 95], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  //Icons from https://leafletjs.com/examples/custom-icons/
  self.redIcon = L.icon({
    iconUrl: 'public/css/images/leaf-red.png',
    shadowUrl: 'public/css/images/leaf-shadow.png',

    iconSize: [38, 95], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  //Icons from https://leafletjs.com/examples/custom-icons/
  self.orangeIcon = L.icon({
    iconUrl: 'public/css/images/leaf-orange.png',
    shadowUrl: 'public/css/images/leaf-shadow.png',

    iconSize: [38, 95], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  //creates svg element within the div
  self.svg = divelectoralVotes.append("svg")
    .attr("width", self.svgWidth)
    .attr("height", self.svgHeight)

  //creates y scale
  self.y = d3.scaleBand()
    .rangeRound([0, 50])
    .paddingInner(0.1);

  //creates x scale
  self.x = d3.scaleLinear()
    .range([0, self.svgWidth]);

  //load basemap tile with url and attribution
  mapboxUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  mapboxAttribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  self.streets = L.tileLayer(mapboxUrl, {
    id: 'MapID',
    attribution: mapboxAttribution
  });

  //load the 4 regions into a regions array and add it as a layer group
  var regions = [];
  var geoJson1 = L.geoJson(this.data1, {
    style: {
      color: "#4281A4",
      opacity: 0.5
    },
    weight: 5,
    fillOpacity: 0.5,
  });

  regions.push(geoJson1);

  var geoJson2 = L.geoJson(this.data2, {
    style: {
      color: "#9CAFB7",
      opacity: 0.5
    },
    weight: 5,
    fillOpacity: 0.5,
  });

  regions.push(geoJson2);

  var geoJson3 = L.geoJson(this.data3, {
    style: {
      color: "#63ADF2",
      opacity: 0.5
    },
    weight: 5,
    fillOpacity: 0.5,
  });

  regions.push(geoJson3);

  var geoJson4 = L.geoJson(this.data4, {
    style: {
      color: "#545E75",
      opacity: 0.5
    },
    weight: 5,
    fillOpacity: 0.5,
  });

  regions.push(geoJson4);

  self.regions = L.layerGroup(regions);
};

/**
 * Creates the map
 * @param data1 candidate data #1
 * @param data2 candidate data #2
 * @param data3  candidate data #3
 **/

LocMap.prototype.update = function(data1, data2, data3) {
  var self = this;
  self.zoom = 4.375;

  //remove existing map if available
  if (self.map && self.map.remove) {
    self.map.off();
    self.map.remove();
  }

  winners = [];
  seasonlength = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  //go through the data and find the winners and add it to a layer group and bind popup
  data3.forEach(function(d, i) {
    d.LatLng.lat = d.LatLng.lat + Math.random() * .5;
    d.LatLng.lng = d.LatLng.lng + Math.random() * .5;
    if (parseInt(d.Elimination_Week) > seasonlength[parseInt(d.Season) - 1]) {
      seasonlength[parseInt(d.Season) - 1] = parseInt(d.Elimination_Week);
    }
    if (parseInt(d.Place) == 1 || d.Outcome == "Winner") {
      var popupContent = "<strong>Name: </strong>" + d.Name + " " + d["Last Name"];
      popupContent += "<br/><strong>From: </strong>" + d.City + ", " + d.State;
      popupContent += "<br/><strong>Aired on: </strong>Season " + d.Season;
      popupContent += "<br/><strong>Eliminated on: </strong>Week " + d.Elimination_Week;
      popupContent += "<br/><strong>Occupation: </strong>" + d.Occupation;
      var marker = L.marker(d.LatLng, {
          icon: self.greenIcon
        })
        .bindPopup(popupContent)
      winners.push(marker);
    }
  });
  winners = L.layerGroup(winners);

  var better = [];
  var worse = [];

  //go through the data and find the players who did better and worse than half
  betterthanhalf = data3.filter(function(d, i) {
    if (parseInt(d.Elimination_Week) >= (seasonlength[parseInt(d.Season) - 1] / 2)) {
      return d;
    }
  });

  worsethanhalf = data3.filter(function(d, i) {
    if (parseInt(d.Elimination_Week) < (seasonlength[parseInt(d.Season) - 1] / 2)) {
      return d;
    }
  });

  //go through the betterthanhalf and worsethan half data and add it to a layer group and bind popup
  betterthanhalf.forEach(function(d, i) {
    if (parseInt(d.Place) != 1 & !d.Outcome != "Winner") {
      var popupContent = "<strong>Name: </strong>" + d.Name + " " + d["Last Name"];
      popupContent += "<br/><strong>From: </strong>" + d.City + ", " + d.State;
      popupContent += "<br/><strong>Aired on: </strong>Season " + d.Season;
      popupContent += "<br/><strong>Eliminated on: </strong>Week " + d.Elimination_Week;
      popupContent += "<br/><strong>Occupation: </strong>" + d.Occupation;
      var marker = L.marker(d.LatLng, {
          icon: self.orangeIcon
        })
        .bindPopup(popupContent)
      better.push(marker);
    }
  });

  worsethanhalf.forEach(function(d, i) {
    if (parseInt(d.Place) != 1 & !d.Outcome != "Winner") {
      var popupContent = "<strong>Name: </strong>" + d.Name + " " + d["Last Name"];
      popupContent += "<br/><strong>From: </strong>" + d.City + ", " + d.State;
      popupContent += "<br/><strong>Aired on: </strong>Season " + d.Season;
      popupContent += "<br/><strong>Eliminated on: </strong>Week " + d.Elimination_Week;
      popupContent += "<br/><strong>Occupation: </strong>" + d.Occupation;
      var marker = L.marker(d.LatLng, {
          icon: self.redIcon
        })
        .bindPopup(popupContent)
      worse.push(marker);
    }
  });

  better = L.layerGroup(better);
  worse = L.layerGroup(worse);

  //instaniate the map
  self.map = L.map('map', {
    center: [37.8, -96.9],
    zoom: 3,
    layers: [self.streets, better, worse, self.regions, winners]
  });

  //create layers and add to the map
  var baseMaps = {
    "<span style='color: gray, opacity: .5'>Base Map</span>": self.streets
  };

  var overlayMaps = {
    "Regions": self.regions,
    "Contestants (eliminated after halfway point)": better,
    "Contestants (eliminated before halfway point)": worse,
    "Winners": winners
  };

  L.control.layers(baseMaps, overlayMaps).addTo(self.map);
};
