import { addDistance, PlayerOverlay } from './src/utils.js'

let images = [
  'beans.jpg',
  'belle.jpg',
  'brock.png',
  'dc.jpg',
  'de.jpg',
  'g.jpg',
  'j.jpg',
  'lib.jpg',
  'mia.jpg',
  'pc.jpg',
  'sasha.webp',
  'tae.png',
  'vec.png'
]

// cannot change name wtf
let map

let is_moon = false

// This example adds hide() and show() methods to a custom overlay's prototype.
// These methods toggle the visibility of the container <div>.
// overlay to or from the map.
function initMap() {
  let lat = 0.0 // -0.281819
  let lng = 0.0 // -520.287132
  let latLng = new google.maps.LatLng(lat, lng)

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: { lat, lng },
    mapTypeId: is_moon ? 'moon' : 'terrain',
  });



  if (is_moon) {
    // Normalizes the coords that tiles repeat across the x axis (horizontally)
    // like the standard Google map tiles.
    function getNormalizedCoord(coord, zoom) {
      const y = coord.y;
      let x = coord.x;
      // tile range in one direction range is dependent on zoom level
      // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
      const tileRange = 1 << zoom;

      // don't repeat across y-axis (vertically)
      if (y < 0 || y >= tileRange) {
        return null;
      }

      // repeat across x-axis
      if (x < 0 || x >= tileRange) {
        x = ((x % tileRange) + tileRange) % tileRange;
      }
      return { x: x, y: y };
    }

        
    const moonMapType = new google.maps.ImageMapType({
      getTileUrl: function (coord, zoom) {
        const normalizedCoord = getNormalizedCoord(coord, zoom);

        if (!normalizedCoord) {
          return "";
        }

        const bound = Math.pow(2, zoom);
        return (
          "https://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw" +
          "/" +
          zoom +
          "/" +
          normalizedCoord.x +
          "/" +
          (bound - normalizedCoord.y - 1) +
          ".jpg"
        );
      },
      tileSize: new google.maps.Size(256, 256),
      maxZoom: 9,
      minZoom: 0,
      // @ts-ignore TODO 'radius' does not exist in type 'ImageMapTypeOptions'
      radius: 1738000,
      name: "Moon",
    });

    map.mapTypes.set("moon", moonMapType);
    map.setMapTypeId("moon");
  }

  let base_radius = 1000000

  // new google.maps.Marker({
  //   position: latLng,
  //   map,
  //   title: "center",
  // });

  // new google.maps.Marker({
  //   position: addDistance(latLng, -radius, radius),
  //   map,
  //   title: "minus",
  // });

  // new google.maps.Marker({
  //   position: addDistance(latLng, radius, -radius),
  //   map,
  //   title: "plus",
  // });

  
  for (let i = 0; i < 50; i++) {
    let image = './pics/' + images[(Math.random() * images.length) | 0]
    const overlay = new PlayerOverlay(map, addDistance(latLng, (Math.random()*2-1) * 50000000, (Math.random()*2-1) * 7000000), base_radius / 4 * (1 + Math.random() * 3), image);
    overlay.setMap(map);
  }

  // const toggleButton = document.createElement("button");
  // toggleButton.textContent = "Toggle";
  // toggleButton.classList.add("custom-map-control-button");

  // const toggleDOMButton = document.createElement("button");

  // toggleDOMButton.textContent = "Toggle DOM Attachment";
  // toggleDOMButton.classList.add("custom-map-control-button");
  // toggleButton.addEventListener("click", () => {
  //   overlay.toggle();
  // });
  // toggleDOMButton.addEventListener("click", () => {
  //   overlay.toggleDOM(map);
  // });
  // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleDOMButton);
  // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleButton);

}

initMap()