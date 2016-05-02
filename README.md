jSpaghetti — Sequential and declarative JavaScript
==================================================

## Synopsis

jSpaghetti is a Javascript framework to build automation scripts with sequential and declarative paradigm.

## Motivation

The project came from the necessity of a easy way to write browser javascript bot. The project was generalized to cover other purposes, though.

## Installation

Just include the file on document page, like:
```html
<script type="text/javascript" src="jSpaghetti.js"></script>
```
This code can be also injected on the document page using tools like Greasemonkey or something.

## API Reference

### Modules
* Creating a new module
```js
var moduleObject = $jSpaguetti.module("myModule")
```

### Procedures
Procedures are custom functions to be used as a library for the sequences. Each module has its own procedures. 
* Defining procedures
```js
var $jSpaguetti.module("myModule").procedure("myProcedure1", function([sharedData[, internalFunctions]]){
	
})
```

### Sequences
* Creating a new module
```js
var moduleObject = $jSpaguetti.module("myModule")
```


#### Instructions

##### Commands

#### Running

#### Stopping

#### Debugging
