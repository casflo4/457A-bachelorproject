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

    var div = d3.select("#occupations-vis").classed("view", true);

    // self.svgBounds = divyearChart.node().getBoundingClientRect();
    // vis.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;

    vis.svgWidth = 540;
    vis.svgHeight = 520;

    vis.svg = div.append("svg")
        .attr("width",vis.svgWidth)
        .attr("height",vis.svgHeight)

    vis.wrangleData();
};

Occupations.prototype.wrangleData = function(){
    var vis = this;


    vis.categoriesData.forEach(function(d){
        d.Elimination_Week = +d.Elimination_Week;
        // if(!categories.includes(d.Category)){
        //     categories.push(d.Category);
        // }
    });

    var nest = d3.nest()
        .key(function(d){
            return d.Category;
        })
        .key(function(d){
            return d.Occupation;
        })
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

    // console.log(vis.displayData);

}

Occupations.prototype.update = function(){
    var vis = this;

    var abbreviations = {
        "Business Management & Administration": "Business",
        "Finance":"Fin.",
        "Law & Public Safety":"Law",
        "Transportation & Logistics":"Trans.",
        "Health Science":"Health",
        "Education":"Ed.",
        "Human Services":"Hum.",
        "Sports & Training":"Sports",
        "Architecture & Construction":"Arch.",
        "Miscellaneous":"Misc.",
        "Arts & Communications":"Art & Comm.",
        "Hospitality & Tourism":"Hosp.",
        "Sales & Marketing":"Sales & Mkt."
    }

    var colorScale = d3.scaleQuantile()
        // .domain([
        //     d3.min(vis.displayData.descendants().slice(1), function(d){
        //         return d.data.value.avg_elim_week;
        //     }),
        //     d3.max(vis.displayData.descendants().slice(1), function(d){
        //         return d.data.value.avg_elim_week;
        //     })
        // ])
        .domain([2.32,3.97])
        // .range(['#ffd6e1','#fdbbc8','#faa1b0','#f48698','#ee6981','#e5486b','#dc1456']);
        // .range([rgb(255, 214, 225), rgb(249,181,201), rgb(243,149,178), rgb(237,117,155),
        //     rgb(231,84,132), rgb(225,52,109), rgb(220, 20, 86)])
        .range([d3.rgb("#ffd6e1"),d3.rgb('#fdbbc8'),d3.rgb('#faa1b0'),d3.rgb('#f48698'),
        d3.rgb('#ee6981'),d3.rgb('#e5486b'),d3.rgb('#dc1456')]);


    var bubbleChart = d3.pack(vis.categoriesData)
        .size([vis.svgWidth, vis.svgHeight])
        .padding(3)

    var focus;
    var view;

    vis.svg
        .attr("viewBox", " -" + vis.svgWidth/2 + " -" + vis.svgHeight/2 + " "
            + vis.svgWidth + " " + vis.svgHeight + "")
        .on("click", function(){ zoom(root) });

    // var bubble = vis.svg.selectAll(".bubble")
    //     .data(bubbleChart(vis.displayData).descendants().slice(1))
    //     .enter()
    //     .append("g")
    //         .attr("class", "bubble")
    //         .attr("transform", function(d){
    //             return "translate(" + d.x + "," + d.y + ")";
    //         })

    var root = bubbleChart(vis.displayData);

    var avg = {}

    var bubble = vis.svg.append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .enter()
        .append("circle")
        .attr("value", function(d){
            var str = d.data.key;
            str = str.replace(/\s/g, '-');
            return str;
        })
        .attr("class", function(d){
            if(!d.children){ return "job"; }
            else{ return "category"; }
        })
            .style("fill", function(d) {
                if(d.children){
                    var sum = d3.sum(d.data.values, function(i) {
                        return (i.value.avg_elim_week * i.value.count);
                    });
                    var count = d3.sum(d.data.values, function(i) {
                        return i.value.count;
                    });
                    var average = sum / count;
                    avg[d.data.key] = average;
                    return colorScale(average);
                }
                else{
                    var i = d3.interpolate(colorScale(avg[d.parent.data.key]),"white");
                    return i(0.25);
                }
            })
            .on("mouseover", function(d){
                if(d.children){
                    d3.selectAll(".category").attr("stroke", null)
                    d3.select(this).attr("stroke", "#000");
                    updateTooltip(d);
                }
                else{
                    if(focus !== root){
                        var job = d3.select(this).attr("value");
                        d3.selectAll("#"+job).style("fill-opacity", 1);
                    }
                }
            })
            .on("mouseout", function(d){
                if(!d.children){
                    var job = d3.select(this).attr("value");
                    var text = d3.selectAll("#"+job);
                    if(text.node().getComputedTextLength() > d.r*10){
                        text.style("fill-opacity", 0);
                    }
                }
            })

        d3.selectAll(".category")
            .on("click", d => focus !== d && (zoom(d), d3.event.stopPropagation()));
            //^^^^
            /* Zooming functionality (the zoomTo and zoom functions) from Mike Bostock tutorial
            https://observablehq.com/@d3/zoomable-circle-packing */

        d3.selectAll(".job")
            .on("click", d => focus !== d.parent && (zoom(d.parent), d3.event.stopPropagation()));


    var text = vis.svg.append("g")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .enter()
        .append("text")
        .style("text-anchor", "middle")
        .attr("pointer-events", "none")
        .attr("id", function(d){
            var str = d.data.key;
            str = str.replace(/\s/g, '-');
            return str;
        })
        .text(function(d) {
            if(d.children){
                return abbreviations[d.data.key];
            }
            else{
                return d.data.key;
            }
        })
        .style("font-size", function(d){
            if(d.children){
                size = d.r/2;
                if(size > 20){ return 20; }
                else{ return size; }
            }
            else{
                return 12;
            }
        })
        .attr("class", "label")
        .attr("fill", "black")
        .style("display", function(d){
            if(d.parent===root){
                return "inline";
            }
            else{
                return "none";
            }
        });

        zoomTo([root.x, root.y, root.r * 2]);

        function zoomTo(v) {
            const k = vis.svgWidth / v[2];

            view = v;

            text.attr("transform", function(d){
                return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"
            })
            bubble.attr("transform", function(d){
                return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"
            })
            bubble.attr("r", function(d){
                return d.r * k;
            })
        }


        function zoom(d) {
            focus = d;

            const transition = vis.svg.transition()
                .duration(750)
                .tween("zoom", function(){
                  const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                  return t => zoomTo(i(t));
                });

            text
                .filter(function(d) {
                    return d.parent === focus || this.style.display === "inline";
                })
                .style("display", function(d){
                    if(d.parent===focus){
                        return "inline";
                    }
                    else{
                        return "none";
                    }
                })
                .style("fill-opacity", 0)
                .transition(transition)
                    .style("fill-opacity", function(d){
                        if(d.parent===focus && this.getComputedTextLength() < d.r*10){
                            return 1;
                        }
                        else{
                            return 0;
                        }
                    })

        }



        var tooltip = d3.select("#tooltip")
          .append("text")

        function updateTooltip(d){
            tooltip
                .text("Job Category:  " + d.data.key)


        }

}
