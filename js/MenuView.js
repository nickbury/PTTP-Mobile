/*jslint indent:4*/
/*global window, console, $, Handlebars, RouteView, alert */

var MenuView = function () {

    this.localStorageKeys = [];

    this.render = function () {
        var i;

        MenuView.template = Handlebars.compile($("#route-li-tpl").html());
        $(".route-list").html(MenuView.template(this.localStorageKeys));

        for (i = 0; i < this.localStorageKeys.length; i++) {
            $(".route-list a:eq(" + i + ")").on("tap", function (e) {
                var curr = $(this).html();
                window.localStorage.setItem("CurrentRoute", curr);
            });
        }

        return this;
    };

    this.initialize = function () {
        var key;
        for (key in window.localStorage) {
            if (window.localStorage.hasOwnProperty(key)) {
                if (key !== "CurrentRoute") {
                    this.localStorageKeys.push(key);
                }
            }
        }
    };

    this.initialize();

};
