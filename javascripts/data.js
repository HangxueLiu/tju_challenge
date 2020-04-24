$(function () {

    var overallData = {};
    var chinaData = [];
    var worldData = {
        AsiaData: [],
        EuropeData: [],
        AfricaData: [],
        OceaniaData: [],
        North_AmericaData: [],
        South_AmericaData: []
    };

    var continentName = ['Europe', 'North_America', 'Asia', 'South_America', 'Africa', 'Oceania'];
    var continentChineseName = ['欧洲', '北美洲', '亚洲', '南美洲', '非洲', '大洋洲'];

    var today = new Date();
    var yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    var todayString = today.getFullYear() + "-" + ((today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : ("0" + (today.getMonth() + 1))) + "-" +
        ((today.getDate() + 1) > 9 ? (today.getDate()) : ("0" + (today.getDate())));
    var yesterdayString = yesterday.getFullYear() + "-" + ((yesterday.getMonth() + 1) > 9 ? (yesterday.getMonth() + 1) : ("0" + (yesterday.getMonth() + 1))) + "-" +
        ((yesterday.getDate() + 1) > 9 ? (yesterday.getDate()) : ("0" + (yesterday.getDate())));
    var weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    //填充时间
    let time = today.getFullYear() + "." +
        ((today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : ("0" + (today.getMonth() + 1))) + "." +
        ((today.getDate() + 1) > 9 ? (today.getDate()) : ("0" + (today.getDate()))) + " " + " 星期" +
        weekDays[today.getDay()] + " " +
        ((today.getHours() + 1) > 9 ? (today.getHours()) : ("0" + (today.getHours()))) + ":" +
        ((today.getMinutes() + 1) > 9 ? (today.getMinutes()) : ("0" + (today.getMinutes())));

    $("#today_time").html(time);

    //拉取国内总览数据
    $.getJSON("/data/chinaOverall.json", function (result) {
        overallData = result[todayString];
        $("#total_current_confirmed").html(overallData.currentConfirmedCount);
        $("#total_current_confirmed_inc").html(overallData.currentConfirmedIncr > 0 ? "+" + overallData.currentConfirmedIncr : overallData.currentConfirmedIncr);
        $("#total_current_suspected").html(overallData.suspectedCount);
        $("#total_current_suspected_inc").html(overallData.suspectedIncr > 0 ? "+" + overallData.suspectedIncr : overallData.suspectedIncr);
        $("#total_current_serious").html(overallData.seriousCount);
        $("#total_current_serious_inc").html(overallData.seriousIncr > 0 ? "+" + overallData.seriousIncr : overallData.seriousIncr);
        $("#total_all_confirmed").html(overallData.confirmedCount);
        $("#total_all_confirmed_inc").html(overallData.confirmedIncr > 0 ? "+" + overallData.confirmedIncr : overallData.confirmedIncr);
        $("#total_all_cured").html(overallData.curedCount);
        $("#total_all_cured_inc").html(overallData.curedIncr > 0 ? "+" + overallData.curedIncr : overallData.curedIncr);
        $("#total_all_dead").html(overallData.deadCount);
        $("#total_all_dead_inc").html(overallData.deadIncr > 0 ? "+" + overallData.deadIncr : overallData.deadIncr);
    })

    //打开国内总览、区域数据文件
    $.getJSON("../data/origin/DXYArea.json", function (result) {
        $.each(result.results, function (i, field) {
            if (field.countryName === "中国") {
                if (field.provinceName !== "中国") {
                    chinaData.push(field);
                }
            } else {
                switch (field.continentName) {
                    case "亚洲":
                        worldData.AsiaData.push(field);
                        break;
                    case "欧洲":
                        worldData.EuropeData.push(field);
                        break;
                    case "非洲":
                        worldData.AfricaData.push(field);
                        break;
                    case "北美洲":
                        worldData.North_AmericaData.push(field);
                        break;
                    case "南美洲":
                        worldData.South_AmericaData.push(field);
                        break;
                    case "大洋洲":
                        worldData.OceaniaData.push(field);
                        break;
                }
            }
        });

        //按当前确诊排序
        chinaData.sort(compare);
        worldData.AsiaData.sort(compare);
        worldData.EuropeData.sort(compare);
        worldData.AfricaData.sort(compare);
        worldData.OceaniaData.sort(compare);
        worldData.North_AmericaData.sort(compare);
        worldData.South_AmericaData.sort(compare);

        //渲染中国表格
        for (let i = 0; i < chinaData.length; i++) {
            let new_str = "<tr class=\"province_tr\" id=\"td_" + chinaData[i].provinceName + "\">" +
                "<td class=\"province_name_td\"><span class=\"iconfont province_name close\" id=\"open_" + chinaData[i].provinceName + "\">&#xe690;&nbsp;" + chinaData[i].provinceName + "</span><span class=\"province_toDetail\" id=\"detail_" + chinaData[i].provinceName + "\">>></span></td>" +
                "<td>" + chinaData[i].currentConfirmedCount + "</td>" +
                "<td>" + chinaData[i].confirmedCount + "</td>" +
                "<td>" + chinaData[i].curedCount + "</td>" +
                "<td>" + chinaData[i].deadCount + "</td>" +
                "</tr>"
            $("#detail_table tbody").append(new_str);
        }

        function compare(c1, c2) {
            return c2.currentConfirmedCount - c1.currentConfirmedCount;
        }

        function compareReverse(c1, c2) {
            return c1.currentConfirmedCount - c2.currentConfirmedCount;
        }
    });

    //打开国外总览数据文件
    $.getJSON("../data/" + todayString + "worldOver.json", function (result) {
        let todayData = result;

        $("#abroad_total_current_confirmed").html(todayData.worldSumCurrent);
        $("#abroad_total_current_confirmed_inc").html(todayData.worldSumCurrentAdd > 0 ? "+" + todayData.worldSumCurrentAdd : todayData.worldSumCurrentAdd);
        $("#abroad_total_all_confirmed").html(todayData.worldSum);
        $("#abroad_total_all_confirmed_inc").html(todayData.worldSumAdd > 0 ? "+" + todayData.worldSumAdd : todayData.worldSumAdd);
        $("#abroad_total_all_cured").html(todayData.worldSumCured);
        $("#abroad_total_all_cured_inc").html(todayData.worldSumCuredAdd > 0 ? "+" + todayData.worldSumCuredAdd : todayData.worldSumCuredAdd);
        $("#abroad_total_all_dead").html(todayData.worldSumDead);
        $("#abroad_total_all_dead_inc").html(todayData.worldSumDeadAdd > 0 ? "+" + todayData.worldSumDeadAdd : todayData.worldSumDeadAdd);

        for (let i = 0; i < continentName.length; i++) {
            let new_str = "<tr class=\"province_tr\" id=\"td_" + continentName[i] + "\">" +
                "<td class=\"province_name_td\"><span class=\"iconfont province_name close\" id=\"open_" + continentName[i] + "\">&#xe690;&nbsp;" + continentChineseName[i] + "</span></td>" +
                "<td>" + todayData[continentName[i] + "Current"] + "</td>" +
                "<td>" + todayData[continentName[i]] + "</td>" +
                "<td>" + todayData[continentName[i] + "Cured"] + "</td>" +
                "<td>" + todayData[continentName[i] + "Dead"] + "</td>" +
                "</tr>"
            $("#abroad_detail_table tbody").append(new_str);
        }
    })

    //展开/关闭国内疫情菜单
    $("#detail_table tbody").on("click", ".province_name", function (e) {
        let province_name = e.currentTarget.id.substring(5);

        if (e.currentTarget.className.indexOf("close") !== -1) { //展开菜单  
            let cityData = chinaData.find(function (e) {
                return e.provinceName == province_name;
            }).cities;

            for (let i = cityData.length - 1; i >= 0; i--) {
                let new_str = "<tr class=\"sub_tr city_" + province_name + "\">" +
                    "<td class=\"city_name_td\">" + cityData[i].cityName + "</td>" +
                    "<td>" + cityData[i].currentConfirmedCount + "</td>" +
                    "<td>" + cityData[i].confirmedCount + "</td>" +
                    "<td>" + cityData[i].curedCount + "</td>" +
                    "<td>" + cityData[i].deadCount + " </td>" +
                    "</tr>";

                $("#td_" + province_name).after(new_str);
            }

            //状态变为展开
            $("#open_" + province_name).attr("class", "iconfont province_name open");
            //下箭头变为上箭头
            $("#open_" + province_name).html("&#xe67a;&nbsp;" + province_name);
        } else { //闭合菜单
            //删除表格
            $(".sub_tr.city_" + province_name).remove();
            //状态变为闭合
            $("#open_" + province_name).attr("class", "iconfont province_name close");
            //上箭头变为下箭头
            $("#open_" + province_name).html("&#xe690;&nbsp;" + province_name);
        }
    });

    //展开/关闭国外疫情菜单
    $("#abroad_detail_table tbody").on("click", ".province_name", function (e) {
        let province_name = e.currentTarget.id.substring(5);

        if (e.currentTarget.className.indexOf("close") !== -1) { //展开菜单
            let cityData = worldData[province_name + "Data"];

            for (let i = cityData.length - 1; i >= 0; i--) {
                let new_str = "<tr class=\"sub_tr city_" + province_name + "\">" +
                    "<td class=\"city_name_td\">" + cityData[i].countryName + "<span class=\"abroad_detail\" id=\"detail_" + cityData[i].countryEnglishName + "\">&nbsp;>></span></td>" +
                    "<td>" + cityData[i].currentConfirmedCount + "</td>" +
                    "<td>" + cityData[i].confirmedCount + "</td>" +
                    "<td>" + cityData[i].curedCount + "</td>" +
                    "<td>" + cityData[i].deadCount + " </td>" +
                    "</tr>";

                $("#td_" + province_name).after(new_str);
            }

            //状态变为展开
            $("#open_" + province_name).attr("class", "iconfont province_name open");
            //下箭头变为上箭头
            $("#open_" + province_name).html("&#xe67a;&nbsp;" + continentChineseName[continentName.indexOf(province_name)]);
        } else { //闭合菜单
            //删除表格
            $(".sub_tr.city_" + province_name).remove();
            //状态变为闭合
            $("#open_" + province_name).attr("class", "iconfont province_name close");
            //上箭头变为下箭头
            $("#open_" + province_name).html("&#xe690;&nbsp;" + continentChineseName[continentName.indexOf(province_name)]);
        }
    });

    //转到详情页
    $("#detail_table tbody").on("click", ".province_toDetail", function (e) {
        let province_name = e.currentTarget.id.substring(7);
        location.href = encodeURI("/pages/data_detail.html?type=china&name=" + province_name);
    });

    $("#abroad_detail_table tbody").on("click", ".abroad_detail", function (e) {
        let province_name = e.currentTarget.id.substring(7);
        location.href = encodeURI("/pages/data_detail.html?type=abroad&name=" + province_name);
    })
});