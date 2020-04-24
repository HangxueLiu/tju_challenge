var amap = L.tileLayer.chinaProvider("GaoDe.Normal.Map", {
    attribution: 'Map data &copy; <a href="https://www.amap.com/">2019 Amap</a> ' +
        'contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});

var google = L.tileLayer.chinaProvider("Google.Normal.Map", {
    attribution: 'Map data &copy; <a href="https://www.google.com/maps">2019 Google Maps</a> ' +
        'contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});

// var provinces = [
//     '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省',
//     '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省',
//     '四川省', '贵州省', '云南省', '陕西省', '甘肃省',
//     '内蒙古自治区', '广西壮族自治区', '宁夏回族自治区', '新疆维吾尔自治区',
//     '北京市', '天津市', '上海市', '重庆市',
// ];

var chinaMap = L.map("chinaMap", {
    center: [38, 105],
    zoom: 4,
    layers: google,
    fullscreenControl: true
});

L.control.scale().addTo(chinaMap);

const chinaAccPolygonGroup = L.layerGroup();
const chinaCurPolygonGroup = L.layerGroup();


const white = d3.rgb(255, 255, 255);
const red = d3.rgb(255, 21, 34);
const accumulateColor = d3.interpolate(white, red);


const chinaComfirmed = d3.scale.quantize()
    .range(colorbrewer["Reds"][9]);

const chinaCurComfirmed = d3.scale.quantize()
    .range(colorbrewer["Reds"][9]);

var baselayertree = {
    label: "Map provider",
    children: [
        {label: "Google", layer: google},
        {label: "Amap", layer: amap},
    ]
};

var sublayertree = [{
    label: "Map elements",
    children: [
        {label: "累计确诊", layer: chinaAccPolygonGroup},
        {label: "现有确诊", layer: chinaCurPolygonGroup},
    ]
},];

// var provinceFlowsTree = {
//     label: "Provinces Flows",
//     collapsed: true,
//     children: [
//
//     ]
// };

d3.json("../data/chinaMapWithData.json", function (error, data) {
    if (error) throw error;

    // chinaComfirmed.domain(d3.extent(data.features, function(feature) {
    //     return feature['properties']['latestEpidemic']['confirmedCount'];
    // }));
    //
    // chinaCurComfirmed.domain(d3.extent(data.features, function(feature) {
    //     return feature['properties']['latestEpidemic']['confirmedCount'] - feature['properties']['latestEpidemic']['curedCount'];
    // }));

    var chinaAccPolygon = L.geoJSON(data, {
        style: function (feature) {
            return {
                fillColor: feature.properties.confirmedCountScale,
                color: "black",
                opacity: 1,
                weight: 1,
                fillOpacity: 1
            }
        },

        onEachFeature: function (feature, layer) {
            let epidemicData = feature['properties']['latestEpidemic'];
            layer.bindPopup(
                "省份: " + epidemicData['provinceName'] + "<br>" +
                "累计确诊: " + epidemicData['confirmedCount'] + "<br>" +
                "累计疑似: " + epidemicData['suspectedCount'] + "<br>" +
                "累计治愈: " + epidemicData['curedCount'] + "<br>" +
                "累计死亡: " + epidemicData['deadCount'] + "<br>", {closeButton: false, offset: L.point(0, -20)}
            );
            layer.on("mouseover", function () {
                layer.openPopup();
            });
            layer.on("mouseout", function () {
                layer.closePopup();
            });
            layer.on("click", function (e) {
                chinaMap.fitBounds(layer.getBounds());
                setTimeout(function () {
                    window.location.href = "../pages/data_detail.html?type=china&name=" + epidemicData['provinceName'];
                }, 2000);
            })
        }
    }).addTo(chinaAccPolygonGroup);

    var chinaCurPolygon = L.geoJSON(data, {
        style: function (feature) {
            return {
                fillColor: feature.properties.currentConfirmedCountScale,
                color: "black",
                opacity: 1,
                weight: 1,
                fillOpacity: 1
            }
        },
        onEachFeature: function (feature, layer) {
            let epidemicData = feature['properties']['latestEpidemic'];

            layer.bindPopup(
                "省份: " + epidemicData['provinceName'] + "<br>" +
                "现有确诊: " + (epidemicData['confirmedCount'] - epidemicData['curedCount'] - epidemicData['deadCount']) + "<br>" +
                "累计疑似: " + epidemicData['suspectedCount'] + "<br>" +
                "累计治愈: " + epidemicData['curedCount'] + "<br>" +
                "累计死亡: " + epidemicData['deadCount'] + "<br>", {closeButton: false, offset: L.point(0, -20)}
            );
            layer.on("mouseover", function () {
                layer.openPopup();
            });
            layer.on("mouseout", function () {
                layer.closePopup();
            });
            layer.on("click", function (e) {
                chinaMap.fitBounds(layer.getBounds());
                setTimeout(function () {
                    window.location.href = "../pages/data_detail.html?type=china&name=" + epidemicData['provinceName'];
                }, 2000);
            })
        }
    }).addTo(chinaCurPolygonGroup);
});


// allFlowsData = d3.entries(allFlowsData).forEach(function (d) {
//
//     var tmpProvinceTree = {
//         label: d['key'],
//         collapsed: true,
//         children: []
//     };
//
//
//     var tmpFLowData = d3.entries(d['value']).forEach(function (t) {
//         var tmpFlowLayer = L.layerGroup();
//
//         var tmpFlowData = t['value'].map(function (l) {
//             return {
//                 "s": new L.LatLng(+l.slat, +l.slon),
//                 "e": new L.LatLng(+l.elat, +l.elon),
//                 "speed": +l.speed
//             };
//         });
//
//         L.d3SvgOverlay(function (svg, projection) {
//             svg.selectAll("." + d['key'] + "flows")
//                 .data(tmpFlowData).enter()
//                 .append("line")
//                 .attr("x1", (d) => { return projection.latLngToLayerPoint(d.s).x; })
//                 .attr("y1", (d) => { return projection.latLngToLayerPoint(d.s).y; })
//                 .call(lineAnimate);
//
//             function lineAnimate(lines) {
//                 lines
//                     .attr("x2", (d) => { return projection.latLngToLayerPoint(d.s).x; })
//                     .attr("y2", (d) => { return projection.latLngToLayerPoint(d.s).y; })
//                     .style("opacity", 1)
//                     // .style("stroke", (d) => { return rg(speedScale(d.speed)); })
//                     .style("stroke", "black")
//                     .style("stroke-width", 0.2)
//                     .transition()
//                     .ease("linear")
//                     .duration((d) => { return Math.random() * 1000; })
//                     .delay((d, i) => { return Math.random() * 1000; })
//                     .attr("x2", (d) => { return projection.latLngToLayerPoint(d.e).x; })
//                     .attr("y2", (d) => { return projection.latLngToLayerPoint(d.e).y; })
//                     // .transition()
//                     // .duration(1000)
//                     .style("opacity", 0)
//                     // .delay((d, i) => { return i * 10; })
//                     .each("end", function () {
//                         d3.select(this).call(lineAnimate);
//                     });
//             }
//         }).addTo(tmpFlowLayer);
//
//         tmpProvinceTree['children'].push({
//             label: t['key'],
//             layer: tmpFlowLayer,
//             // radioGroup: d['key']
//         });
//     });
//     provinceFlowsTree['children'].push(tmpProvinceTree);
// });
// sublayertree.push(provinceFlowsTree);

var control = L.control.layers.tree(baselayertree, sublayertree, {
    position: "topright",
    collapseAll: "Collapse all",
    expandAll: "Expand all",
}).addTo(chinaMap);

L.easyButton('fa fa-arrows', function (bttn, map) {
    map.setView([38, 105], 4)
}).addTo(chinaMap);