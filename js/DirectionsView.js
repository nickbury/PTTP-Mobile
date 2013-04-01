/*jslint indent:4*/
/*global window, console, $, Handlebars, alert, google */

var DirectionsView = function () {

    this.getDirections = function (POIArray, callback) {

    };

    this.render = function (results) {

    };

    this.initialize = function () {
        var self = this, POIArray = JSON.parse(window.localStorage.getItem(window.localStorage.getItem("CurrentRoute")));
        this.getDirections(POIArray, function (results) {
            self.render(results);
        });
    };

    this.initialize();
};