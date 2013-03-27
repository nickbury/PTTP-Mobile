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
    };

    this.initialize();
};