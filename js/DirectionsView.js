/*jslint indent:4*/
/*global window, console, $, Handlebars, alert, google, document */

var DirectionsView = function () {

    var directions = [], POIArray = [];
    //start and end are POIArray elements
    this.getDirections = function (n, m) {
        var self = this,
            start = POIArray[n],
            end = POIArray[m];
        var directionsService = new google.maps.DirectionsService();
        var point1 = new google.maps.LatLng(start.latlng.jb, start.latlng.kb);
        var point2 = new google.maps.LatLng(end.latlng.jb, end.latlng.kb);
        if (n === 0) {
            var deptTime = Date.now() + start.time * 60000;
        } else {
             var deptTime = new Date(directions[n-1].routes[0].legs[0].arrival_time.value) + start.time * 60000;
        }
        console.log(start.location + " time: " + new Date(deptTime));
        //create request to send to google
        var request = {
            origin: point1,
            destination: point2,
            travelMode: google.maps.TravelMode.TRANSIT,
            transitOptions: {
                departureTime: new Date(deptTime)
            }
        };
        //get directions and push to directions array
        directionsService.route(request, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directions.push(response);
                console.log("directions length: " + directions.length);
                console.log(directions[n]);
                if (m+1 > POIArray.length - 1) {
                    self.render(0);
                } else {
                    self.getDirections(n+1, m+1);

                }
            }
        });
    };

    this.render = function (n) {
        var template = Handlebars.compile($("#directions-li-tpl").html());
        $(".directionsContainer").append(template(n)).trigger("create");

        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setPanel(document.getElementById("directionsPanel-" + n));
        directionsDisplay.setDirections(directions[n]);
        if (n+1 < directions.length) {
            this.render(n+1);
        }
    };

    this.initialize = function () {
        $(".directionsContainer").empty();
        var self = this;
        POIArray = JSON.parse(window.localStorage.getItem(window.localStorage.getItem("CurrentRoute")));

        this.getDirections(0, 1);
    };

    this.initialize();
};