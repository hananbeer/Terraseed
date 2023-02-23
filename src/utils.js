export const r_earth = 6378000


export function addDistance(latLng, dx, dy) {
  let new_latitude  = latLng.lat()  + (dy / r_earth) * (180 / Math.PI);
  let new_longitude = latLng.lng() + (dx / r_earth) * (180 / Math.PI) / Math.cos(latLng.lat() * Math.PI / 180);

  return new google.maps.LatLng(new_latitude, new_longitude)
}







/**
 * The custom USGSOverlay object contains the USGS image,
 * the bounds of the image, and a reference to the map.
 */
export class PlayerOverlay extends google.maps.OverlayView {
  // js classes are weird
  center;
  image;
  div;
  id;

  constructor(map, center, radius, image, id) {
    super()
  
    this.id = id
    this.map = map
    
    this.marker = new google.maps.Marker({
      map,
      title: image.split('.')[0] + ' ' + id,
      label: image.split('.')[0] + ' ' + id,
    })

    this.image = image
    this.setCenter(center)    
    this.setRadius(radius)
  }

  setCenter(center) {
    // clamp center to reasonable bounds
    this.center = new google.maps.LatLng(Math.min(70, Math.max(-70, center.lat())), center.lng())

    // update marker position
    this.marker.setPosition(addDistance(this.center, 0, this.radius))
  }

  setRadius(radius) {
    // stupid formula that seems to work
    let max_radius = 10000000 / Math.max(1, (Math.abs(this.center.lat())+30) / 30)
    
    // old formula
    //let max_radius = 5000000 / Math.max(1, Math.abs(this.center.lat()) / 25)

    // fixed radius but different visual sizes
    //let max_radius = 2000000

    this.radius = Math.min(radius, max_radius)

    // update marker position
    this.marker.setPosition(addDistance(this.center, 0, this.radius))

    // calculate image bounds; used in draw()
    this.bounds = new google.maps.LatLngBounds(
      addDistance(this.center, -radius, -radius),
      addDistance(this.center, radius, radius)
    )

    // FUCKING JAVASCRIPT THIS WILL RE-RENDER THE CSS ANIMATIONS
    if (this.div) {
        this.div.style.borderColor = 'green'
    }
  }

  /**
   * onAdd is called when the map's panes are ready and the overlay has been
   * added to the map.
   */
  onAdd() {
    this.div = document.createElement("div")
    this.div.style.borderStyle = "none"
    this.div.style.borderWidth = "0px"
    this.div.style.position = "absolute"

    // Create the img element and attach it to the div.
    const img = document.createElement("img")

    img.src = this.image
    img.style.width = "100%"
    img.style.height = "100%"
    img.style.position = "absolute"
    img.style.borderRadius = '50%'
    img.style.opacity = "0.85"
    img.className = "hover_fade"
    this.div.appendChild(img)

    // Add the element to the "overlayLayer" pane.
    const panes = this.getPanes()

    panes.overlayLayer.appendChild(this.div)
  }

  // Resize the image's div to fit the indicated dimensions.
  draw() {
    if (!this.div)
      return

    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.
    const overlayProjection = this.getProjection()
    
    // Retrieve the south-west and north-east coordinates of this overlay
    // in LatLngs and convert them to pixel coordinates.
    // We'll use these coordinates to resize the div.
    const sw = overlayProjection.fromLatLngToDivPixel(
      this.bounds.getSouthWest()
    )
    const ne = overlayProjection.fromLatLngToDivPixel(
      this.bounds.getNorthEast()
    )

    let width = ne.x - sw.x
    let height =  sw.y - ne.y

    // let min = Math.min(Math.abs(width), Math.abs(height))
    // let avg = Math.abs(width) + Math.abs(height)) / 2

    this.div.style.left = sw.x + "px"
    this.div.style.top = ne.y + "px"
    this.div.style.width = width + "px"
    this.div.style.height = width + "px" // set height to width to avoid stretching
  }

  /**
   * The onRemove() method will be called automatically from the API if
   * we ever set the overlay's map property to 'null'.
   */
  onRemove() {
    if (this.div) {
      this.div.parentNode.removeChild(this.div)
      delete this.div
    }

    if (this.marker) {
        this.marker.setMap(null)
        //delete this.marker
    }
  }
}




// 1000 in 10000 chance = 1/10
// this is more convenient way to represent percentages especially for solidity
const DIFFICULTY_NUM = BigInt(1000)
const DIFFICULTY_DEN = BigInt(100000)

// wut
function earthDistance(lat1, lng1, lat2, lng2) {
  const R = r_earth
  const φ1 = lat1 * Math.PI / 180 // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2-lat1) * Math.PI / 180
  const Δλ = (lng2-lng1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const d = R * c // in metres

  return d
}

// no?
function earthDistance_2(lat1, lng1, lat2, lng2) {
  return
    Math.acos(
      Math.sin(lat1) * Math.sin(lat2)
      +
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lon1)
    ) * r_earth
}

function hex64(bi) {
  return '0x' + bi.toString(16).padStart(16, '0')
}

export function keccak256(seed) {
  return ethers.utils.keccak256(hex64(seed))
}

function roll(player_id) {
  let seed = (BigInt((Math.random() * 0x7fffffff) | 0) << BigInt(32)) | BigInt((Math.random() * 0x7fffffff) | 0)
  let hash = keccak256(seed)
  if (BigInt(hash) % ((BigInt(((player_id / 10) | 0) + 1) * DIFFICULTY_DEN)) < DIFFICULTY_NUM) {
    return seed
  }

  return null
}

export function minePlayer(count=10) {
  for (let i = 0; i < count; i++) {
    let seed = roll(i)
    if (seed)
      return seed
  }
}


// larger => shorter distance before larger player devours
const DEVOUR_DIST_MULTIPLIER = 1.5
export function canDevour(eater, players) {
  let eaten = []
  for (let i in players) {
    let player = players[i]
    if (!player)
        continue

    if (eater == player)
      continue
    
    let dist = earthDistance(player.center.lat(), player.center.lng(), eater.center.lat(), eater.center.lng())
    if (eater.radius > player.radius && dist < eater.radius * DEVOUR_DIST_MULTIPLIER) {
    //   console.log(`eater ${eater.id} can devour player ${player.id}`)
      eaten.push(player)
    }
  }

  return eaten
}
