$(function () {
    var paramsString = decodeURIComponent(window.location.href).substring(window.location.href.indexOf("?") + 1).split("&");
    var params = {};

    var type = "new";
    var number = 0;
    var newData = [];
    var rumorData = [];
    var keys = [];
    var today = new Date();
    var weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    paramsString.forEach(function (e) {
        let i = e.indexOf("=");
        params[e.substring(0, i)] = e.substring(i + 1);
    });

    let keyString = params.key;
    keys = keyString.split(" ");
    for (let i = 0; i < keys.length; i++) {
        if (keys[i].indexOf("#top") != -1) {
            keys[i] = keys[i].substring(0, keys[i].indexOf("#top"));
        }
    }

    let time = today.getFullYear() + "." +
        ((today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : ("0" + (today.getMonth() + 1))) + "." +
        ((today.getDate() + 1) > 9 ? (today.getDate()) : ("0" + (today.getDate()))) + " " + " 星期" +
        weekDays[today.getDay()] + " " +
        ((today.getHours() + 1) > 9 ? (today.getHours()) : ("0" + (today.getHours()))) + ":" +
        ((today.getMinutes() + 1) > 9 ? (today.getMinutes()) : ("0" + (today.getMinutes())));

    $("#today_time").html(time);

    $.getJSON("../data/origin/DXYNews-TimeSeries.json", function (result) {
        $.each(result, function (i, field) {
            keys.forEach(function (value) {
                if (field.title.indexOf(value) !== -1) {
                    newData.push(field);
                }
            })
        });

        if (newData.length !== 0) {
            if (newData.length > 15) {
                $("#show_more").attr("class", "");
            }
            $("#none_tip").attr("class", "tip_hidden");
            number = 15;
            for (let i = 0; i < 15 && i < newData.length; i++) {
                let time = new Date(newData[i].crawlTime);
                let time_str = time.getFullYear() + "-" +
                    ((time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : ("0" + (time.getMonth() + 1))) + "-" +
                    ((time.getDate()) > 9 ? (time.getDate()) : ("0" + (time.getDate())));

                let new_str = "<div class=\"new\">" +
                    "<div class=\"new_icon\">新闻</div>" +
                    "<div class=\"new_time\">" + time_str + "</div>" +
                    "<a class=\"toOrigin\" href=\"" + newData[i].sourceUrl + "\">阅读原文>></a>" +
                    "<div class=\"new_title\">" + newData[i].title + "</div>" +
                    "<div class=\"new_content\">" + newData[i].summary + "</div>" +
                    "<div class=\"new_source\">来源：" + newData[i].infoSource + "</div>" +
                    "</div>";
                $(".new_block").append(new_str);
            }
        }
    })

    $.getJSON("../data/origin/DXYRumors-TimeSeries.json", function (result) {
        $.each(result, function (i, field) {
            keys.forEach(function (value) {
                if (field.title.indexOf(value) !== -1) {
                    rumorData.push(field);
                }
            })
        });
    })

    $(".truth_bar").click(function (e) {
        e.preventDefault();
        console.log(newData);

        type = "new";
        number = 15;

        $(".truth_bar").attr("class", "truth_bar selected_tabBar");
        $(".rumor_bar").attr("class", "rumor_bar not_selected_tabBar");
        $(".new_block").html("");

        if (newData.length === 0) {
            $("#show_more").attr("class", "btn_hidden");
            $("#none_tip").attr("class", "");
        } else {
            $("#none_tip").attr("class", "tip_hidden");
            if (newData.length < 15) {
                $("#show_more").attr("class", "btn_hidden");
            } else {
                $("#show_more").attr("class", "");
            }
            for (let i = 0; i < 15; i++) {
                let time = new Date(newData[i].crawlTime);
                let time_str = time.getFullYear() + "-" +
                    ((time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : ("0" + (time.getMonth() + 1))) + "-" +
                    ((time.getDate()) > 9 ? (time.getDate()) : ("0" + (time.getDate())));

                let new_str = "<div class=\"new\">" +
                    "<div class=\"new_icon\">新闻</div>" +
                    "<div class=\"new_time\">" + time_str + "</div>" +
                    "<a class=\"toOrigin\" href=\"" + newData[i].sourceUrl + "\">阅读原文>></a>" +
                    "<div class=\"new_title\">" + newData[i].title + "</div>" +
                    "<div class=\"new_content\">" + newData[i].summary + "</div>" +
                    "<div class=\"new_source\">来源：" + newData[i].infoSource + "</div>" +
                    "</div>";
                $(".new_block").append(new_str);
            }
        }
    })

    $(".rumor_bar").click(function (e) {
        e.preventDefault();

        type = "rumor";
        number = 15;

        $(".truth_bar").attr("class", "truth_bar not_selected_tabBar");
        $(".rumor_bar").attr("class", "rumor_bar selected_tabBar");
        $(".new_block").html("");

        if (rumorData.length === 0) {
            $("#show_more").attr("class", "btn_hidden");
            $("#none_tip").attr("class", "");
        } else {
            $("#none_tip").attr("class", "tip_hidden");
            if (rumorData.length < 15) {
                $("#show_more").attr("class", "btn_hidden");
            } else {
                $("#show_more").attr("class", "");
            }
            for (let i = 0; i < 15 && i < rumorData.length; i++) {

                let time = new Date(rumorData[i].crawlTime);
                let time_str = time.getFullYear() + "-" +
                    ((time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : ("0" + (time.getMonth() + 1))) + "-" +
                    ((time.getDate() + 1) > 9 ? (time.getDate()) : ("0" + (today.getDate())));

                let new_str = "<div class=\"rumor\">" +
                    "<div class=\"rumor_icon\">谣言</div>" +
                    "<div class=\"rumor_time\">" + time_str + "</div>" +
                    "<div class=\"new_title\">" + rumorData[i].title + "</div>" +
                    "<div class=\"rumor_tip\">辟谣：</div>" +
                    "<div class=\"new_summary\">" + rumorData[i].mainSummary + "</div>" +
                    "<div class=\"new_content\">" + rumorData[i].body + "</div>" +
                    "</div>";

                $(".new_block").append(new_str);
            }

        }
    })

    $("#show_more").click(function (e) {
        e.preventDefault();

        if (type == "new") {
            for (let i = number; i < number + 15 && i < newData.length; i++) {
                let time = new Date(newData[i].crawlTime);
                let time_str = time.getFullYear() + "-" +
                    ((time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : ("0" + (time.getMonth() + 1))) + "-" +
                    ((time.getDate() + 1) > 9 ? (time.getDate()) : ("0" + (today.getDate())));

                let new_str = "<div class=\"new\">" +
                    "<div class=\"new_icon\">新闻</div>" +
                    "<div class=\"new_time\">" + time_str + "</div>" +
                    "<a class=\"toOrigin\" href=\"" + newData[i].sourceUrl + "\">阅读原文>></a>" +
                    "<div class=\"new_title\">" + newData[i].title + "</div>" +
                    "<div class=\"new_content\">" + newData[i].summary + "</div>" +
                    "<div class=\"new_source\">来源：" + newData[i].infoSource + "</div>" +
                    "</div>";
                $(".new_block").append(new_str);
            }
        } else {
            for (let i = number; i < number + 15 && i < rumorData.length; i++) {
                let time = new Date(rumorData[i].crawlTime);
                let time_str = time.getFullYear() + "-" +
                    ((time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : ("0" + (time.getMonth() + 1))) + "-" +
                    ((time.getDate() + 1) > 9 ? (time.getDate()) : ("0" + (today.getDate())));

                let new_str = "<div class=\"rumor\">" +
                    "<div class=\"rumor_icon\">谣言</div>" +
                    "<div class=\"rumor_time\">" + time_str + "</div>" +
                    "<div class=\"new_title\">" + rumorData[i].title + "</div>" +
                    "<div class=\"rumor_tip\">辟谣：</div>" +
                    "<div class=\"new_summary\">" + rumorData[i].mainSummary + "</div>" +
                    "<div class=\"new_content\">" + rumorData[i].body + "</div>" +
                    "</div>";

                $(".new_block").append(new_str);
            }
        }

        number += 15;
    })

    $("#search").click(function (e) {
        e.preventDefault();
        let key = $("#key").val();
        window.open(encodeURI("../pages/new_detail.html?key=" + key));
    })
})