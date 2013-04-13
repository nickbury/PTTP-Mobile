/*jslint indent:4*/
/*global window, console, $, Handlebars, alert, google, RouteModel, DirectionsView */

var CreateView = function () {
    //formCount is the total number of forms on the page
    //formINC assures all forms are unique
    var formCount = 0,
        formINC = 0,
        addresses = [],
        latlngArray = [];

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
        var self = this;
        this.render();
        //on tap, create new route
        $("#get-directions").on("tap", function (e) {
            var isReady = true;
            var nameID = $("#routeName").val();
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
                var POIArray = [], i;
                for (i = 0; i <= formCount; i++) {
                    var location = $(".location:eq(" + i + ")").val();
                    var time = $(".time:eq(" + i + ")").val();
                    var id = i;
                    if (location === "" || time === "") {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        alert("Each point of interest needs a location and a time");
                        isReady = false;
                        addresses = [];
                    } else if (isNaN(time)) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        alert("Please enter a number for time");
                        isReady = false;
                        addresses = [];
                    } else {
                        addresses.push(location);
                        POIArray.push({
                            id: id,
                            location: location,
                            time: time
                        });
                    }
                }
                if (isReady) {
                    self.latlngConversion(function (results) {
                        results.reverse();
                        var i;
                        for (i = 0; i < results.length; i++) {
                            POIArray[i].latlng = results[i];
                        }
                        var newRoute = new RouteModel(nameID, POIArray);
                        console.log(newRoute);
                        var isSaved = newRoute.save();
                        if (!isSaved) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            alert("An error occurred trying to save the route. Please try again.");
                        } else {
                            window.localStorage.setItem("CurrentRoute", nameID);
                            var dirPage = new DirectionsView();
                        }
                    });
                }
            }
        });
    };

    this.initialize();
};