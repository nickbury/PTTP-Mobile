/*jslint indent:4*/
/*global window, console, $, Handlebars, alert, RouteModel, google */

var RouteView = function () {

    var formCount, formINC, POIArray = [], routeName = window.localStorage.getItem("CurrentRoute");

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
            $("#edit-add-btn-" + id).on("tap", function (event) {
                var formID = $(this).attr("id").match(/\d+/);
                formINC++;
                formCount++;
                self.addLocation(formID);
            });
            $("#edit-rem-btn-" + id).on("tap", function (event) {
                if (formCount === 0) {
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
        $("#edit-add-btn-" + formINC).on("tap", function (event) {
            var formID = $(this).attr("id").match(/\d+/);
            formINC++;
            formCount++;
            self.addLocation(formID);
        });
        $("#edit-rem-btn-" + formINC).on("tap", function (event) {
            if (formCount === 0) {
                alert("You need at least one place to go!");
            } else {
                var toBeRemoved = $(this).attr("id").match(/\d+/);
                $("#edit-form-" + toBeRemoved).remove();
                formCount--;
            }
        });
    };

    this.latlngConversion = function (addresses, callback) {
        console.log(addresses);
        var latlngArray = [], i;
        for (i = 0; i < addresses.length; i++) {
            var curr = addresses[i];
            var geocoder = new google.maps.Geocoder();
            if (geocoder) {
                geocoder.geocode({"address": curr}, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        console.log("OK");
                        latlngArray.push(results[0].geometry.location);
                        if (latlngArray.length === addresses.length) {
                            if (typeof callback === 'function') {
                                callback(latlngArray);
                            }
                        }
                    } else {
                        console.log("Geocode was not successful for the following reason: " + status);
                    }
                });
            }
        }
    };

    this.updateRoutes = function (e) {
        var i;
        var nameID = $("#edit-routeName").val();
        if (nameID === "") {
            e.stopImmediatePropagation();
            e.preventDefault();
            alert("You need a name for your route!");
        } else {
            var newPOIArray = [], addresses = [];
            for (i = 0; i <= formCount; i++) {
                var location = $(".edit-location:eq(" + i + ")").val();
                var time = $(".edit-time:eq(" + i + ")").val();
                var id = i;
                if (location === "" || time === "") {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    alert("Each point of interest needs a location and a time");
                } else {
                    console.log("about to push location: " + location);
                    addresses.push(location);
                    newPOIArray.push({
                        id: id,
                        location: location,
                        time: time
                    });
                }
            }
            this.latlngConversion(addresses, function (results) {
                var i;
                for (i = 0; i < results.length; i++) {
                    console.log("newPOIArray[" + i + "]" + newPOIArray[i].location);
                    console.log("results[" + i + "]" + results[i]);
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

    };

    this.initialize = function () {
        var self = this;
        this.render();

        $("#edit-get-map, #edit-get-directions, #edit-get-menu").unbind().on("tap", function (e) {
            self.updateRoutes(e);
        });
    };

    this.initialize();
};