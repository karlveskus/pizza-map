"use strict";
let map;
let activeWindow;

const Restaurant = function(data) {
    const self = this;
    this.name = data.name;
    this.location = data.location;
    this.visible = ko.observable(true);

    this.infoWindow = new google.maps.InfoWindow({content: this.name});    
    
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.location.lat, this.location.lng),
        map: map,
        title: data.name
    });

    // Hide and show markers on the map
    this.showRestaurantMarker = ko.computed(function() {
        if (this.visible() == true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
    }, this);

    // Click event listeners for markers
    this.marker.addListener('click', function() {
        self.infoWindow.setContent(self.name);
        self.infoWindow.open(map, this);
        
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
      	setTimeout(function() {
      		self.marker.setAnimation(null);
     	}, 1400);
    });
    
    this.bounce = function(place) {
		google.maps.event.trigger(self.marker, 'click');
    };
}

const ViewModel = function() {
    const self = this;
    this.restaurantList = ko.observableArray([]);
    this.filter = ko.observable("");

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 58.3776, lng: 26.7290},
        zoom: 14,
        mapTypeControl: false
    });

    restaurants.forEach(function(restaurantItem) {
        self.restaurantList.push( new Restaurant(restaurantItem) );
    });

    // Filter restaurants by filter given by user
    this.filteredRestaurantList = ko.computed(function() {
		let filterLower = self.filter().toLowerCase();
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

    // Open sidebar
    self.openSidebar = function() {
        document.getElementById("sidebar").style.width = "250px";
    }

    // Close sidebar
    self.closeSidebar = function() {
        document.getElementById("sidebar").style.width = "0";
    }
}

function initMap() {
	ko.applyBindings(new ViewModel());
}