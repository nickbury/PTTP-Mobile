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

        return this;
    };

    this.initialize = function () {
        var key;
        for (key in window.localStorage) {
            if (window.localStorage.hasOwnProperty(key)) {
                var check = window.localStorage.getItem(key);
                console.log(check);
                if (check.indexOf("location") !== -1 && check.indexOf("id") !== -1 && check.indexOf("latlng") !== -1) {
                    this.localStorageKeys.push(key);
                }
            }
        }
    };

    this.initialize();

};
