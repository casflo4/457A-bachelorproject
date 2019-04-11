function SeasonTree(_allData) {
    var vis = this;

    this.data = _allData;

    vis.displayData = [];

    vis.init();
};


SeasonTree.prototype.init = function(){
    var vis = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};

    var div = d3.select("#tree").classed("view", true);
    vis.svgWidth =  div.node().getBoundingClientRect().width - self.margin.left - self.margin.right;
    vis.svgHeight = 750;
    vis.imgWidth = 229.5;

    vis.svg = div.append("svg")
        .attr("width",vis.svgWidth)
        .attr("height",vis.svgHeight)

};


SeasonTree.prototype.update = function(){
    var vis = this;
    var finalWeek = 0;
    var occupation = 1;
    console.log(Array.from(vis.data));
    vis.data.forEach(function(a){
        if (parseInt(a.Season) == season){
            if(a.Outcome == "Winner"){
                finalWeek = a.Elimination_Week;
                vis.displayData[0] = [{first_name:a.Name, last_name:a['Last Name'], occupation:a.Occupation, age:+a.Age, city:a.City, state:a.State, country:a.Country, place:a.Place}];
            }
        }
    });
    for (var i=finalWeek; i>0; --i){
        var row = [];
        vis.data.forEach(function(a){
            if (parseInt(a.Season) == season){
                if(a.Elimination_Week == i && a.Outcome != "Winner"){
                    row.push({first_name:a.Name, last_name:a['Last Name'], occupation:a.Occupation, age:+a.Age, city:a.City, state:a.State, country:a.Country, place:a.Place});
                }
            }
        });
        vis.displayData.push(row);
    }
    console.log(vis.displayData);
    console.log(vis.displayData[0].first_name);
    vis.svg.append("image")
    .attr("xlink:href", "public/css/images/rose.png")
    .attr("height", 750)
    .attr("width", 229.5)
    .attr("x", function(){
        console.log(vis.svg.node().firstChild);
        return (vis.svgWidth-vis.imgWidth)/2;
    });
    vis.svg.append("circle")
    .attr("r", 45)
    .attr("stroke", "white")
    .attr("cx", vis.svgWidth/2-20)
    .attr("cy", 100);
    vis.svg.append("text")
    .attr("text", vis.displayData[0].first_name)
    .attr("x", vis.svgWidth/2-20)
    .attr("y", 100)
    .style("color", "white");
}