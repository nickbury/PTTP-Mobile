/*jslint indent:4*/
/*global window, console, $, Handlebars, RouteView, alert, confirm */

var MenuView = function () {

    this.localStorageKeys = [];

    this.render = function () {
        var i;

        MenuView.template = Handlebars.compile($("#route-li-tpl").html());
        $(".route-list").html(MenuView.template(this.localStorageKeys)).trigger("create").listview("refresh");

        for (i = 0; i < this.localStorageKeys.length; i++) {
            $(".route-list a:eq(" + i + ")").on("tap", function (e) {
                var curr = $(this).html();
                window.localStorage.setItem("CurrentRoute", curr);
            });
            $(".route-list a:eq(" + i + ")").on("taphold", function (e) {
                var ans = confirm("Do you want to delete this route?");
                if (ans) {
                    var curr = $(this).html();
                    window.localStorage.removeItem(curr);
                    $(this).parent().parent().parent().remove();
                }
            });
        }

        $("#infobtn").bind("tap", function (e) {
            alert("Welcome to the Public Transit Trip Planner!\n\n" +
                   "How does it work?\n" +
                   "Select a pre-existing route or create a new one.\n" +
                   "Set the how long you wish to be at each destination.\n" +
                   "Then just follow the directions using the map as reference.\n\n" +
                   "To delete a route, just press and hold on the route in the menu.\n\n" +
                   "Enjoy!");
        });

        return this;
    };

    this.initialize = function () {
        var key;
        for (key in window.localStorage) {
            if (window.localStorage.hasOwnProperty(key)) {
                var check = window.localStorage.getItem(key);
                if (check.indexOf("location") !== -1 && check.indexOf("id") !== -1 && check.indexOf("latlng") !== -1) {
                    this.localStorageKeys.push(key);
                }
            }
        }
    };

    this.initialize();

};
