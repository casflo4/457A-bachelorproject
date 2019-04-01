/*
 * Root file that handles instances of all the charts and loads the visualization
 */
(function(){
    var instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart;
     * the classes are defined in the respective javascript files.
     */
    function init() {

        //load the data
        queue()
          .defer(d3.csv, "data/bachelor contestants for data.world.csv")
          .defer(d3.csv, "data/historical_bachelor_contestants.csv")
          .defer(d3.json, "data/updatedcontestantdata.json")
          .defer(d3.json, "data/updatedcontestantdata (1).json")
          .await(createVisualization);

          function createVisualization(error, source1, source2, source3, source4) {
            console.log("gets here");
            console.log(error);
            console.log(source1);
            console.log(source2);
            source3.forEach(function(d,i){
              source4.forEach(function(d1,i1){
                if (d1.Name == d.Name && d["Last Name"] == d1["Last Name"] && d.Season == d1.Season){
                  d.LatLng = d1.LatLng;
                }

              });
            });
            console.log(source3);

            //Creating instances for each visualization here
            var map = new LocMap();


            //call uptate on charts here
            map.update(source1,source2,source3);
          }
    }

    /**
     *
     * @constructor
     */
    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    /**
     *
     * @returns {Main singleton class |*}
     */
    Main.getInstance = function(){
        var self = this
        if(self.instance == null){
            self.instance = new Main();

            //called only once when the class is initialized
            init();
        }
        return instance;
    }

    Main.getInstance();
})();
