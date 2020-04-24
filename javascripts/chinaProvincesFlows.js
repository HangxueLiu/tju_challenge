const markerBoxWidth = 5,
    markerBoxHeight = 5,
    refX = 0,
    refY = 0,
    markerWidth = 4,
    markerHeight = 4,
    arrowPoints = [[0, 0], [0, 2.5], [2.5, 2.5]];


// const arrowHead = chinaAccSvg.append("defs")
//     .append("marker")
//     .attr("id", "arrow")
//     .attr("viewBox", [0, -5, 10, 10])
//     .attr("refX", 0)
//     .attr("refY", 0)
//     .attr("markerWidth", 4)
//     .attr("markerHeight", 4)
//     .attr("orient", "auto")
//     .append("path")
//     .attr("d", "M0,-2L4,0L0,2")
//     .attr("stroke", "black")
//     .attr("stroke-width", 1);
//     // .attr("fill", "none");


function flowsAnimation(provinceName) {
    d3.json("../data/quiver/" + provinceName + ".json", function (error, data) {
        if (error) {
            console.error(error);
            alert("数据不存在");
            resetChinaMap();
            return;
        }
        var timeStamps = d3.keys(data[provinceName]);


        var timeFlowsData = d3.values(data[provinceName]).map(function (t) {
            return t.map(function (d) {
                return {
                    "s": [+d.slon, +d.slat],
                    "e": [+d.elon, +d.elat],
                    "speed": +d.speed
                };
            });
        });

        console.log(d3.max(timeFlowsData[0], (d) => {
            return d['speed'];
        }));
        console.log(timeFlowsData);

        var index = 0;
        var id = setInterval(function () {
            L.D3SvgOverlay(function (svg, proj) {
                const arrowHead = svg.append("defs")
                    .append("marker")
                    .attr("id", "arrow")
                    .attr("viewBox", [0, -5, 10, 10])
                    .attr("refX", refX)
                    .attr("refY", refY)
                    .attr("markerWidth", markerWidth)
                    .attr("markerHeight", markerHeight)
                    .attr("orient", "auto")
                    .append("path")
                    .attr("d", "M0,-2L4,0L0,2")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);
                // .attr("fill", "none");

                redrawFlows(svg, timeFlowsData[index++], proj);
            }).addTo(chinaMap);
            if (index >= timeFlowsData.length - 1) {
                console.log("done");
                clearInterval(id);
            }
        }, 1000);

    });
}

function redrawFlows(g, data, projection) {

    g.selectAll('.flows').remove();

    var flows = g.selectAll('.flows')
        .data(data);

    flows.enter()
        .append("line")
        .attr("class", 'flows')
        .style("stroke", "black")
        .style("stroke-width", 0.2)
        .attr("marker-end", "url(#arrow)")
        .attr("x1", (d) => {
            return projection.latLngToLayerPoint(d.s).x;
        })
        .attr("y1", (d) => {
            return projection.latLngToLayerPoint(d.s).y;
        })
        .attr("x2", (d) => {
            return projection.latLngToLayerPoint(d.e).x;
        })
        .attr("y2", (d) => {
            return projection.latLngToLayerPoint(d.e).y;
        });
}

function lineAnimate(lines) {
    lines
        .attr("x2", (d) => {
            return chinaProjection(d.s)[0];
        })
        .attr("y2", (d) => {
            return chinaProjection(d.s)[1];
        })
        .style("opacity", 1)
        // .style("stroke", (d) => { return rg(speedScale(d.speed)); })
        .style("stroke", "black")
        .style("stroke-width", 0.2)
        .transition()
        .ease("linear")
        .duration((d) => {
            return 100 / d.speed;
        })
        .delay((d, i) => {
            return Math.random() * 1000;
        })
        .attr("x2", (d) => {
            return chinaProjection(d.e)[0];
        })
        .attr("y2", (d) => {
            return chinaProjection(d.e)[1];
        })
        .style("opacity", 0)
        .each("end", function () {
            d3.select(this).call(lineAnimate);
        });

}