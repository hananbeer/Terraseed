// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">
let map, heatmap, heatmap2;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 37.775, lng: -122.434 },
    mapTypeId: "satellite",
  });
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints().slice(0, 4),
    map: map,
  });
  heatmap2 = new google.maps.visualization.HeatmapLayer({
    data: getPoints().slice(4),
    map: map,
  });

  heatmap.set("opacity", 0.8);
  heatmap2.set("opacity", 0.8);
  heatmap.set("radius", 500);
  heatmap2.set("radius", 500);
  changeGradient()

  document
    .getElementById("toggle-heatmap")
    .addEventListener("click", toggleHeatmap);
  document
    .getElementById("change-gradient")
    .addEventListener("click", changeGradient);
  document
    .getElementById("change-opacity")
    .addEventListener("click", changeOpacity);
  document
    .getElementById("change-radius")
    .addEventListener("click", changeRadius);
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
    heatmap2.setMap(heatmap2.getMap() ? null : map);
}

function changeGradient() {
  const gradient = [
    "rgba(0, 0, 255, 0)",
    // "rgba(0, 0, 255, 0.5)",
    "rgba(0, 0, 255, 1)",
  ];

  heatmap2.set("gradient", heatmap.get("gradient") ? null : gradient);
}

function changeRadius() {
  heatmap2.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity() {
  heatmap2.set("opacity", heatmap.get("opacity") ? null : 0.2);
}

// Heatmap data: 500 Points
function getPoints() {
  return [
    new google.maps.LatLng(38.782551, -122.445368),
    new google.maps.LatLng(39.782551, -122.445368),
    new google.maps.LatLng(37.782551, -121.445368),
    new google.maps.LatLng(37.782551, -120.445368),

    new google.maps.LatLng(37.751266, -122.403355),
  ];
}

window.initMap = initMap;