#Strict.js

Experiments with strictly typed javascript.

Strict.js is a small experiment trying to achive some strictness in javascript function and object definitions.

##Example
`example.js` can be ran both via node.js or in the browser through the file `example.html`. 


##Usage

###Class

```
var Person = function(name, age, female) {
	//$ is used to define new variables
	//the type only needs to be specified when
	//the variable is defined, later it may be omitted

	//Define name as a string
	this.$('name', name, Strict.String);	
	
	//Define age as a number, int or float
	this.$('age', age, Strict.Number);
	
	//Define isFemal as a boolean
	this.$('isFemale', female, String.boolean);
};

/*	
	Init Strictness for Person objects. 
	This adds two new functions to the prototype
	of the object $ used for settings variables 
	and _ used to get values
*/
Strict.create(Person);

Person.prototype.birthday = function() {
	//It's the persons birthday, increment age by one.
	this.$('age', this._('age') + 1);
	
	return this._('age');
};

Person.prototype.adult = function() {
	return this._('age') >= 18;
}

var me = new Person('Hugo', 20, false);

console.log(me._('age'));//Returns 20

//Throws an error due to the miss-matched type
me.$('age', '20');

//Also throws an error, name is a string not a number
me.$('name', 10);
```

###Functions
```
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

Add the Strict variable utilites `$` and `_` to the prototype of obj.


> Function: $(variable, value, [type])

The `$` function is added to the prototype of objects passed to `Strict.create`. The function works as a setter.

**Example:** Declare and define the variable with on `this` to be a number with value 150

```
this.$('width', 150, Strict.Number);
````	

After declaring a variable the type no longer needs to be specified

```
this.$('width', 350);
````

> Function: _(variable)

The `_` funciton is added to the the prototype of objects passed to `Strict.create`. The functions works as a getter.

**Example:** Gets the previously defined variable `width`, will throw an error if `width` is not defined

```
this._('width');
```

> Function: Strict.def(func, argumnetTypes, [defaultArguments])

The `def` function is used to defined functions which constraints on argument types allowed. It also supports specifying default arguments. defaultArguments should be an array of even length e.g `[Strict.Number, 10]` defines one default argument of type Number with defaultValue `10`.

**Example:** Create a function which expects a number and a string as arguments

```
var func = Strict.def(function(num, str) {
	return str.charAt(num);
}, 
[Strict.Number, Strict.String]);
```

> Types:

The following types are supported as type parameters, the values are just constants used by the internal methods.


    Strict.String   = 1;
    Strict.Object   = 2;
    Strict.Function = 3;
    Strict.Number   = 4;
    Strict.Boolean  = 5;
    Strict.Array    = 6;





##License
Copyright (C) 2013 Hugo Tunius

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.