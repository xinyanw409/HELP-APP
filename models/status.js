'use strict';

module.exports = class {
    static get(status){
        switch(status) {
            case "ok":
                return 1;
            case "help":
                return 2;
            case "emergency":
                return 3;
            case "undefined":
                return 4;
        }
    }
}