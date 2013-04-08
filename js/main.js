/*jslint indent:4 */
/*global window, $, console, MenuView, RouteView, CreateView, DirectionsView*/

var app = {

    route: function () {
        var self = this;

        $("#menu").on("pagebeforeshow", function (event, ui) {
            self.menuPage = new MenuView().render();
        });

        $("#create").on("pagebeforeshow", function (event, ui) {
            self.createPage = new CreateView();
        });

        $("#edit").on("pagebeforeshow", function (event, ui) {
            self.routePage = new RouteView();
        });

        $("#directions").on("pagebeforeshow", function (event, ui) {
            self.directionsPage = new DirectionsView();
        });
    },

    initialize: function () {
        this.route();
    }
};

app.initialize();