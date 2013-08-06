#Strict.js

Experiments with strictly typed javascript.

Strict.js is a small experiment trying to achieve some strictness in javascript function and object definitions.

##Example
`example.js` can be ran both via node.js or in the browser through the file `example.html`.


##Usage

###Class

```javascript
var Person = function(name, age, female) {
	//define is used to define new variables

	//Define name as a string
	this.define('name', name, Strict.String);

	//Define age as a number, int or float
	this.define('age', age, Strict.Number);

	//Define isFemale as a boolean
	this.define('isFemale', female, String.Boolean);
};

/*
	Init Strictness for Person objects.
	This adds two new functions to the prototype
	of the object:

	 * $ used for setting variables or getting variables
	 * define for defining variables
*/
Strict.create(Person);

Person.prototype.birthday = function() {
	//It's the persons birthday, increment age by one.

	this.$('age', this.$('age') + 1);
	//or this.setAge(this.age() + 1);

	return this.$('age'); //or this.age();
};

Person.prototype.adult = function() {
	return this.$('age') >= 18; // or this.age() >= 18;
}

var me = new Person('Hugo', 20, false);

console.log(me.$('age'));//Returns 20

//Throws an error due to the miss-matched type
me.$('age', '20');
//or me.setAge('20');

//Also throws an error, name is a string not a number
me.$('name', 10);
//or me.setName(10);
```

###Functions
```javascript
//A function that calculates the nth fibonacci-number
var fib = Strict.def(function(n) {
	if (n === 0 || n === 1) {
		return 1;
	}

	return fib(n - 1) + fib(n - 2);
}, [Strigt.Number]);

console.log(fib(5));//8
/*
  Throws an error because fib expects a
  number as the first argument not a string
*/
console.log(fib('5'));


//A function that calculates the logarithm of a
//number in base 2 or a given base.
var log = Strict.def(function(x, base) {
	return Math.log(base) / Math.log(x);
},
[Strict.Number], //Always expects one number
[Strict.Number, 2]); //Default argument base

console.log(log(2)); //1
console.log(log(10, 10));//1
```

##Documentation
> Function: Strict.create(obj)

Add the Strict variable utilities `define`, and `$` to the prototype of obj.

> Function: define(variable, value, type)

The `define` function is added to the prototype of objects passed to `Strict.create`. The function defines a new variable and creates setters and getters for it in camelcase.

**Example:**
```javascript
define('width', 150, Strict.Number)
```

creates the setter `setWidth` and the getter `width`. The values can also be accessed and modified through the `_` and `$` functions.


> Function: $(variable, [,value])

The `$` function is added to the prototype of objects passed to `Strict.create`. The function works as a setter or a getter depending on the number of argumenets.
If value is undefined the function works as a getter

**Example:** Set the value of a previously created variable

```javascript
this.$('width', 350);
```

**Example:** Get the value of previously created variable
```javscript
this.$('width');
```

> Function: Strict.def(func, argumnetTypes, [defaultArguments])

The `def` function is used to defined functions which constraints on argument types allowed. It also supports specifying default arguments. defaultArguments should be an array of arrays e.g `[[Strict.Number, 10]]` defines one default argument of type Number with defaultValue `10`.

**Example:** Create a function which expects a number and a string as arguments

```javascript
var func = Strict.def(function(num, str) {
	return str.charAt(num);
},
[Strict.Number, Strict.String]);
```

> Types:

The following types are supported as type parameters, the values are just constants used by the internal methods.

```javascript
Strict.String   = 1;
Strict.Object   = 2;
Strict.Function = 3;
Strict.Number   = 4;
Strict.Boolean  = 5;
Strict.Array    = 6;
```

##Ideas

* ~~Generate setters and getters on the from `setA` and `a`.~
* OOP stuff like overriding, inheritance and abstractions





##License
Copyright (C) 2013 Hugo Tunius

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.