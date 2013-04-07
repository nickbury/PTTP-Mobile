/*jslint indent:4*/
/*global window, console, $, Handlebars, alert, google, document */

var DirectionsView = function () {

    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();

    this.getDirections = function (POIArray, callback) {
        directionsDisplay = new google.maps.DirectionsRenderer();
        var point1 = new google.maps.LatLng(POIArray[0].latlng.jb, POIArray[0].latlng.kb);
        var point2 = new google.maps.LatLng(POIArray[1].latlng.jb, POIArray[1].latlng.kb);
        directionsDisplay.setPanel(document.getElementById("directionsPanel"));
        callback([point1, point2]);
    };

    this.render = function (results) {
        var deptTime = Date.now() + results[0].time * 60000;
        var request = {
            origin: results[0],
            destination: results[1],
            travelMode: google.maps.TravelMode.TRANSIT,
            transitOptions: {
                departureTime: new Date(deptTime)
            }
        };
        directionsService.route(request, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    };

    this.initialize = function () {
        var self = this, POIArray = JSON.parse(window.localStorage.getItem(window.localStorage.getItem("CurrentRoute")));
        this.getDirections(POIArray, function (results) {
            self.render(results);
        });
    };

    this.initialize();
};