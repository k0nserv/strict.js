/**
Copyright (C) 2013 Hugo Tunius

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Strict.js - Experiment with strict typed variables and functions in javascript.
**/
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

    toCamelCase = function(string) {
        /** Credit to http://stackoverflow.com/users/590522/fredric
            found in
            http://stackoverflow.com/questions/2970525/javascript-regex-camel-case-sentence-case
        **/
        return string.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2, offset) {
            if (p2) return p2.toUpperCase();
            return p1.toLowerCase();
        });
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


    setIVar = function(variable, value) {
        if (isUndefined(this._iVars)) {
            this._iVars = {};
        }

        this.$ = function(variable, value) {
            if (!this._iVars[variable]) {
                throw new Error("Variable `" + variable + "` has not been defined " +
                    "use define(variable, value, type) to define it");
            }
            var type = this._iVars[variable].t;
            if (!isType(value, type)) {
                throw TypeMissMatchError(variable, typeMap[type], stringType(value));
            }

            this._iVars[variable].v = value;
        };

        this.$(variable, value);
    },

    define = function(variable, value, type) {
        if (isUndefined(this._iVars)) {
            this._iVars = {};
        }
        if (isUndefined(this._iVars[variable]) && !isType(type, Strict.Number)) {
            throw new TypeError("Missing argument type");
        }

        if (!isUndefined(this._iVars[variable])) {
            throw new Error("Variable `" + variable + "` is already defined");
        }

        type = type || this._iVars[variable].t;
        if (!isType(value, type)) {
            throw TypeMissMatchError(variable, typeMap[type], stringType(value));
        }

        var getCase = toCamelCase(variable),
            setCase = toCamelCase("set " + getCase);

        if (isUndefined(this[setCase])) {
            this[setCase] = function(value) {
                this.$(variable, value);
            };
        }

        if (isUndefined(this[getCase])) {
            this[getCase] = function() {
                return this._(variable);
            };
        }

        this._iVars[variable] = {
            v: value,
            t: type
        };
    },

    handleVariable = function(variable, value) {
        var fn = setIVar;

        if (value === void 0) {
            fn = deRef;
        }

        return fn.call(this, variable, value);
    };


    Strict.create = function(obj) {
        obj.prototype.$         = handleVariable;
        obj.prototype.define    = define;

        return obj;
    };

    Strict.def = function(callback, args, optional) {
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