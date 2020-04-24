const Positron = L.tileLayer.provider("CartoDB.Positron");

const worldMap = L.map("worldMap", {
    center: [0, 0],
    zoom: 1,
    layers: Positron,
    fullscreenControl: true
});

L.control.scale().addTo(worldMap);

const worldAccPolygonGroup = L.layerGroup();
const worldCurPolygonGroup = L.layerGroup();

var worldbaselayertree = {
    label: "Map provider",
    children: [
        {label: "CartoDB.Positron", layer: Positron},

    ]
};

var worldsublayertree = [{
    label: "Map elements",
    children: [
        {label: "累计确诊", layer: worldAccPolygonGroup},
        {label: "现有确诊", layer: worldCurPolygonGroup},
    ]
},];

d3.json("../data/worldMapWithData.json", function (error, data) {
    if (error) throw error;

    // const worldComfirmed = d3.scale.quantize()
    //     .domain(d3.extent(data.features, function (d) {
    //         return d3.values(d['properties']['data'])[0] === undefined ? 0 : d3.values(d['properties']['data'])[0]['confirmedCount'];
    //     }))
    //     .range(colorbrewer["Reds"][9]);
    //
    // const worldCurComfirmed = d3.scale.quantize()
    //     .domain(d3.extent(data.features, function (d) {
    //         return d3.values(d['properties']['data'])[0] === undefined ? 0 : d3.values(d['properties']['data'])[0]['confirmedCount'] - d3.values(d['properties']['data'])[0]["curedCount"];
    //     }))
    //     .range(colorbrewer["Reds"][9]);

    var worldAccPolygon = L.geoJSON(data, {
        style: function (feature) {
            // let fillColor = "";
            // if (feature['properties']['data'] === 0) {
            //     fillColor = "black"
            // } else {
            //     // let comfirmed = d3.values(feature['properties']['data'])[0] === undefined ? 0 : d3.values(feature['properties']['data'])[0]['confirmedCount'];
            //     fillColor = feature.properties.confirmedCountScale;
            // }
            return {
                fillColor: feature.properties.confirmedCountScale,
                color: "black",
                opacity: 1,
                weight: 1,
                fillOpacity: 1
            }
        },
        onEachFeature: function (feature, layer) {
            let latestCountry = d3.values(feature['properties']['data'])[0] === undefined ? 0 : d3.values(feature['properties']['data'])[0];
            let message = '';

            if (latestCountry !== 0) {
                message += "国家: " + feature['properties'][
                        ['name']
                        ] + "<br>" +
                    "累计确诊: " + latestCountry['confirmedCount'] + "<br>" +
                    "累计疑似: " + latestCountry["suspectedCount"] + "<br>" +
                    "累计治愈: " + latestCountry["curedCount"] + "<br>" +
                    "累计死亡: " + latestCountry["deadCount"] + "<br>";
            } else {
                message += "国家: " + feature['properties'][
                        ['name']
                        ] + "<br>" +
                    "累计确诊: " + "unknow" + "<br>" +
                    "累计疑似: " + "unknow" + "<br>" +
                    "累计治愈: " + "unknow" + "<br>" +
                    "累计死亡: " + "unknow" + "<br>";
            }
            layer.bindPopup(
                message, {closeButton: false, offset: L.point(0, -20)}
            );
            layer.on("mouseover", function () {
                layer.openPopup();
            });
            layer.on("mouseout", function () {
                layer.closePopup();
            });
            layer.on("click", function (e) {
                worldMap.fitBounds(layer.getBounds());
                setTimeout(function () {
                    window.location.href = "../pages/data_detail.html?type=abroad&name=" + feature['properties'][
                        ['name']
                        ];
                }, 2000);
            })
        }
    }).addTo(worldAccPolygonGroup);

    var worldCurPolygon = L.geoJSON(data, {
        style: function (feature) {
            // let fillColor = "";
            // if (feature['properties']['data'] === 0) {
            //     fillColor = "black"
            // } else {
            //     let comfirmed = d3.values(feature['properties']['data'])[0] === undefined ? 0 : d3.values(feature['properties']['data'])[0]['confirmedCount'] - d3.values(feature['properties']['data'])[0]["curedCount"];
            //     fillColor = feature.properties.currentConfirmedCountScale;
            // }
            return {
                fillColor: feature.properties.currentConfirmedCountScale,
                color: "black",
                opacity: 1,
                weight: 1,
                fillOpacity: 1
            }
        },
        onEachFeature: function (feature, layer) {
            let latestCountry = d3.values(feature['properties']['data'])[0] === undefined ? 0 : d3.values(feature['properties']['data'])[0];
            let message = '';
            let cur = latestCountry['confirmedCount'] - latestCountry["curedCount"] - latestCountry['deadCount'];

            if (latestCountry !== 0) {
                message += "国家: " + feature['properties'][
                        ['name']
                        ] + "<br>" +
                    "现有确诊: " + cur + "<br>" +
                    "累计疑似: " + latestCountry["suspectedCount"] + "<br>" +
                    "累计治愈: " + latestCountry["curedCount"] + "<br>" +
                    "累计死亡: " + latestCountry["deadCount"] + "<br>";
            } else {
                message += "国家: " + feature['properties'][
                        ['name']
                        ] + "<br>" +
                    "现有确诊: " + "unknow" + "<br>" +
                    "累计疑似: " + "unknow" + "<br>" +
                    "累计治愈: " + "unknow" + "<br>" +
                    "累计死亡: " + "unknow" + "<br>";
            }
            layer.bindPopup(
                message, {closeButton: false, offset: L.point(0, -20)}
            );
            layer.on("mouseover", function () {
                layer.openPopup();
            });
            layer.on("mouseout", function () {
                layer.closePopup();
            });
            layer.on("click", function (e) {
                worldMap.fitBounds(layer.getBounds());
                setTimeout(function () {
                    window.location.href = "../pages/data_detail.html?type=abroad&name=" + feature['properties'][
                        ['name']
                        ];
                }, 2000);
            })
        }
    }).addTo(worldCurPolygonGroup);
});

var worldcontrol = L.control.layers.tree(worldbaselayertree, worldsublayertree, {position: "topright"}).addTo(worldMap);

L.easyButton('fa fa-arrows', function (bttn, map) {
    map.setView([0, 0], 1)
}).addTo(worldMap);