/*jslint indent:4*/
/*global window, console */

var RouteModel = function (nameID, POIArray) {

    this.get = function (selector) {
        if (selector !== "nameID" && selector !== "POIArray") {
            console.log("incorrect attribute");
        } else {
            return this[selector];
        }
    };

    this.set = function (selector, value) {
        if (selector !== "nameID" && selector !== "POIArray") {
            console.log("incorrect attribute");
        } else {
            this[selector] = value;
        }
    };

    this.save = function () {
        if (!this.nameID || !this.POIArray) {
            console.log("you need either a nameID or POIArray");
        } else {
            var key = this.nameID;
            var value = JSON.stringify(this.POIArray); //need to store value as JSON
            window.localStorage.setItem(key, value);
        }
    };

    this.destroy = function () {
        if (!this.nameID || !this.POIArray) {
            console.log("There is nothing worth destroying");
        } else {
            window.localStorage.removeItem(this.nameID);
        }
    };

    if (nameID !== undefined && POIArray !== undefined) {
        this.nameID = nameID;
        this.POIArray = POIArray;
    }

};