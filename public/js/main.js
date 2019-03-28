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
          //.defer(d3.csv, "any other sources we use")
          .await(createVisualization);

          function createVisualization(error, source1, source2) {
            console.log("gets here");
            //console.log(error);
            console.log(source1);
            //console.log(source2);

            //Creating instances for each visualization here


            //call uptate on charts here

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
