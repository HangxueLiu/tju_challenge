// const accumulateMap = d3.select('.map_all_bar')
//     .on("click", function() {
//         d3.select(".map_block").selectAll('.map')
//             .style("display", "none");
//         d3.select(".map_block").select("#chinaAccumulate")
//             .style("display", "block");
//         accMap.setView(L.latLng(38, 105), 4);
//         $(".map_all_bar").attr("class", "map_all_bar selected_tabBar");
//         $(".map_current_bar").attr("class", "map_current_bar not_selected_tabBar ")
//     });
//
// const currentMap = d3.select('.map_current_bar')
//     .on("click", function() {
//         d3.select(".map_block").selectAll('.map')
//             .style("display", "none");
//         d3.select(".map_block").select("#chinaCurrent")
//             .style("display", "block");
//         curMap.setView(L.latLng(38, 105), 4);
//         $(".map_all_bar").attr("class", "map_all_bar not_selected_tabBar");
//         $(".map_current_bar").attr("class", "map_current_bar selected_tabBar ")
//     });
//
//
// const worldCurrentMap = d3.select(".abroad_map_current_bar")
//     .on("click", function() {
//         d3.select(".abroad_map_block").selectAll('.abroad_map')
//             .style("display", "none");
//         d3.select(".abroad_map_block").select("#worldCurrent")
//             .style("display", "block");
//         $(".abroad_map_all_bar").attr("class", "abroad_map_all_bar not_selected_tabBar");
//         $(".abroad_map_current_bar").attr("class", "abroad_map_current_bar selected_tabBar");
//     });
//
// const worldAccumulateMap = d3.select(".abroad_map_all_bar")
//     .on("click", function() {
//         d3.select(".abroad_map_block").selectAll('.abroad_map')
//             .style("display", "none");
//         d3.select(".abroad_map_block").select("#worldAccumulate")
//             .style("display", "block");
//         $(".abroad_map_all_bar").attr("class", "abroad_map_all_bar selected_tabBar");
//         $(".abroad_map_current_bar").attr("class", "abroad_map_current_bar not_selected_tabBar");
//     });
//
// // const resetChinaMapBttn = d3.select(".map_block").select(".map_reset_bar")
// //     .on("click", resetChinaMap);
// //
// // const resetWorldMapBttn = d3.select('.abroad_map_block').select(".map_reset_bar")
// //     .on("click", resetWorldMap);