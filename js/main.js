/*jslint indent:4 */
/*global window, $, console, MenuView, RouteView*/

var app = {

    route: function () {
        var self = this;
        var hash = window.location.hash;
        if (!hash) {
            if (this.menuPage) {
                console.log("menuPage already exists");
            } else {
                this.menuPage = new MenuView().render();
            }
            return;
        }
    },

    initialize: function () {
        this.route();
    }
};

app.initialize();