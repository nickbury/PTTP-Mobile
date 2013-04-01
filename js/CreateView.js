/*jslint indent:4*/
/*global window, console, $, Handlebars, alert, google, RouteModel */

var CreateView = function () {
    //formCount is the total number of forms on the page
    //formINC assures all forms are unique
    var formCount = 0, formINC = 0;

    this.render = function () {
        var self = this;
        //render template
        var template = Handlebars.compile($("#create-form-tpl").html());
        $(".create-render").html(template(formINC)).trigger("create");
        //clear routename
        $("#routeName").val("");
        //add handlers
        $("#add-btn-" + formINC).on("tap", function (event) {
            var formID = $(this).attr("id").match(/\d+/);
            formINC++;
            formCount++;
            self.addLocation(formID);
        });
        $("#rem-btn-" + formINC).on("tap", function (event) {
            if (formCount === 0) {
                alert("You need at least one place to go!");
            } else {
                var toBeRemoved = $(this).attr("id").match(/\d+/);
                $("#form-" + toBeRemoved).remove();
                formCount--;
            }
        });
    };

    this.latlngConversion = function (address, callback) {
        console.log(address);
        var latlng, geocoder = new google.maps.Geocoder();
        geocoder.geocode({"address": address}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                console.log("OK");
                latlng.lat = results[0].geometry.location.lat();
                latlng.lng = results[0].geometry.location.lng();
                callback(latlng);
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
                latlng = false;
                callback(latlng);
            }
        });
    };

    this.addLocation = function (formID) {
        var self = this;
        var template = Handlebars.compile($("#create-form-tpl").html());
        $("#form-" + formID).after(template(formINC));
        $("#form-" + formINC).trigger("create");
        $("#add-btn-" + formINC).on("tap", function (event) {
            var formID = $(this).attr("id").match(/\d+/);
            formINC++;
            formCount++;
            self.addLocation(formID);
        });
        $("#rem-btn-" + formINC).on("tap", function (event) {
            if (formCount === 0) {
                alert("You need at least one place to go!");
            } else {
                var toBeRemoved = $(this).attr("id").match(/\d+/);
                $("#form-" + toBeRemoved).remove();
                formCount--;
            }
        });
    };

    this.initialize = function () {
        this.render();
        //on tap, update create new route
        $("#get-directions").on("tap", function (e) {
            var nameID = $("#routeName").val();
            if (nameID === "") {
                e.stopImmediatePropagation();
                e.preventDefault();
                alert("You need a name for your route!");
            } else {
                var POIArray = [], i;
                for (i = 0; i <= formCount; i++) {
                    var location = $(".location:eq(" + i + ")").val();
                    var time = $(".time:eq(" + i + ")").val();
                    var id = i;
                    this.latlngConversion(location, function (latlng) {
                        if (location === "" || time === "") {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            alert("Each point of interest needs a location and a time");
                        } else {
                            if (latlng === false) {
                                e.stopImmediatePropagation();
                                e.preventDefault();
                                alert("Google Maps could not find that address.");
                            } else {
                                POIArray.push({
                                    id: id,
                                    location: location,
                                    latlng: latlng,
                                    time: time
                                });
                                var newRoute = new RouteModel(nameID, POIArray);
                                var isSaved = newRoute.save();
                                if (!isSaved) {
                                    e.stopImmediatePropagation();
                                    e.preventDefault();
                                    alert("An error occurred trying to save the route. Please try again.");
                                } else {
                                    window.localStorage.setItem("CurrentRoute", nameID);
                                }
                            }
                        }
                    });
                }
            }
        });
    };

    this.initialize();
};