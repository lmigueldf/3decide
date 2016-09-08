/**
 * Created 08 September 2016
 * @contact: Luís Fernandes <lmigueldf@gmail.com>
 */
var constants = {
    Helpers: {
        clone: function clone(obj) {
            var copy;
            // Handle the 3 simple types, and null or undefined
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }
            // Handle Date
            if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }
            // Handle Array
            if (obj instanceof Array) {
                copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = clone(obj[i]);
                }
                return copy;
            }
            // Handle Object
            if (obj instanceof Object) {
                copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) {
                        copy[attr] = clone(obj[attr]);
                    }
                }
                return copy;
            }
            throw new Error('Unable to copy obj! Its type isn\'t supported.');
        },
        carryScope: function (scope, fn) {
            scope = scope || window;
            var args = [];
            for (var t = 2, len = arguments.length; t < len; ++t) {
                args.push(arguments[t]);
            }
            return function () {
                var args2 = [];
                for (var i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                var argstotal = args.concat(args2);
                return fn.apply(scope, argstotal);
            };
        }
    }
};
module.exports = constants;
