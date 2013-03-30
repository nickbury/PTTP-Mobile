/*jslint indent:4*/
/*global window, console, $, Handlebars, alert */

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
                var id = i;
                if (location === "" || time === "") {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    alert("Each point of interest needs a location and a time");
                    return;
                } else {
                    POIArray.push({
                        id: id,
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