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
    this.visible = ko.observable(true);
}

var ViewModel = function() {
    let self = this;
    this.restaurantList = ko.observableArray([]);
    this.filter = ko.observable("");

    restaurants.forEach(function(restaurantItem) {
        self.restaurantList.push( new Restaurant(restaurantItem) );
    });

    this.filteredRestaurantList = ko.computed( function() {
		var filterLower = self.filter().toLowerCase();
		if (filterLower) {
            return ko.utils.arrayFilter(self.restaurantList(), function(restaurantItem) {
				var nameLower = restaurantItem.name.toLowerCase();
                var isMatch = (nameLower.search(filterLower) >= 0);
                
				restaurantItem.visible(isMatch);
				return isMatch;
			});
		} else {
			self.restaurantList().forEach(function(restaurantItem){
				restaurantItem.visible(true);
			});
			return self.restaurantList();
		}
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