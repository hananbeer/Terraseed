import './ethers.min.js';

function devAPI() {
    let el = document.querySelector('img[src="https://maps.gstatic.com/mapfiles/api-3/images/google_gray.svg"]')
    if (!el) {
        setTimeout(devAPI, 10)
        console.log('...')
        return
    }
    
    el.parentElement.parentElement.remove()
}

function locationKey(lat, lng, decimals=4, password='') {
  let seed = lat.toFixed(decimals) + ',' + lng.toFixed(decimals) + password
  let key = ethers.utils.solidityKeccak256(['string'], [seed])
  return key
}

let prevKeys = []
let map = null
function initMap() {
  const myLatlng = { lat: 41.3029236547479, lng: -81.90172671882485 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 18,
    center: myLatlng,
    heading: 180,
    mapTypeId: 'hybrid'
  });

  // Create the initial InfoWindow.
  let infoWindow = new google.maps.InfoWindow({
    content: '<div style="text-align: center">Ethereum key for this location:<br />0x493090921ddfa7dbd42497cf19941b968aad2930cce25111921f5777ca2965c7<br /><br />Go hide your keys on Earth!</div>',
    position: myLatlng,
  });

  infoWindow.open(map);
  // Configure the click listener.
  map.addListener("click", (mapsMouseEvent) => {
    // Close the current InfoWindow.
    infoWindow.close();
    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });
    
    let keys = []
    let lat = mapsMouseEvent.latLng.lat()
    let lng = mapsMouseEvent.latLng.lng()
    for (let i = 0; i <= 4; i++) {
      keys.push(locationKey(lat, lng, i, document.getElementById('el_password').value))
    }
    infoWindow.setContent(
        keys.map((key, idx) => `<span style="color: ${key == prevKeys[idx] ? 'gray' : 'green'}">level ${idx}: ${key}</span>`).join('<br />')
    );
    infoWindow.open(map);

    prevKeys = keys
  });

  setTimeout(devAPI, 10)
}

let timer = null
function onPointerEvent(e) {
    clearTimeout(timer)
    map.setMapTypeId('hybrid')
    timer = setTimeout(() => {
        map.setMapTypeId('satellite')
    }, 2000)
}

window.addEventListener('pointerdown', onPointerEvent)
window.addEventListener('wheel', onPointerEvent)


window.initMap = initMap;