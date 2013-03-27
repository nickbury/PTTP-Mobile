/*jslint indent:4 */
/*global window, $, console, MenuView, RouteView, CreateView*/

var app = {

    route: function () {
        var self = this;
        if (!window.location.hash) {
            this.menuPage = new MenuView().render();
        }
        $("#create").on("pagebeforeshow", function (event, ui) {
            self.createPage = new CreateView();
        });
    },

    initialize: function () {
        this.route();
    }
};

app.initialize();