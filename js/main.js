import foursquareVenueIds from '../restaurants';
import { FOURSQUARE_CLIENT_ID, FOURSQUARE_SECRET } from '../config';

let map;
let infoWindow;

const Restaurant = function Restaurant(venue) {
  this.visible = ko.observable(true);
  this.name = venue.name;
  this.location = venue.location;

  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(this.location.lat, this.location.lng),
    map,
    title: this.name,
  });

  // Hide and show markers on the map
  this.toggleMarker = ko.computed(() => {
    if (this.visible() === true) {
      this.marker.setMap(map);
    } else {
      this.marker.setMap(null);
    }
  });

  // Click event listener for markers
  this.marker.addListener('click', () => {
    // Close old infoWindow
    if (infoWindow) {
      infoWindow.close();
    }

    // Build a nice content to show in InfoWindow
    let infoWindowContent = `<div><h3>${this.name}</h3></div>`;

    if (Object.prototype.hasOwnProperty.call(this.location, 'address')) {
      infoWindowContent += `<div><b>Address:</b> ${this.location.address}</div>`;
    }
    if (Object.prototype.hasOwnProperty.call(venue, 'rating')) {
      infoWindowContent += `<div><b>Rating:</b> ${venue.rating}/10</div>`;
    }
    if (Object.prototype.hasOwnProperty.call(venue, 'contact')
    && Object.prototype.hasOwnProperty.call(venue.contact, 'formattedPhone')) {
      infoWindowContent += `<div><b>Phone:</b> ${venue.contact.formattedPhone}</div>`;
    }
    if (Object.prototype.hasOwnProperty.call(venue, 'popular')
    && Object.prototype.hasOwnProperty.call(venue.popular, 'status')) {
      infoWindowContent += `<div><b>Status:</b> ${venue.popular.status} </div>`;
    }
    if (Object.prototype.hasOwnProperty.call(venue, 'url')) {
      infoWindowContent +=
        `<div><b>Link:</b> <a target="_blank" href="${venue.url}">${venue.url}</a></div>`;
    }
    infoWindowContent += '<div class="infoWindowBottom"></div>';

    infoWindow = new google.maps.InfoWindow({ content: infoWindowContent });

    infoWindow.open(map, this.marker);

    this.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => {
      this.marker.setAnimation(null);
    }, 1400);
  });

  this.bounce = () => {
    google.maps.event.trigger(this.marker, 'click');
  };
};

const ViewModel = function ViewModel() {
  const restaurantList = ko.observableArray([]);
  this.filter = ko.observable('');

  // Different zoom for mobile and desktop
  const zoom = window.isMobileDevice() ? 14 : 15;

  // Generate a map
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 58.381482, lng: 26.724498 },
    zoom,
    streetViewControl: false,
    mapTypeControl: false,
  });

  // Make Restaurants from Foursquare VENUE_IDs
  foursquareVenueIds.forEach((foursquareVenueId) => {
    const foursquareUrl = `https://api.foursquare.com/v2/venues/${foursquareVenueId}`;
    const params = `?v=20170801&client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_SECRET}`;

    $.ajax({
      url: foursquareUrl + params,
      data: { format: 'json' },
      dataType: 'json',
    }).done((data) => {
      const { venue } = data.response;

      restaurantList.push(new Restaurant(venue));
    }).fail(() => {
      document.getElementsByTagName('body')[0].innerHTML = (
        `<p>
          Sorry, error with Foursquare API occurred.
        </p>`);
    });
  });

  // Filter restaurants by user input
  this.filteredRestaurantList = ko.computed(() => {
    const filterLower = this.filter().toLowerCase();
    let restaurants;

    if (filterLower) {
      restaurants = ko.utils.arrayFilter(restaurantList(), (restaurantItem) => {
        const nameLower = restaurantItem.name.toLowerCase();
        const isMatch = (nameLower.search(filterLower) >= 0);

        restaurantItem.visible(isMatch);
        return isMatch;
      });
    } else {
      restaurantList().forEach((restaurantItem) => {
        restaurantItem.visible(true);
      });
      restaurants = restaurantList();
    }

    return restaurants;
  });

  // Open sidebar
  this.openSidebar = () => {
    document.getElementById('sidebar').style.width = '250px';
  };

  // Close sidebar
  this.closeSidebar = () => {
    document.getElementById('sidebar').style.width = '0';
  };

  // Closes sidebar and removes possible focus from input field
  this.mapClickHandler = () => {
    document.activeElement.blur();
    this.closeSidebar();
  };
};


// Initialize Google Maps
window.initMap = () => {
  ko.applyBindings(new ViewModel());
};

// Google Maps error handler
window.mapsErrorHandler = () => {
  document.getElementsByTagName('body')[0].innerHTML = (
    '<span>Sorry, error with Google Maps API occurred.</span>');
};

window.isMobileDevice = () => {
  const isMobileDevice = (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
  return isMobileDevice;
};
