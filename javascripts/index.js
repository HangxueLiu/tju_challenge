$(function () {

    $("#jump_data").click(function (e) {
        e.preventDefault();
        window.location.href = "../pages/data.html";
    });

    $("#jump_flow").click(function (e) {
        e.preventDefault();
        window.location.href = "../pages/chinaflow.html";
    });

    $("#jump_new").click(function (e) {
        e.preventDefault();
        window.location.href = "../pages/new.html";
    })

});