import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map', { read: ElementRef }) element: ElementRef;
  @ViewChild('pacinput1', { read: ElementRef }) searchelement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController) {

  }

  ionViewDidEnter() {
    this.loadMap();
  }
  loadMap() {
    var self = this;

    self.map = new google.maps.Map(self.element.nativeElement, {
      zoom: 15,
      center: { lat: 55, lng: 12 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDoubleClickZoom: false,
      disableDefaultUI: false,
      zoomControl: true,
      scaleControl: true,
      mapTypeControl: true,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: true
    });

    console.log("Setting subscriptions");

     self.addSearchBox(self.map);
  }

  disableTap() {
    var container = document.getElementsByClassName('pac-container');
    container[0].setAttribute('data-tap-disabled', 'true');
    container[0].addEventListener('click', (e: any) => {
      console.log("Dropdown clicked");
      document.getElementById('pacinput1').blur();
    });

  };

  test() {
    var container = document.getElementsByClassName('pac-container');
    console.log("Ready3");
    console.log(container);
  }


  addSearchBox(map) {
    // Create the search box and link it to the UI element.
    var self = this;

    if (!self.searchelement.nativeElement) {
      window.setTimeout(function () {
        console.log("Retry Adding Search box");
        self.addSearchBox(map);
      }, 1000);
    }
    else {

      var searchBox = new google.maps.places.SearchBox(self.searchelement.nativeElement);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(self.searchelement.nativeElement);
      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
      });

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          console.log("Places empty");
          return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          });

          markers.push(marker);

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    }
  }
}
