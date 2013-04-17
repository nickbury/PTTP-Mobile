/*jslint indent:4*/
/*global window, console, $, Handlebars, alert, RouteModel, google, DirectionsView, document */

var MapView = function () {

    var POIArray = [];

    this.addMarkers = function (map) {
        //temporary method to display all the points of interest
        //TODO: implement custom method that adds useful data to info windows
        var i, waypts = [], request;

        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);

        var start = POIArray[0].location;
        var end = POIArray[POIArray.length - 1].location;

        if (POIArray.length > 2) {
            for (i = 1; i < POIArray.length - 1; i++) {
                waypts.push({
                    location: POIArray[i].location,
                    stopover: true
                });
            }
            request = {
                origin: start,
                destination: end,
                waypoints: waypts,
                travelMode: google.maps.TravelMode.DRIVING
            };
        } else {
            request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            };
        }
        directionsService.route(request, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });

    };

    this.render = function (hasRoute) {

        var mapOptions = {
            center: new google.maps.LatLng(35.6008, -82.5542),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        if (hasRoute) {
            this.addMarkers(map);
        }
    };

    this.initialize = function () {
        var curr = window.localStorage.getItem("CurrentRoute");
        var isAvailable = window.localStorage.getItem(curr);
        if (isAvailable !== null) {
            POIArray = JSON.parse(isAvailable);
            this.render(true);
        } else {
            this.render(false);
        }
    };

    this.initialize();
};