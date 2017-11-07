"use strict";
let map;

const Restaurant = function(venue) {
    const self = this;
    this.visible = ko.observable(true);
    this.name = venue.name;
    this.location = venue.location

    // Build a nice content to show in InfoWindow
    let infoWindowContent = '<div><b>' + this.name + '</b></div><hr>';
    if (venue.hasOwnProperty('rating')) {
        infoWindowContent += '<div><b>Rating:</b> ' + venue.rating + '/10</div>';
    }
    if (venue.hasOwnProperty('url')) {
        infoWindowContent += '<div><b>Link:</b> <a target="_blank" href="' + venue.url + '">' + venue.url + '</a></div>';
    }
    if (venue.hasOwnProperty('contact') && venue.contact.hasOwnProperty('formattedPhone')) {
        infoWindowContent += '<div><b>Phone:</b> ' + venue.contact.formattedPhone + '</div>';
    }
    if (venue.hasOwnProperty('popular') && venue.popular.hasOwnProperty('status')) {
        infoWindowContent += '<div><b>Status:</b> ' + venue.popular.status + '</div>';
    }
    
    this.infoWindow = new google.maps.InfoWindow({content: infoWindowContent});
    
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.location.lat, this.location.lng),
        map: map,
        title: this.name
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

    // Generate a map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 58.3776, lng: 26.7290},
        zoom: 14,
        mapTypeControl: false
    });
    
    // Make Restaurants from Foursquare VENUE_IDs
    foursquareVenueIds.forEach(function(foursquareVenueId) {
        let foursquareUrl = 'https://api.foursquare.com/v2/venues/' + foursquareVenueId;
        let params = '?v=20170801&client_id=KQV0J2PIMHI43KIV3D1SR1JHRYV5Q20FBNKAENKYDFU0NYEA&client_secret=JVMTXF0EFNJX0G5TGM3TDAGVXPZQKQ0XKDWID2ECH4G4APE2';

        $.ajax({
            url: foursquareUrl + params,
            data: {format: 'json'},
            dataType: 'json'
        }).done(function(data){
            let venue = data.response.venue;

            self.restaurantList.push( new Restaurant(venue) )

        }).fail(function(){
            console.log( 'Foursquare API request failed!');
        });
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

// Initialize Google Maps
function initMap() {
	ko.applyBindings(new ViewModel());
}

// Google Maps error handler
function mapsErrorHandler() {
    console.log('Google maps API not loaded')
    document.getElementById('map').innerHTML = ('<span>Sorry, error with Google Maps API occurred.</span>');    
}