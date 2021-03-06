/*
 * Root file that handles instances of all the charts and loads the visualization
 */
(function() {
  var instance = null;

  /**
   * Creates instances for every chart (classes created to handle each chart;
   * the classes are defined in the respective javascript files.
   */
  function init() {

    //load the data
    queue()
      .defer(d3.csv, "data/bachelor contestants for data.world.csv")
      .defer(d3.csv, "data/occupations2.csv")
      .defer(d3.csv, "data/historical_bachelor_contestants.csv")
      .defer(d3.json, "data/updatedcontestantdata.json")
      .defer(d3.json, "data/updatedcontestantdata (1).json")
      .defer(d3.json, "data/geojson1.json")
      .defer(d3.json, "data/geojson2.json")
      .defer(d3.json, "data/geojson3.json")
      .defer(d3.json, "data/geojson4.json")
      .defer(d3.csv, "data/bio.csv")
      .await(createVisualization);
    //function to create the visualization
    function createVisualization(error, source1, source2, source3, source4, source5, source6, source7, source8, source9, source10) {
      //appends missing data
      source4.forEach(function(d, i) {
        source5.forEach(function(d1, i1) {
          if (d1.Name == d.Name && d["Last Name"] == d1["Last Name"] && d.Season == d1.Season) {
            d.LatLng = d1.LatLng;
          }

        });
      });
      //update visualizations on change of dropdown
      d3.select("#ranking-type").on("change", updateVisualization);
      d3.select("#ranking-type-tree").on("change", updateTree);

      //Creating instances for each visualization here
      var occupations = new Occupations(source1, source2);
      var list = new ListOccupations(source1, source2);
      var map = new LocMap(source6, source7, source8, source9);
      var locchart = new LocChart();
      var tree = new SeasonTree(source1);
      var bio = new Bio(source10);

      //calls update on charts here
      occupations.update();
      list.update();
      locchart.update(source1, source3, source4);
      d3.select("#mapthatwontload").on("click", updateVisualization);
      updateVisualization();

      //function to update the tree
      function updateTree() {
        tree.loadData(document.getElementById("ranking-type-tree").value);
        bio.loadData(document.getElementById("ranking-type-tree").value);
      }

      //function to update the map and supporting map vis
      function updateVisualization() {

        //if value in dropdown changes filter each dataset based on that value
        if (d3.select("#ranking-type").property("value") != "all") {
          source1a = source1.filter(function(d, i) {
            if (parseInt(d.Season) == parseInt(d3.select("#ranking-type").property("value"))) {
              return d;
            }
          });
          source2a = source2.filter(function(d, i) {
            if (parseInt(d.Season) == parseInt(d3.select("#ranking-type").property("value"))) {
              return d;
            }
          });

          source3a = source3.filter(function(d, i) {
            if (parseInt(d.Season) == parseInt(d3.select("#ranking-type").property("value"))) {
              return d;
            }
          });

          source4a = source4.filter(function(d, i) {
            if (parseInt(d.Season) == parseInt(d3.select("#ranking-type").property("value"))) {
              return d;
            }
          });

          source5a = source5.filter(function(d, i) {
            if (parseInt(d.Season) == parseInt(d3.select("#ranking-type").property("value"))) {
              return d;
            }
          });
          //then update charts
          map.update(source1a, source3a, source4a);
          locchart.update(source1a, source3a, source4a);
        } else {
          //otherwise use full datasources
          map.update(source1, source3, source4);
          locchart.update(source1, source3, source4);
        }
      }
    }
  }

  /**
   *
   * @constructor
   */
  function Main() {
    if (instance !== null) {
      throw new Error("Cannot instantiate more than one Class");
    }
  }

  /**
   *
   * @returns {Main singleton class |*}
   */
  Main.getInstance = function() {
    var self = this
    if (self.instance == null) {
      self.instance = new Main();

      //called only once when the class is initialized
      init();
    }
    return instance;
  }

  Main.getInstance();
})();


//Tabbed Content tutorial https://codepen.io/cssjockey/pen/jGzuK
$(document).ready(function() {
  //if the tab is clicked add the current class to the new tab and remove the current class from the existing tab 
  $('ul.tabs li').click(function() {
    var tab_id = $(this).attr('data-tab');
    $('ul.tabs li').removeClass('current');
    $('.tab-content').removeClass('current');
    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
  })

})
