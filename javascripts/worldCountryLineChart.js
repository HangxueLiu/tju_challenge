d3.json("../data/worldLineChartData.json", function (error, data) {
    var dateParse = d3.time.format("%Y-%m-%d");

    data = d3.values(data);

    var worldTrendData = [{
        "key": "世界疫情新增趋势",
        "values": data.map(function (d) {
            return {
                "x": dateParse.parse(d['date']),
                "y": +d["currentConfirmedCount"]
            };
        })
    }];

    var worldAccumulateData = [{
        "key": "世界疫情累计趋势",
        "values": data.map(function (d) {
            return {
                "x": dateParse.parse(d['date']),
                "y": +d["confirmedCount"]
            };
        })
    }];

    var worldCuredData = [{
        "key": "世界累计治愈病例",
        "color": "green",
        "values": data.map(function (d) {
            return {
                "x": dateParse.parse(d['date']),
                "y": +d["curedCount"]
            };
        })
    },
        {
            "key": "世界累计死亡病例",
            "color": 'red',
            "values": data.map(function (d) {
                return {
                    "x": dateParse.parse(d['date']),
                    "y": +d["deadCount"]
                };
            })
        }
    ];

    var worldDeadData = [{
        "key": "世界治愈率",
        "color": "green",
        "values": data.map(function (d) {
            return {
                "x": dateParse.parse(d['date']),
                "y": +d["curedCount"] / +d["confirmedCount"]
            };
        })
    },
        {
            "key": "世界死亡率",
            "color": "red",
            "values": data.map(function (d) {
                return {
                    "x": dateParse.parse(d['date']),
                    "y": +d["deadCount"] / +d["confirmedCount"]
                };
            })
        }
    ];

    drawLineChart(worldTrendData, "world_line_chart");

    const worldTrendLineChart = d3.select('.abroad_figure_add_bar')
        .on("click", function () {
            drawLineChart(worldTrendData, "world_line_chart");
            $(".abroad_figure_add_bar").attr("class", "abroad_figure_add_bar selected_tabBar");
            $(".abroad_figure_total_bar").attr("class", "abroad_figure_total_bar not_selected_tabBar");
            $(".abroad_figure_cure_bar").attr("class", "abroad_figure_cure_bar not_selected_tabBar");
            $(".abroad_figure_ratio_bar").attr("class", "abroad_figure_ratio_bar not_selected_tabBar");
        });

    const worldAccumulateLineChart = d3.select('.abroad_figure_total_bar')
        .on("click", function () {
            drawLineChart(worldAccumulateData, "world_line_chart");
            $(".abroad_figure_add_bar").attr("class", "abroad_figure_add_bar not_selected_tabBar");
            $(".abroad_figure_total_bar").attr("class", "abroad_figure_total_bar selected_tabBar");
            $(".abroad_figure_cure_bar").attr("class", "abroad_figure_cure_bar not_selected_tabBar");
            $(".abroad_figure_ratio_bar").attr("class", "abroad_figure_ratio_bar not_selected_tabBar");
        });

    const worldCuredLineChart = d3.select('.abroad_figure_cure_bar')
        .on("click", function () {
            drawLineChart(worldCuredData, "world_line_chart");
            $(".abroad_figure_add_bar").attr("class", "abroad_figure_add_bar not_selected_tabBar");
            $(".abroad_figure_total_bar").attr("class", "abroad_figure_total_bar not_selected_tabBar");
            $(".abroad_figure_cure_bar").attr("class", "abroad_figure_cure_bar selected_tabBar");
            $(".abroad_figure_ratio_bar").attr("class", "abroad_figure_ratio_bar not_selected_tabBar");
        });

    const worldDeadRateLineChart = d3.select('.abroad_figure_ratio_bar')
        .on("click", function () {
            drawLineChart(worldDeadData, "world_line_chart");
            $(".abroad_figure_add_bar").attr("class", "abroad_figure_add_bar not_selected_tabBar");
            $(".abroad_figure_total_bar").attr("class", "abroad_figure_total_bar not_selected_tabBar");
            $(".abroad_figure_cure_bar").attr("class", "abroad_figure_cure_bar not_selected_tabBar");
            $(".abroad_figure_ratio_bar").attr("class", "abroad_figure_ratio_bar selected_tabBar");
        });
});