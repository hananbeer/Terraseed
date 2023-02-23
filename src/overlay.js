import * as utils from './utils.js'

let player_images = [
  // me first :)
  'hb.png',

  // "streamers / influencers"
  // 'belle.jpg',
  // 'mia.jpg',
  // 'sasha.webp',

  // friends
  'beans.jpg',
  'brock.png',
  'dc.jpg',
  'de.jpg',
  'g.jpg',
  'j.jpg',
  'lib.jpg',
  'pc.jpg',
  'tae.png',
  'vec.png',
  'pepe.webp',
  'obama.jpg',
  'leo.png',
  'trumpepe.png',
  'smol.jpg',
  'kethic.jpg',
  'cypher.png',
  'boy.jpg',
  'hacker.jpg',
  'phil.png',
  'paladin.jpg',
  'vex.png',
  '59.jpg',
  '13.jpg',
  'dump.jpg',
  'riley.jpg',
  'gm.jpg'
]

// cannot change name wtf
let map

let is_moon = false
let players = []
let grow_interval

function initMap() {
  let lat = 0.0
  let lng = 0.0
  let latLng = new google.maps.LatLng(lat, lng)

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2.5,
    minZoom: 2.5,
    center: { lat, lng },
    mapTypeId: is_moon ? 'moon' : 'satellite',
  })

  if (is_moon) {
    // Normalizes the coords that tiles repeat across the x axis (horizontally)
    // like the standard Google map tiles.
    function getNormalizedCoord(coord, zoom) {
      const y = coord.y
      let x = coord.x
      // tile range in one direction range is dependent on zoom level
      // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
      const tileRange = 1 << zoom

      // don't repeat across y-axis (vertically)
      if (y < 0 || y >= tileRange) {
        return null
      }

      // repeat across x-axis
      if (x < 0 || x >= tileRange) {
        x = ((x % tileRange) + tileRange) % tileRange
      }
      return { x, y }
    }
        
    const moonMapType = new google.maps.ImageMapType({
      getTileUrl: function (coord, zoom) {
        const normalizedCoord = getNormalizedCoord(coord, zoom)

        if (!normalizedCoord) {
          return ""
        }

        const bound = Math.pow(2, zoom)
        return (
          "https://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw" +
          "/" +
          zoom +
          "/" +
          normalizedCoord.x +
          "/" +
          (bound - normalizedCoord.y - 1) +
          ".jpg"
        )
      },
      tileSize: new google.maps.Size(256, 256),
      maxZoom: 9,
      minZoom: 1,
      radius: 1738000,
      name: "Moon",
    })

    map.mapTypes.set("moon", moonMapType)
    map.setMapTypeId("moon")
  }

  // new google.maps.Marker({
  //   position: latLng,
  //   map,
  //   title: "center",
  // })

  // new google.maps.Marker({
  //   position: utils.addDistance(latLng, -radius, radius),
  //   map,
  //   title: "minus",
  // })

  // new google.maps.Marker({
  //   position: utils.addDistance(latLng, radius, -radius),
  //   map,
  //   title: "plus",
  // })

  const base_radius = 1000000

  // for (let i = 0; i < 50; i++) {
    // const image = './pics/' + images[(Math.random() * images.length) | 0]
  // instantiate 3 of each player
  for (let i = 0; i < player_images.length * 3; i++) {
    const image = './pics/' + player_images[(i / 3) | 0]
    const dx = (Math.random()*2-1) * 50000000
    const dy = (Math.random()*2-1) * 7000000
    const pos = utils.addDistance(latLng, dx, dy)
    const radius = base_radius / 4 * (1 + Math.random() * 3)
    const overlay = new utils.PlayerOverlay(map, pos, radius, image, i)
    overlay.setMap(map)
    players.push(overlay)
  }
  
  // keep for reference
  // const toggleButton = document.createElement("button")
  // toggleButton.textContent = "Toggle"
  // toggleButton.classList.add("custom-map-control-button")

  // const toggleDOMButton = document.createElement("button")

  // toggleDOMButton.textContent = "Toggle DOM Attachment"
  // toggleDOMButton.classList.add("custom-map-control-button")
  // toggleButton.addEventListener("click", () => {
  //   overlay.toggle()
  // })
  // toggleDOMButton.addEventListener("click", () => {
  //   overlay.toggleDOM(map)
  // })
  // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleDOMButton)
  // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleButton)

  grow_interval = setInterval(minePlayers, 50)
}

const MINING_RADIUS_MULTIPLIER = 1.15
function minePlayers() {
  for (let i = 0; i < players.length; i++) {
    let player = players[i]
    if (!player)
      continue

    let seed = utils.minePlayer(10)
    if (seed) {
      //console.log(seed, utils.keccak256(seed))
      let new_radius = (player.radius * MINING_RADIUS_MULTIPLIER)
      player.setRadius(new_radius) // | 0)

      if (new_radius >= utils.MAX_RADIUS) {
        // debugger
        // win
        clearInterval(grow_interval)
        player.div.children[0].style['border'] = '2px solid gold'

        let old_players = players
        players = [player]
        for (let j = 0; j < old_players.length; j++) {
          if (player == old_players[j])
            continue

          let loser = old_players[j]
          // remove
          if (loser)
            loser.remove()
        }
        // return
      }


      let eaten_players = utils.canDevour(player, players)
      if (eaten_players) {
        for (let eaten of eaten_players) {
          // remove
          players[eaten.id].remove()
          players[eaten.id] = null

        }
      }
    }
  }
}



initMap()