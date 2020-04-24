function deepCopy(obj) {
    var newObj = obj.constructor === Array ? [] : {};
    newObj.constructor = obj.constructor;
    if (typeof obj !== "object") {
        return;
    } else if (window.JSON) {
        newObj = JSON.parse(JSON.stringify(obj))
    } else {
        for (var prop in obj) {
            if (obj[prop].constructor === RegExp || obj[prop].constructor === Date) {
                newObj[prop] = obj[prop];
            } else if (typeof obj[prop] === 'object') {
                newObj[prop] = deepCopy(obj[prop]);
            } else {
                newObj[prop] = obj[prop];
            }
        }
    }
    return newObj;
}

function str_of_object_toarray(data) {
    data.forEach(function (d) {
        var newjson = d.times.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
        newjson = newjson.replace(/'/g, '"');
        var t = JSON.parse(newjson);
        d.times = t;
        d.times.forEach(function (o) {
            o.date = d3.time.format("%Y-%m-%d").parse(o.date);
        });
    });

    return data
}

function copyArr(arr) {
    let res = [];
    for (var i = 0; i < arr.length; i++) {
        res.push(arr[i]);
    }
    return res;
}

function unique(arr) {
    var r = [];
    for (var i = 0, l = arr.length; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
            if (arr[i] === arr[j]) {
                j = ++i;
            }
        }
        r.push(arr[i]);
    }
    return r;
}

function unique_property(arr, p) {
    var r = [];
    for (var i = 0, l = arr.length; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
            if (arr[i][p] === arr[j][p]) {
                j = ++i;
            }
        }
        r.push(arr[i]);
    }
    return r;
}

function compare(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}

function loctooltip(selectedlist) {
    var users = selectedlist.map(function (u) {
        return {
            no: u.cons_no,
            pap_r: +u.pap_r,
            latlng: L.latLng(+u.lat, +u.lon)
        };
    });

    var m = {};
    users.forEach(function (d) {
        var content = "ID: " + d.no + "<br/>" +
            "Annual electricity consumption peak: " + d.pap_r + "<br/>";

        var options = {
            'maxWidth': "50",
            'className': "custom"
        };

        m = L.marker(d.latlng, {icon: changeicon}).bindPopup(content)
            .addTo(pointsGroup);
    });

    // map.addLayer(pointsGroup);

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// function createPieChartDiv(data) {
//     //Create an svg element
//     var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
//     var width = 50;
//     var height = 50;
//
//     //Create the pie chart
//     var vis = d3.select(svg)
//         .attr('width', width)
//         .attr('height', height);
//
//     var g = vis.append("g")
//         .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");
//
//     var colormap = {
//         "confirmedCount": "yellow",
//         "suspectedCount": "purple",
//         "curedCount": "green",
//         "deadCount": "red",
//     };
//
//     var pie = d3.layout.pie()
//         .value(function(d) { return d.value; });
//
//     data = pie(d3.entries(data));
//
//     g.selectAll(".epidemicRect")
//         .data(data).enter()
//         .append("path")
//         .attr("d", d3.svg.arc()
//             .innerRadius(0)
//             .outerRadius(10))
//         .attr("fill", function(d) { return colormap[d.data.key]})
//         .attr("stroke", "black")
//         .style("stroke-width", "2px")
//         .style("opacity", 0.8);
//
//     return serializeXmlNode(svg);
// }


function serializeXmlNode(xmlNode) {
    if (typeof window.XMLSerializer != "undefined") {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined") {
        return xmlNode.xml;
    }
    return "";
}