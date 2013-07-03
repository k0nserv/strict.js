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
**/
if (typeof(void 0) !== typeof require) {
    var Strict = require("./strict.js");
}

var Test = function() {
    this.$('a', 10, Strict.Number);
    this.$('b', 'Hello I am a strict string', Strict.String);
    this.$('c', {}, Strict.Object);
    this.$('d', [], Strict.Array);
    this.$('e', true, Strict.Boolean);
    this.$('f', function() {
        console.log();
    }, Strict.Function);
}

Strict.create(Test);

var t = new Test();

console.log(t._('b'));
console.log(t._('a'));
t.$('e', false);
console.log(t._('e'));

var
    absV = Strict.def(function(number) {
        return number >= 0 ? number : -number;
    }, [Strict.Number]),

    optV = Strict.def(function(number, other) {
        return other + " (" + number + ")";
    }, [Strict.Number], //Argumnets expected
    [Strict.String, "defaultValue"]), //Default arguments

    log = Strict.def(function(x, base) {
        return Math.log(base) / Math.log(x);
    }, [Strict.Number], //Always expects one number
    [Strict.Number, 2]); //Default argument base



console.log(absV(-10));

console.log(optV(10));
console.log(optV(10, "hello"));
console.log(log(2));
console.log(log(10, 10));