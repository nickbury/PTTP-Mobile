/*jslint indent:4*/
/*global window, console, $, Handlebars, alert, google, document, MapView */

var DirectionsView = function () {

    var directions = [],
        POIArray = [],
        prevDeptTime = 0;
    //start and end are POIArray elements
    this.getDirections = function (n, m) {
        var self = this,
            start = POIArray[n],
            end = POIArray[m];
        var directionsService = new google.maps.DirectionsService();
        var point1 = new google.maps.LatLng(start.latlng.jb, start.latlng.kb);
        var point2 = new google.maps.LatLng(end.latlng.jb, end.latlng.kb);
        //get correct departure time
        if (n === 0) {
            var deptTime = Date.now() + start.time * 60000;
            prevDeptTime = deptTime;
        } else {
            //check to see if the path involves transit
            if (directions[n-1].routes[0].legs[0].arrival_time) {
                var deptTime = new Date(directions[n-1].routes[0].legs[0].arrival_time.value).valueOf() + start.time * 60000;
                prevDeptTime = deptTime;
            } else {
                var deptTime = new Date(prevDeptTime + directions[n-1].routes[0].legs[0].duration.value).valueOf() + start.time * 60000;
                prevDeptTime = deptTime;
            }
        }
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
                if (m+1 > POIArray.length - 1) {
                    self.render(0);
                } else {
                    self.getDirections(n+1, m+1);

                }
            }
        });
    };

    this.render = function (n) {
        //render template
        var template = Handlebars.compile($("#directions-tpl").html());
        $("#directions-tpl-render").html(template({directions: directions})).trigger("create");

        //inject end address
        $("#dir-end-address").html(directions[directions.length - 1].routes[0].legs[0].end_address);
        //display google copyright
        $("#google-copyright-maps").html(directions[0].routes[0].copyrights);
    };

    this.initialize = function () {
        $(".directionsContainer").empty();
        var self = this;
        POIArray = JSON.parse(window.localStorage.getItem(window.localStorage.getItem("CurrentRoute")));

        this.getDirections(0, 1);

        /*$("#dir-get-map").unbind().on("tap", function (e) {
            var mapPage = new MapView().render();
        });*/
    };

    this.initialize();
};