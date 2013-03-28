/*jslint indent:4*/
/*global window, console, $, Handlebars, alert */

var CreateView = function () {

    var formCount = 0;

    this.render = function () {
        var self = this;
        var template = Handlebars.compile($("#create-form-tpl").html());
        $(".create-render").html(template(formCount)).trigger("create");
        $("#add-btn-" + formCount).on("tap", function (event) {
            var eventID = formCount;
            formCount++;
            self.addLocation(eventID);
        });
        $("#rem-btn-" + formCount).on("tap", function (event) {
            if (formCount === 0) {
                alert("You need at least one place to go!");
            } else {
                var toBeRemoved = $(this).attr("id").match(/\d/);
                $("#form-" + toBeRemoved).remove();
                formCount--;
            }
        });
    };

    this.addLocation = function (eventID) {
        var self = this;
        var template = Handlebars.compile($("#create-form-tpl").html());
        $(".create-render").append(template(formCount)).trigger("create");
        $("#add-btn-" + formCount).on("tap", function (event) {
            var eventID = formCount;
            formCount++;
            self.addLocation(eventID);
        });
        $("#rem-btn-" + formCount).on("tap", function (event) {
            if (formCount === 0) {
                alert("You need at least one place to go!");
            } else {
                var toBeRemoved = $(this).attr("id").match(/\d/);
                $("#form-" + toBeRemoved).remove();
                formCount--;
            }
        });
    };

    this.initialize = function () {
        this.render();
        $("#get-directions").on("tap", function (e) {
            var nameID = $("#routeName").val();
            if (nameID === "") {
                e.stopImmediatePropagation();
                e.preventDefault();
                alert("You need a name for your route!");
                return;
            }
            var POIArray = [];
            for (var i = 0; i <= formCount; i++) {
                var location = $(".location:eq(" + i + ")").val();
                var time = $(".time:eq(" + i + ")").val();
                if (location === "" || time === "") {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    alert("Each point of interest needs a location and a time");
                    return;
                } else {
                    POIArray.push({
                        location: location,
                        time: time
                    });
                }
            }
            var newRoute = new RouteModel(nameID, POIArray);
            var isSaved = newRoute.save();
            if (!isSaved) {
                e.stopImmediatePropagation()
                e.preventDefault();
                alert("An error occurred trying to save the route. Please try again.");
            } else {
                window.localStorage.setItem("CurrentRoute", nameID);
            }
        });
    };

    this.initialize();
};