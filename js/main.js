let map;

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

var Restaurant = function(data) {
    this.name = data.name;
    this.location = data.location;
}

var ViewModel = function() {
    let self = this;
    this.restaurantList = ko.observableArray([]);

    restaurants.forEach(function(restaurantItem) {
        console.log(restaurantItem)
        self.restaurantList.push( new Restaurant(restaurantItem) );
    });

    self.openSidebar = function() {
        document.getElementById("sidebar").style.width = "250px";
    }

    self.closeSidebar = function() {
        document.getElementById("sidebar").style.width = "0";
    }
}


var viewModel = new ViewModel()
ko.applyBindings(viewModel);