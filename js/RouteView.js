/*jslint indent:4*/
/*global window, console, $, HandleBars */

var RouteView = function (routeDetails) {

    this.render = function () {
        $("<h1>").html(RouteView.template(window.localStorage.getItem(routeDetails)));
        return this;
    };

    this.addLocation = function (event) {

    };

    this.removeLocation = function (event) {

    };

    this.initialize = function () {

    };

    this.initialize();
};

RouteView.template = Handlebars.compile($("#route-edit-li-tpl").html());