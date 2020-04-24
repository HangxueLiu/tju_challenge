$(function () {

    var paramsString = decodeURIComponent(window.location.href).substring(window.location.href.indexOf("?") + 1).split("&");
    var params = {};

    var data = {};
    var today = new Date();
    var weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    paramsString.forEach(function (e) {
        let i = e.indexOf("=");
        params[e.substring(0, i)] = e.substring(i + 1);
    });

    let time = today.getFullYear() + "." +
        ((today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : ("0" + (today.getMonth() + 1))) + "." +
        ((today.getDate() + 1) > 9 ? (today.getDate()) : ("0" + (today.getDate()))) + " " + " 星期" +
        weekDays[today.getDay()] + " " +
        ((today.getHours() + 1) > 9 ? (today.getHours()) : ("0" + (today.getHours()))) + ":" +
        ((today.getMinutes() + 1) > 9 ? (today.getMinutes()) : ("0" + (today.getMinutes())));

    $("#today_time").html(time);

    $("#page_name").html(params.name);

    if (params.type === "china") {
        $.getJSON("../data/origin/DXYArea.json", function (result) {
            $.each(result.results, function (i, field) {
                if (field.countryName === "中国" && field.provinceName === params.name) {
                    data = field;
                }
            });
            $("#total_current_confirmed").html(data.currentConfirmedCount);
            $("#total_all_confirmed").html(data.confirmedCount);
            $("#total_all_cured").html(data.curedCount);
            $("#total_all_dead").html(data.deadCount);

            let new_str = "<tr class=\"province_tr\" id=\"td_" + data.provinceName + "\">" +
                "<td class=\"province_name_td\"><span class=\"iconfont province_name close\" id=\"open_" + data.provinceName + "\">&#xe690;&nbsp;" + data.provinceName + "</span></td>" +
                "<td>" + data.currentConfirmedCount + "</td>" +
                "<td>" + data.confirmedCount + "</td>" +
                "<td>" + data.curedCount + "</td>" +
                "<td>" + data.deadCount + "</td>" +
                "</tr>"
            $("#detail_table tbody").append(new_str);

            let cityData = data.cities;

            for (let i = cityData.length - 1; i >= 0; i--) {
                let new_str = "<tr class=\"sub_tr city_" + data.provinceName + "\">" +
                    "<td class=\"city_name_td\">" + cityData[i].cityName + "</td>" +
                    "<td>" + cityData[i].currentConfirmedCount + "</td>" +
                    "<td>" + cityData[i].confirmedCount + "</td>" +
                    "<td>" + cityData[i].curedCount + "</td>" +
                    "<td>" + cityData[i].deadCount + " </td>" +
                    "</tr>";

                $("#td_" + data.provinceName).after(new_str);
            }
        })
    } else {
        $.getJSON("/data/origin/DXYArea.json", function (result) {
            $.each(result.results, function (i, field) {
                if (field.countryEnglishName === params.name) {
                    data = field;
                }
            });
            $("#total_current_confirmed").html(data.currentConfirmedCount);
            $("#total_all_confirmed").html(data.confirmedCount);
            $("#total_all_cured").html(data.curedCount);
            $("#total_all_dead").html(data.deadCount);
            $("#page_name").html(data.countryName);

            let new_str = "<tr class=\"province_tr\" id=\"td_" + data.countryName + "\">" +
                "<td class=\"province_name_td\"><span class=\"iconfont province_name close\" id=\"open_" + data.countryName + "\">&#xe690;&nbsp;" + data.provinceName + "</span></td>" +
                "<td>" + data.currentConfirmedCount + "</td>" +
                "<td>" + data.confirmedCount + "</td>" +
                "<td>" + data.curedCount + "</td>" +
                "<td>" + data.deadCount + "</td>" +
                "</tr>"
            $("#detail_table tbody").append(new_str);
        })
    }
})