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
  center;
  image;
  div;
  constructor(map, center, radius, image) {
    super()
    
    this.map = map
    
    this.marker = new google.maps.Marker({
      map,
      title: "Belle",
    })

    this.image = image
    this.setCenter(center)    
    this.setRadius(radius)

    // setInterval(() => this.setRadius(this.radius + 20000), 10)
  }

  setCenter(center) {
    // clamp center to reasonable bounds
    this.center = new google.maps.LatLng(Math.min(70, Math.max(-70, center.lat())), center.lng())

    // update marker position
    this.marker.setPosition(addDistance(this.center, 0, this.radius))
  }

  setRadius(radius) {
    // stupid formula that seems to work
    let max_radius = 5000000 / Math.max(1, (Math.abs(this.center.lat())+30) / 30)
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
  }

  /**
   * onAdd is called when the map's panes are ready and the overlay has been
   * added to the map.
   */
  onAdd() {
    this.div = document.createElement("div");
    this.div.style.borderStyle = "none";
    this.div.style.borderWidth = "0px";
    this.div.style.position = "absolute";

    // Create the img element and attach it to the div.
    const img = document.createElement("img");

    img.src = this.image;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.position = "absolute";
    img.style.borderRadius = '50%'
    img.style.opacity = "0.85";
    img.className = "hover_fade";
    this.div.appendChild(img);

    // Add the element to the "overlayLayer" pane.
    const panes = this.getPanes();

    panes.overlayLayer.appendChild(this.div);
  }

  draw() {
    // Resize the image's div to fit the indicated dimensions.
    if (!this.div)
      return

    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.
    const overlayProjection = this.getProjection();
    
    // Retrieve the south-west and north-east coordinates of this overlay
    // in LatLngs and convert them to pixel coordinates.
    // We'll use these coordinates to resize the div.
    const sw = overlayProjection.fromLatLngToDivPixel(
      this.bounds.getSouthWest()
    );
    const ne = overlayProjection.fromLatLngToDivPixel(
      this.bounds.getNorthEast()
    );

    let width = ne.x - sw.x
    let height =  sw.y - ne.y

    // let min = Math.min(Math.abs(width), Math.abs(height))
    // let avg = Math.abs(width) + Math.abs(height)) / 2

    // console.log(width, height)
    this.div.style.left = (sw.x) + "px";
    this.div.style.top = (ne.y) + "px";
    this.div.style.width = width + "px";
    this.div.style.height = width + "px"; // set height to width to avoid stretching
  }
  /**
   * The onRemove() method will be called automatically from the API if
   * we ever set the overlay's map property to 'null'.
   */
  onRemove() {
    if (this.div) {
      this.div.parentNode.removeChild(this.div);
      delete this.div;
    }
  }
  /**
   *  Set the visibility to 'hidden' or 'visible'.
   */
  // hide() {
  //   if (this.div) {
  //     this.div.style.visibility = "hidden";
  //   }
  // }
  // show() {
  //   if (this.div) {
  //     this.div.style.visibility = "visible";
  //   }
  // }
  // toggle() {
  //   if (this.div) {
  //     if (this.div.style.visibility === "hidden") {
  //       this.show();
  //     } else {
  //       this.hide();
  //     }
  //   }
  // }
  // toggleDOM(map) {
  //   if (this.getMap()) {
  //     this.setMap(null);
  //   } else {
  //     this.setMap(map);
  //   }
  // }
}

