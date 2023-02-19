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
    
    let seed = mapsMouseEvent.latLng.lat().toFixed(4) + ',' + mapsMouseEvent.latLng.lng().toFixed(4) + document.getElementById('el_password').value
    let key = ethers.utils.solidityKeccak256(['string'], [seed])
    infoWindow.setContent(
        key
    );
    infoWindow.open(map);
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