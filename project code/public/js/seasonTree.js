function SeasonTree(_allData) {
    var vis = this;

    this.data = _allData;

    vis.displayData = [];

    vis.init();

    vis.div = d3.select("#tree").append("div").attr("class","tooltip").style("opacity",0);//tooltip
};


SeasonTree.prototype.init = function(){
    var vis = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 20};

    var div = d3.select("#tree").classed("view", true);
    vis.svgWidth =  div.node().getBoundingClientRect().width - self.margin.left - self.margin.right-50;
    vis.svgHeight = 590;
    vis.imgWidth = 195.84;

    vis.svg = div.append("svg")
        .attr("width",vis.svgWidth+50)
        .attr("height",vis.svgHeight);
    var season = document.getElementById('ranking-type-tree').value;
    console.log(season);
        vis.loadData(season);
};

SeasonTree.prototype.loadData = function(season) {
    var vis = this;
    vis.displayData = [];
    var finalWeek = 0;
    vis.displayData[0] = [];
    vis.data.forEach(function(a){
        if (parseInt(a.Season) == season){
            if(a.Outcome == "Winner"){
                vis.displayData[0] = [{first_name:a.Name, elimination_week:a.Elimination_Week, last_name:a['Last Name'], occupation:a.Occupation, age:+a.Age, city:a.City, state:a.State, country:a.Country, place:a.Place}];
            }
            if(a.Elimination_Week>finalWeek){
                finalWeek = a.Elimination_Week;
            }
        }
    });
    for (var i=finalWeek; i>0; --i){
        var row = [];
        vis.data.forEach(function(a){
            if (parseInt(a.Season) == season){
                if(a.Elimination_Week == i && a.Outcome != "Winner"){
                    row.push({first_name:a.Name, elimination_week:a.Elimination_Week, last_name:a['Last Name'], occupation:a.Occupation, age:+a.Age, city:a.City, state:a.State, country:a.Country, place:a.Place});
                }
            }
        });
        if(row.length!=0){
            vis.displayData.push(row);
        }
    }
    console.log(vis.displayData);
    vis.update();

};

SeasonTree.prototype.allMessage = function(){
    console.log("cannot visualize all seasons at once");
};


