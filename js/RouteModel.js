var RouteModel = function () {

    this.get = function (selector) {
        if (selector !== "nameID" || selector !== "POIArr") {
            console.log("incorrect attribute");
        } else {
            return this[selector];
        }
    };

    this.set = function (selector, value) {
        if (selector !== "nameID" || selector !== "POIArr") {
            console.log("incorrect attribute");
        } else {
            this[selector] = value;
        }
    };

    this.save = function () {
        if (!this.nameID || !this.POIArr) {
            console.log("you need either a nameID or POIArr")
        } else {
            var key = this.nameID;
            var value = this.POIArr; //need to store value as JSON
            window.localStorage.setItem(key, value);
        }
    };

}