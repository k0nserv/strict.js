(function(root) {
    "use strict";

    var LIB_NAME = 'Strict',

        Strict = Strict || {};


    Strict.String   = 1;
    Strict.Object   = 2;
    Strict.Function = 3;
    Strict.Number   = 4;
    Strict.Boolean  = 5;
    Strict.Array    = 6;

    var TypeMissMatchError = function(name, expected, received) {
        var message = LIB_NAME + ": Expected `" + name + "` to be of type `" + expected +
                       "` received `" + received +"`";
        return new TypeError(message);
    };

    var typeMap = {};
    typeMap[Strict.String]   = "[object String]";
    typeMap[Strict.Object]   = "[object Object]";
    typeMap[Strict.Function] = "[object Function]";
    typeMap[Strict.Number]   = "[object Number]";
    typeMap[Strict.Boolean]  = "[object Boolean]";
    typeMap[Strict.Array]    = "[object Array]";

    var isType = function(variable, type) {
        var toS = Object.prototype.toString.call(variable)

        if (!isUndefined(typeMap[type])) {
            return typeMap[type] === toS;
        }

        return false;
    },

    stringType = function(variable) {
        return Object.prototype.toString.call(variable);
    },

    isUndefined = function(variable) {
        return variable === null || typeof (void 0) === typeof variable;
    },

    deRef = function(variable) {
        if (isUndefined(this._iVars)) {
            this._iVars = {};
        }

        this._ = function(variable) {
            var result;
            if (!(result = this._iVars[variable])) {
                throw new ReferenceError();
            }

            return result.v;
        };

        return this._(variable);
    },


    setIVar = function(variable, value, type) {
        if (isUndefined(this._iVars)) {
            this._iVars = {};
        }

        this.$ = function(variable, value, type) {
            if (isUndefined(this._iVars[variable]) &&
                !isType(type, Strict.Number)) {
                throw new TypeError("Missing argument type");
            }

            type = type || this._iVars[variable].t;
            if (!isType(value, type)) {
                throw TypeMissMatchError(variable, typeMap[type], stringType(value));
            }

            this._iVars[variable] = {
                v: value,
                t: type
            };
        };

        this.$(variable, value, type);
    };


    Strict.create = function(obj) {
        obj.prototype._ = deRef;
        obj.prototype.$ = setIVar;

        return obj;
    };

    Strict.def = function(args, callback, optional) {
        if (!isType(callback, Strict.Function)) {
            throw TypeMissMatchError("callback", typeMap[Strict.Function], stringType(callback));
        }

        return function() {
            if (arguments.length < args.length) {
                throw new ArgumentError("Wrong number of arguments should be " + args.length);
            }
            var argumentsLength = args.length,
                resultArgs      = [];

            for (var i = 0; i < argumentsLength; ++i) {
                if ( !isType(arguments[i], args[i]) ) {
                    throw TypeMissMatchError("Argument " + i,
                        typeMap[args[i]], stringType(arguments[i]));
                }
                resultArgs.push(arguments[i]);
            }

            if (!isUndefined(optional)) {
                var numOptional = optional.length;

                for (var i = 0; i < numOptional; i += 2) {
                    var type    = optional[i],
                        value   = optional[i + 1];

                    if (argumentsLength + i < arguments.length) {
                        value = arguments[argumentsLength + i];
                    }

                    if ( !isType(value, type) ) {
                        throw TypeMissMatchError(
                            "Argument " + (argumentsLength + i),
                            typeMap[type],
                            stringType(value));
                    }
                    resultArgs.push(value);
                }
            }

            return callback.apply(callback, resultArgs);
        }
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = Strict;
        console.log("Exporting");
    }
    else {
        root.Strict = Strict;
    }
})(typeof (void 0) !== typeof global ? global : window);