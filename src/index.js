import './ethers.min.js'

let hotspots = [
  [41.3029236547479, -81.90172671882485, 18, 180, 'Heart Shaped Pond'],
  [32.149989, -110.835842, 16, 0, 'Airplane Boneyard'],
  [33.74530331426388, -112.63354277069905, 16, 0, 'Illuminati Confirmed'],
  [37.56385880821481, -116.85115487129893, 18, 0, 'The first Target store location'],
  [43.645343801626325, -115.99327152315541, 19, 45, 'At least someone does...'],
  [51.848637, -0.55462, 18, 45, 'Rawrrr'],
  [51.60123998076211, 4.306147257762201, 18, 0, 'Planet with a star'],
  [37.62811748128279, -116.84847238984662, 18, 0, 'Illuminati Confirmed'],
  [-18.52912048729838, -70.24977003674333, 20, 0, 'Stop littering!'],
  [37.401573, -116.867808, 18, 0, 'Sun on Earth'],
  [35.027185, -111.022388, 16, 0, 'Meteor Crater'],
  [44.525049, -110.83819, 19, 0, 'Natural Art'],
  [26.35806896984001, 127.78381878059906, 20, 70, 'Na na na...']
]

function locationKey(lat, lng, decimals=4, password='') {
  let seed = lat.toFixed(decimals) + ',' + lng.toFixed(decimals) + password
  let key = ethers.utils.solidityKeccak256(['string'], [seed])
  return key
}

function generateKeys(lat, lng) {
  let keys = []
  for (let i = 0; i <= 4; i++) {
    keys.push(locationKey(lat, lng, i, document.getElementById('el_password').value))
  }
  return keys
}

function keysToText(keys) {
  return keys.map((key, idx) => `<span style="color: ${key == prevKeys[idx] ? 'gray' : 'green'}">level ${idx}: ${key}</span>`).join('<br />')
}

let prevKeys = []
let map = null
function initMap() {
  let idx = (Math.random() * hotspots.length) | 0
  let [lat, lng, zoom, heading, desc] = hotspots[idx]
  const myLatlng = { lat, lng }
  map = new google.maps.Map(document.getElementById("map"), {
    zoom,
    center: myLatlng,
    heading,
    mapTypeId: 'hybrid'
  })

  prevKeys = generateKeys(lat, lng)
  let infoWindow = new google.maps.InfoWindow({
    content: `<div style="text-align: center"><h3>${desc}</h3>Ethereum key for this location:<br />${locationKey(lat, lng)}<br /><br /><i>Go hide your keys on Earth!</i></div>`,
    position: myLatlng,
  })

  infoWindow.open(map)
  map.addListener("click", (mapsMouseEvent) => {
    infoWindow.close()
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    })

    let _lat = mapsMouseEvent.latLng.lat()
    let _lng = mapsMouseEvent.latLng.lng()
    let keys = generateKeys(_lat, _lng)
    infoWindow.setContent(
      `<p>${_lat}, ${_lng}</p>` + keysToText(keys)
    )
    infoWindow.open(map)

    prevKeys = keys
  })
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


window.initMap = initMap