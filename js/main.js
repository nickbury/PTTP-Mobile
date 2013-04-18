/*jslint indent:4 */
/*global window, $, console, MenuView, RouteView, CreateView, DirectionsView, MapView*/

var app = {

    route: function () {
        var self = this;

        $("#menu").on("pagebeforeshow", function (event, ui) {
            self.menuPage = new MenuView().render();
        });

        $("#create").on("pagebeforeshow", function (event, ui) {
            window.localStorage.setItem("isDirRefresh", false);
            self.createPage = new CreateView();
        });

        $("#edit").on("pagebeforeshow", function (event, ui) {
            window.localStorage.setItem("isDirRefresh", true);
            self.routePage = new RouteView();
        });

        $("#directions").on("pagebeforeshow", function (e) {
            var isRefresh = window.localStorage.getItem("isDirRefresh");
            if (isRefresh === "true") {
                self.dirPage = new DirectionsView();
            }
        });

        $("#map").bind("pageshow", function (e) {
            self.mapPage = new MapView();
        });

    },

    initialize: function () {
        this.route();
        var isNew = window.localStorage.getItem("isNew");
        if (isNew === null || isNew === undefined) {
            alert("First time here? Check out the info button in the top right hand corner.");
            window.localStorage.setItem("isNew", true);
        }

    }
};

app.initialize();