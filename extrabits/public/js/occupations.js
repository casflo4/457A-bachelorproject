function Occupations(_allData, _categoriesData) {
    var vis = this;

    vis.data = _allData;

    vis.categoriesData = _categoriesData;

    vis.displayData = {};

    vis.init();
};


Occupations.prototype.init = function(){
    var vis = this;
    vis.margin = {top: 10, right: 20, bottom: 30, left: 50};

    var div = d3.select("#occupations").classed("view", true);

    // self.svgBounds = divyearChart.node().getBoundingClientRect();
    // vis.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;

    vis.svgWidth = 600;
    vis.svgHeight = 600;

    vis.svg = div.append("svg")
        .attr("width",vis.svgWidth)
        .attr("height",vis.svgHeight)

    vis.wrangleData();
};

Occupations.prototype.wrangleData = function(){
    var vis = this;

    var categories = []
    vis.categoriesData.forEach(function(d){
        d.Elimination_Week = +d.Elimination_Week;

        if(!categories.includes(d.Category)){
            categories.push(d.Category);
        }
    });

    var nest = d3.nest()
        .key(function(d){
            return d.Category;
        })
        // .key(function(d){
        //     return d.Occupation;
        // })
        .rollup(function(leaves){
            var sum = d3.sum(leaves, function(d) {
                return (d.Elimination_Week)
            });
            var count = leaves.length;
            var avg_elim_week = sum / count;
            return {"count": count, "avg_elim_week": avg_elim_week};
        })

    vis.displayData = d3.hierarchy({values: nest.entries(vis.categoriesData)}, function(d) { return d.values; })
        .sum(function(d){ 
            if(d.value != null){
                return d.value.count;
            }
        })

}

Occupations.prototype.update = function(){
    var vis = this;

    console.log(vis.displayData)

    var colorScale = d3.scaleQuantile()
        .domain([
            d3.min(vis.displayData.descendants().slice(1), function(d){
                return d.data.value.avg_elim_week;
            }),
            d3.max(vis.displayData.descendants().slice(1), function(d){
                return d.data.value.avg_elim_week;
            })
        ])
        .range(['#fff0f5','#fcdfea','#f8cee0','#f4bdd5','#f0abcb','#eb9bc1','#e689b6','#e077ac','#db64a2','#d55099','#ce398f','#c71585']);

    var bubbleChart = d3.pack(vis.categoriesData)
        .size([vis.svgWidth, vis.svgHeight])
        .padding(1.5)

    var bubble = vis.svg.selectAll(".bubble")
        .data(bubbleChart(vis.displayData).descendants().slice(1))
        .enter()
        .append("g")
            .attr("class", "bubble")
            .attr("transform", function(d){
                return "translate(" + d.x + "," + d.y + ")";
            })
        

    bubble.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d) {
            return colorScale(d.value);
        });

    bubble.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.key + "\n" + d.value;
        })
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("class", "label")
        .attr("fill", "white")
        .attr("width", function(d){
            return d.r;
        });

    vis.svg.selectAll(".label")
        .data(vis.displayData)
        .enter()
        .call(wrap, function(d){
            console.log("here");
            return d.r;
        })
    
}

//Wrap long text labels on x axis:  https://gist.github.com/guypursey/f47d8cd11a8ff24854305505dbbd8c07
function wrap(text, width){
    text.each(function(){
        var text = d3.select(this)
            words = text.text().split(" ").reverse();
            line = [];
            lineNumber = 0;
            lineHeight = 1.1;
            dy = parseFloat(text.attr("dy"));
            text.text(null)
                .append("tspan")
                .attr("x", 0)
                .attr("y", function(){
                    return text.attr("y");
                })
                .attr("dy", function(){
                    return  dy + "em";
                });
        while (word1 = words.pop()) {
            line.push(word1);
            text.text(line.join(" "))
            if (text.node().getComputedTextLength() > width) {
                line.pop();
                text.text(line.join(" "));
                line = [word1];
                text = text.append("tspan")
                    .attr("x", 0)
                    .attr("y", function(){
                        return text.attr("y");
                    })
                    .attr("dy", `${++lineNumber * lineHeight + dy}em`)
                    .text(word1)
            }
        }
    });
}