SeasonTree.prototype.update = function(){
    var vis = this;
    vis.svg.selectAll("image").remove();
    vis.svg.append("image")
    .attr("xlink:href", "public/css/images/rose.png")
    .attr("height", 570)
    .attr("width", 177.48)
    .attr("x", function(){
        return (vis.svgWidth-vis.imgWidth)/2;
    })
    .style("opacity", 0.6);
    vis.svg.selectAll("circle").remove();
    vis.svg.selectAll("text").remove();
    if(vis.displayData[0].length != 0){
        vis.svg.append("circle")
        .attr("r", 35)
        //.attr("stroke", "white")
        .attr("cx", vis.svgWidth/2-20)
        .attr("cy", 85)
        .data(vis.displayData[0])
        .on("mouseover",function(d)
            {
                vis.div.transition().duration(200).style("opacity",.9);
                vis.div.html("<strong>"+d.first_name+" "+d.last_name+"</strong>, "+d.age+"<br><p>"
                    +d.city+", "+d.state+", "+d.country+"<br>"
                    +d.occupation+"</p>")
                .style("left", (d3.event.pageX)-330 + "px")
                .style("top", (d3.event.pageY)-930 + "px")
                .attr("class", "d3-tip");

            })
            .on("mouseout",function(d)
            {
                vis.div.transition().duration(500).style("opacity",0);
            })
            .on("mousemove",function(d){
                vis.div
                .style("left", (d3.event.pageX)-330 + "px")
                .style("top", (d3.event.pageY)-930 + "px");
            });

        vis.svg.append("text")
        .text(vis.displayData[0][0].first_name)
        .attr("x", vis.svgWidth/2-20)
        .attr("y", 85)
        .style("fill", "white")
        .style("text-anchor", "middle")
        .style("font-size", 14)
        .data(vis.displayData[0])
        .on("mouseover",function(d)
            {
                vis.div.transition().duration(200).style("opacity",.9);
                vis.div.html("<strong>"+d.first_name+" "+d.last_name+"</strong>, "+d.age+"<br><p>"
                    +d.city+", "+d.state+", "+d.country+"<br>"
                    +d.occupation+"</p>")
                    .style("left", (d3.event.pageX)-330 + "px")
                    .style("top", (d3.event.pageY)-930 + "px")
                .attr("class", "d3-tip");

            })
            .on("mouseout",function(d)
            {
                vis.div.transition().duration(500).style("opacity",0);
            })
            .on("mousemove",function(d){
                vis.div
                .style("left", (d3.event.pageX)-330 + "px")
                .style("top", (d3.event.pageY)-930 + "px");
            });
        vis.svg.append("text")
        .text("Winner")
        .attr("x", vis.svgWidth/2-20)
        .attr("y", 21)
        .style("fill", "black")
        .style("text-anchor", "middle")
        .style("font-size", 28)
    }
    var row = 0;
    for(var i=1; i<vis.displayData.length; ++i){
        row +=1;
        vis.svg.append("text")
        .text("Eliminated Week " + vis.displayData[i][0].elimination_week)
        .attr("x", function(){
            if (i%2 == 0){
                return vis.svgWidth/2-145;
            }
            else{
                return vis.svgWidth/2+130;
            }
        })
        .attr("y", function(){
                return 78+45*(row);
            })
        .style("fill", "black")
        .style("text-anchor", "middle")
        .style("font-size", 18)
        for(var j=0; j<vis.displayData[i].length; ++j){
            if (j==6 || j==12){
                row +=1;
            }
            vis.svg.append("circle")
            .attr("r", 22)
            //.attr("stroke", "white")
            .attr("cx", function(){
                if (j>11 && i%2 == 0){

                    return vis.svgWidth/2-45-45*(j-12);
                }
                else if (j>11){
                    return vis.svgWidth/2+40+45*(j-12);
                }
                else if (j>5 && i%2 == 0){

                    return vis.svgWidth/2-45-45*(j-6);
                }
                else if (j>5){
                    return vis.svgWidth/2+40+45*(j-6);
                }
                if (i%2==0){
                    return vis.svgWidth/2-45-45*j;
                }
                else{
                    return vis.svgWidth/2+40+45*j;
                }
            })
            .attr("cy", function(){
                return 108+45*(row);
            })
            .datum(vis.displayData[i][j])
            .on("mouseover",function(d)
            {
                vis.div.transition().duration(200).style("opacity",.9);
                vis.div.html("<strong>"+d.first_name+" "+d.last_name+"</strong>, "+d.age+"<br><p>"
                    +d.city+", "+d.state+", "+d.country+"<br>"
                    +d.occupation+"</p>")
                    .style("left", (d3.event.pageX)-330 + "px")
                    .style("top", (d3.event.pageY)-930 + "px")
                .attr("class", "d3-tip");

            })
            .on("mouseout",function(d)
            {
                vis.div.transition().duration(500).style("opacity",0);
            })
            .on("mousemove",function(d){
                vis.div
                .style("left", (d3.event.pageX)-330 + "px")
                .style("top", (d3.event.pageY)-930 + "px");
            });
            vis.svg.append("text")
            .text(vis.displayData[i][j].first_name)
            .attr("x", function(){
                if (j>11 && i%2 == 0){

                    return vis.svgWidth/2-45-45*(j-12);
                }
                else if (j>11){
                    return vis.svgWidth/2+40+45*(j-12);
                }
                else if (j>5 && i%2 == 0){

                    return vis.svgWidth/2-45-45*(j-6);
                }
                else if (j>5){
                    return vis.svgWidth/2+40+45*(j-6);
                }
                if (i%2==0){
                    return vis.svgWidth/2-45-45*j;
                }
                else{
                    return vis.svgWidth/2+40+45*j;
                }
            })
            .attr("y", function(){
                return 108+45*(row);
            })
            .style("fill", "white")
            .style("text-anchor", "middle")
            .style("font-size", 6)
            .datum(vis.displayData[i][j])
            .on("mouseover",function(d)
            {
                vis.div.transition().duration(200).style("opacity",.9);
                vis.div.html("<strong>"+d.first_name+" "+d.last_name+"</strong>, "+d.age+"<br><p>"
                    +d.city+", "+d.state+", "+d.country+"<br>"
                    +d.occupation+"</p>")
                    .style("left", (d3.event.pageX)-330 + "px")
                    .style("top", (d3.event.pageY)-930 + "px")
                .attr("class", "d3-tip");

            })
            .on("mouseout",function(d)
            {
                vis.div.transition().duration(500).style("opacity",0);
            })
            .on("mousemove",function(d){
                vis.div
                .style("left", (d3.event.pageX)-330 + "px")
                .style("top", (d3.event.pageY)-930 + "px");
            });
        }
    }
}
