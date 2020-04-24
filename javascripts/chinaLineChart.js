d3.json("../data/chinaLineChartData.json", function (error, data) {
    var dateParse = d3.time.format("%Y-%m-%d");

    data = d3.values(data).reverse();

    var trendData = data.filter(function (d) {
        return d.hasOwnProperty('currentConfirmedCount');
    });
    trendData = [{
        "key": "全国疫情新增趋势",
        "values": trendData.map(function (d) {
            return {
                "x": dateParse.parse(d['updateTime']),
                "y": +d["currentConfirmedCount"]
            }
        })
    }];

    var accumulateData = [{
        "key": "全国疫情累计趋势",
        "values": data.map(function (d) {
            return {
                "x": dateParse.parse(d['updateTime']),
                "y": +d["confirmedCount"]
            };
        })
    }];

    var curedData = [{
        "key": "全国累计治愈病例",
        "color": "green",
        "values": data.map(function (d) {
            return {
                "x": dateParse.parse(d['updateTime']),
                "y": +d["curedCount"]
            };
        })
    },
        {
            "key": "全国累计死亡病例",
            "color": "red",
            "values": data.map(function (d) {
                return {
                    "x": dateParse.parse(d['updateTime']),
                    "y": +d["deadCount"]
                };
            })
        }
    ];

    var deadData = [{
        "key": "治愈率",
        "color": "green",
        "values": data.map(function (d) {
            return {
                "x": dateParse.parse(d['updateTime']),
                "y": +d["curedCount"] / +d["confirmedCount"]
            };
        })
    },
        {
            "key": "死亡率",
            "color": "red",
            "values": data.map(function (d) {
                return {
                    "x": dateParse.parse(d['updateTime']),
                    "y": +d["deadCount"] / +d["confirmedCount"]
                };
            })
        }
    ];

    // console.log(trendData);
    // console.log(accumulateData);
    // console.log(curedData);
    // console.log(deadData);
    drawLineChart(trendData, "china_line_chart");

    const trendLineChart = d3.select('.figure_add_bar')
        .on("click", function () {
            drawLineChart(trendData, "china_line_chart");
            $(".figure_add_bar").attr("class", "figure_add_bar selected_tabBar");
            $(".figure_total_bar").attr("class", "figure_total_bar not_selected_tabBar");
            $(".figure_cure_bar").attr("class", "figure_cure_bar not_selected_tabBar");
            $(".figure_ratio_bar").attr("class", "figure_ratio_bar not_selected_tabBar");
        });

    const accumulateLineChart = d3.select('.figure_total_bar')
        .on("click", function () {
            drawLineChart(accumulateData, "china_line_chart");
            $(".figure_add_bar").attr("class", "figure_add_bar not_selected_tabBar");
            $(".figure_total_bar").attr("class", "figure_total_bar selected_tabBar");
            $(".figure_cure_bar").attr("class", "figure_cure_bar not_selected_tabBar");
            $(".figure_ratio_bar").attr("class", "figure_ratio_bar not_selected_tabBar");
        });

    const curedLineChart = d3.select('.figure_cure_bar')
        .on("click", function () {
            drawLineChart(curedData, "china_line_chart");
            $(".figure_add_bar").attr("class", "figure_add_bar not_selected_tabBar");
            $(".figure_total_bar").attr("class", "figure_total_bar not_selected_tabBar");
            $(".figure_cure_bar").attr("class", "figure_cure_bar selected_tabBar");
            $(".figure_ratio_bar").attr("class", "figure_ratio_bar not_selected_tabBar");
        });

    const deadRateLineChart = d3.select('.figure_ratio_bar')
        .on("click", function () {
            drawLineChart(deadData, "china_line_chart");
            $(".figure_add_bar").attr("class", "figure_add_bar not_selected_tabBar");
            $(".figure_total_bar").attr("class", "figure_total_bar not_selected_tabBar");
            $(".figure_cure_bar").attr("class", "figure_cure_bar not_selected_tabBar");
            $(".figure_ratio_bar").attr("class", "figure_ratio_bar selected_tabBar");
        });

});

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

        chart.update();

        nv.utils.windowResize(chart.update);

        return chart;
    });
}