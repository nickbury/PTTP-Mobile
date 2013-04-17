/*jslint indent:4*/
/*global window, console, $, Handlebars, alert, RouteModel, google, DirectionsView, MapView */

var RouteView = function () {

    var formCount,
        formINC,
        POIArray = [],
        addresses = [],
        latlngArray = [],
        routeName = window.localStorage.getItem("CurrentRoute");

    this.render = function () {
        var self = this, i;

        $("#edit-routeName").val(routeName);
        POIArray = JSON.parse(window.localStorage.getItem(routeName));
        formCount = POIArray.length - 1;
        formINC = formCount;

        var template = Handlebars.compile($("#edit-form-tpl").html());
        $(".edit-render").html(template(POIArray)).trigger("create");

        this.addHandlers();
    };

    this.addHandlers = function () {
        var i, self = this;
        for (i = 0; i <= formCount; i++) {
            var id = POIArray[i].id;
            //set up places auto complete
            var locationID = $("#edit-location-" + id).attr("id");
            self.addPlaceAuto(locationID);
            //add button
            $("#edit-add-btn-" + id).on("tap", function (event) {
                var formID = $(this).attr("id").match(/\d+/);
                formINC++;
                formCount++;
                self.addLocation(formID);
            });
            //remove button
            $("#edit-rem-btn-" + id).on("tap", function (event) {
                if (formCount === 1) {
                    alert("You need at least one place to go!");
                } else {
                    var toBeRemoved = $(this).attr("id").match(/\d+/);
                    $("#edit-form-" + toBeRemoved).remove();
                    formCount--;
                }
            });
        }
    };

    this.addLocation = function (formID) {
        var self = this;
        var template = Handlebars.compile($("#edit-add-form-tpl").html());
        $("#edit-form-" + formID).after(template(formINC));
        $("#edit-form-" + formINC).trigger("create");
        //add places autocomplete
        var locationID = $("#edit-location-" + formINC).attr("id");
        self.addPlaceAuto(locationID);
        //set up button handlers
        $("#edit-add-btn-" + formINC).on("tap", function (event) {
            var formID = $(this).attr("id").match(/\d+/);
            formINC++;
            formCount++;
            self.addLocation(formID);
        });
        $("#edit-rem-btn-" + formINC).on("tap", function (event) {
            if (formCount === 1) {
                alert("You need at least one place to go!");
            } else {
                var toBeRemoved = $(this).attr("id").match(/\d+/);
                $("#edit-form-" + toBeRemoved).remove();
                formCount--;
            }
        });
    };

    this.addPlaceAuto = function (locationID) {
        //add google places autocomplete
        var latlngsw = new google.maps.LatLng(35.5808, -82.6242);
        var latlngne = new google.maps.LatLng(35.4508, -82.6842)
        var defaultBounds = new google.maps.LatLngBounds(latlngne, latlngsw);
        var input = document.getElementById(locationID);
        var searchBox = new google.maps.places.SearchBox(input, {bounds: defaultBounds});
    };

    this.latlngConversion = function (callback) {
        var curr = addresses.pop(), self = this;
        var geocoder = new google.maps.Geocoder();
        if (geocoder) {
            geocoder.geocode({"address": curr}, function x(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    latlngArray.push(results[0].geometry.location);
                    if (addresses.length === 0) {
                        if (typeof callback === 'function') {
                            callback(latlngArray);
                        }
                    } else {
                        curr = addresses.pop();
                        geocoder.geocode({"address": curr}, x);
                    }
                } else {
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
        }
    };

    this.updateRoutes = function (e, callback) {
        var i, isReady = true;
        var nameID = $("#edit-routeName").val();
        if (nameID === "") {
            e.stopImmediatePropagation();
            e.preventDefault();
            alert("You need a name for your route!");
            isReady = false;
        } else if (/^[a-zA-Z0-9- ]*$/.test(nameID) === false) {
            e.stopImmediatePropagation();
            e.preventDefault();
            alert("Your route name has illegal characters in it. Please use only letters, numbers, and spaces.");
            isReady = false;
        } else {
            var newPOIArray = [];
            for (i = 0; i <= formCount; i++) {
                var location = $(".edit-location:eq(" + i + ")").val();
                var time = $(".edit-time:eq(" + i + ")").val();
                var id = i;
                if (location === "" || time === "") {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    alert("Each point of interest needs a location and a time");
                    isReady = false;
                    addresses = [];
                    console.log("bad " + id);
                } else if (isNaN(time)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    alert("Please enter a number for time");
                    isReady = false;
                    addresses = [];
                } else {
                    addresses.push(location);
                    newPOIArray.push({
                        id: id,
                        location: location,
                        time: time
                    });
                }
            }
            if (isReady) {
                this.latlngConversion(function (results) {
                    results.reverse();
                    var i;
                    for (i = 0; i < results.length; i++) {
                        //console.log("newPOIArray[" + i + "]" + newPOIArray[i].location);
                        //console.log("results[" + i + "]" + results[i]);
                        newPOIArray[i].latlng = results[i];
                    }
                    //delete old route
                    window.localStorage.removeItem(routeName);
                    //create new route
                    var newRoute = new RouteModel(nameID, newPOIArray);
                    var isSaved = newRoute.save();
                    if (!isSaved) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        alert("An error occurred trying to save the route. Please try again.");
                    } else {
                        window.localStorage.setItem("CurrentRoute", nameID);
                    }
                });
            }
        }
    };

    this.initialize = function () {
        var self = this;
        this.render();

        $("#edit-get-map").unbind().on("tap", function (e) {
            self.updateRoutes(e);
        });
        $("#edit-get-directions").unbind().on("tap", function (e) {
            self.updateRoutes(e);
        });
        $("#edit-get-menu").unbind().on("tap", function (e) {
            self.updateRoutes(e);
        });
    };

    this.initialize();
};