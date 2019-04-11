function SeasonTree(_allData) {
    var vis = this;

    this.data = _allData;

    vis.displayData;

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
    vis.loadData();

};

SeasonTree.prototype.loadData = function() {
    var vis = this;
    console.log(vis.data);

};


SeasonTree.prototype.update = function(){
    var vis = this;
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
}