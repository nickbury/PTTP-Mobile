/*jslint indent:4*/
/*global window, console, $, HandleBars */

var MenuView = function () {

    this.localStorageKeys = [];

    this.render = function () {
        $(".route-list").html(MenuView.template(this.localStorageKeys));
        return this;
    };

    this.initialize = function () {

        var key;
        for (key in window.localStorage) {
            if (window.localStorage.hasOwnProperty(key)) {
                this.localStorageKeys.push(key);
                console.log(key);
            }
        }
    };

    this.initialize();

};

MenuView.template = Handlebars.compile($("#route-li-tpl").html());

