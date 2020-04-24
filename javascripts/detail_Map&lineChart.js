var amap = L.tileLayer.chinaProvider("GaoDe.Normal.Map", {
    attribution: 'Map data &copy; <a href="https://www.amap.com/">2019 Amap</a> ' +
        'contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});

var google = L.tileLayer.chinaProvider("Google.Normal.Map", {
    attribution: 'Map data &copy; <a href="https://www.google.com/maps">2019 Google Maps</a> ' +
        'contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});

var provinces = [
    '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省',
    '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省',
    '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省',
    '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区',
    '北京市', '天津市', '上海市', '重庆市',
    '香港特别行政区', '澳门特别行政区', '台湾省'
];

var spectialProvince = ['香港特别行政区', '澳门特别行政区', '台湾省'];


function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}


window.onload = function () {
    var probinceName = getUrlParameter("name");
    if (provinces.indexOf(probinceName) >= 0) {
        drapProvinceMap(probinceName)
    } else {
        drawCountryMap(probinceName);
    }
};

function drapProvinceMap(provinceName) {
    d3.json("../data/chinaCityWithGeo.json", function (error, data) {
        var dateParse = d3.time.format("%Y-%m-%d");
        var timeserise = d3.values(data[provinceName]["timeseries"]).reverse();
        var lon = data[provinceName]['lon'];
        var lat = data[provinceName]['lat'];
        var lineChartData = [{
            "key": "累计确诊人数",
            "color": "yellow",
            "values": timeserise.map(function (d) {
                return {
                    "x": dateParse.parse(d["updateTime"]),
                    "y": d["confirmedCount"],
                };
            })
        },
            {
                "key": "累计死亡人数",
                "color": "red",
                "values": timeserise.map(function (d) {
                    return {
                        "x": dateParse.parse(d["updateTime"]),
                        "y": d["deadCount"]
                    };
                })
            },
            {
                "key": "累计治愈人数",
                "color": "green",
                "values": timeserise.map(function (d) {
                    return {
                        "x": dateParse.parse(d["updateTime"]),
                        "y": d["curedCount"]
                    };
                })
            }
        ];

        drawLineChart(lineChartData, "province_linechart");

        var provinceMap = L.map("provinceMap", {
            center: [lat, lon],
            zoom: 6,
            layers: google,
            fullscreenControl: true
        });

        L.control.scale().addTo(provinceMap);

        var heatlayer = L.heatLayer([], {
            radius: 35,
            opacity: 0.8,
        }).addTo(provinceMap);

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
                {label: "累计确诊热力图", layer: heatlayer},
            ]
        },];

        var provinceControl = L.control.layers.tree(baselayertree, sublayertree, {
            position: "topright",
            // collapseAll: "Collapse all",
            // expandAll: "Expand all",
        }).addTo(provinceMap);

        if (spectialProvince.indexOf(provinceName) >= 0) {
            setTimeout(function () {
                heatMapAnimation_country(timeserise, heatlayer, 250, lat, lon);
            }, 1500);
        } else {
            setTimeout(function () {
                heatMapAnimation(timeserise, heatlayer, 250);
            }, 1500);
        }

        // L.easyButton('fa fa-arrows', function (bttn, map) {
        //     heatMapAnimation(timeserise, heatlayer, 300);
        // }).addTo(provinceMap);

    });
}

function drawCountryMap(provinceName) {
    d3.json("../data/worldDataWithGeo.json", function (error, data) {
        if (error) throw error;

        var dateParse = d3.time.format("%Y-%m-%d");
        var timeserise = d3.values(data[provinceName]["timeseries"]).reverse();
        var lon = +data[provinceName]['lon'];
        var lat = +data[provinceName]['lat'];
        var lineChartData = [{
            "key": "累计确诊人数",
            "color": "yellow",
            "values": timeserise.map(function (d) {
                return {
                    "x": dateParse.parse(d["updateTime"]),
                    "y": d["confirmedCount"],
                };
            })
        },
            {
                "key": "累计死亡人数",
                "color": "red",
                "values": timeserise.map(function (d) {
                    return {
                        "x": dateParse.parse(d["updateTime"]),
                        "y": d["deadCount"]
                    };
                })
            },
            {
                "key": "累计治愈人数",
                "color": "green",
                "values": timeserise.map(function (d) {
                    return {
                        "x": dateParse.parse(d["updateTime"]),
                        "y": d["curedCount"]
                    };
                })
            }
        ];

        drawLineChart(lineChartData, "province_linechart");

        var provinceMap = L.map("provinceMap", {
            center: [lat, lon],
            zoom: 4,
            layers: google,
            fullscreenControl: true
        });

        L.control.scale().addTo(provinceMap);

        var heatlayer = L.heatLayer([], {
            radius: 35,
            opacity: 0.8,
        }).addTo(provinceMap);

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
                {label: "累计确诊热力图", layer: heatlayer},
            ]
        },];

        var provinceControl = L.control.layers.tree(baselayertree, sublayertree, {
            position: "topright",
            // collapseAll: "Collapse all",
            // expandAll: "Expand all",
        }).addTo(provinceMap);

        setTimeout(function () {
            heatMapAnimation_country(timeserise, heatlayer, 250, lat, lon);
        }, 1500);
    });
}

function heatMapAnimation(data, heatlayer, pfs = 500) {
    var index = 0;
    var id = setInterval(function () {
        drawHeatMap(data[index++]["cities"], heatlayer);
        if (index >= data.length - 1) {
            console.log("done");
            clearInterval(id);
        }
    }, pfs);
}

function heatMapAnimation_country(data, heatlayer, pfs = 500, lat, lon) {
    var index = 0;
    var id = setInterval(function () {
        drawHeatMap_country(data[index++], heatlayer, lat, lon);
        if (index >= data.length - 1) {
            console.log("done");
            clearInterval(id);
        }
    }, pfs);
}

function drawHeatMap(cities, heatlayer) {
    if (cities !== null) {
        cities = unique_property(cities, "cityName");
        var gps = cities.map(function (d) {
            return [+d.lat, +d.lon, +d.confirmedCount];
        });
        heatlayer.setLatLngs(gps);
    }
}

function drawHeatMap_country(country, heatlayer, lat, lon) {
    if (country !== null) {
        heatlayer.setLatLngs([[lat, lon, +country["confirmedCount"]]]);
    }
}

function drawLineChart(data, id) {
    nv.addGraph(function () {
        var chart = nv.models.lineChart();

        chart.xAxis.tickFormat(function (d) {
            return d3.time.format('%x')(new Date(d))
        });
        chart.x2Axis.tickFormat(function (d) {
            return d3.time.format('%x')(new Date(d))
        });

        chart.yAxis.tickFormat(d3.format(",.2f"));
        chart.y2Axis.tickFormat(d3.format(",.2f"));

        d3.select("#" + id + " svg")
            .datum(data)
            .transition().duration(500)
            .call(chart);

        // chart.update();

        nv.utils.windowResize(chart.update);

        return chart;
    });
}