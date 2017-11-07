const openSidebar = document.getElementById('openSidebar');
openSidebar.addEventListener('click', function() {
    document.getElementById("sidebar").style.width = "250px";
})

const closeSidebar = document.getElementById('closeSidebar');
closeSidebar.addEventListener('click', function() {
    document.getElementById("sidebar").style.width = "0";
})

var map;

function initMap() {
    // Tartu location
    const tartu = {lat: 58.3776, lng: 26.7290};

    // Constructor creates a new map
    map = new google.maps.Map(document.getElementById('map'), {
        center: tartu,
        zoom: 14,
        mapTypeControl: false
    });
}