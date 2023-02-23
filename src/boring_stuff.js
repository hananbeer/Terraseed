
function devAPI() {
    let el = document.querySelector('img[src="https://maps.gstatic.com/mapfiles/api-3/images/google_gray.svg"]')
    if (!el) {
        setTimeout(devAPI, 10)
        console.log('.')
        return
    }
    
    el.parentElement.parentElement.remove()
}

setTimeout(devAPI, 10)