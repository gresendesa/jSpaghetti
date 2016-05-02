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
$jSpaguetti.module("myModule").procedure("myProcedureFoo", function(){
	
})

$jSpaguetti.module("myModule").procedure("myProcedureBar", function(){
	
})

//Define as much as you need
```

### Sequences
A sequence provides a wrapped environment for the execution of the instructions. It manages the execution to provide a shared data between the procedures. The data is not lost when page is reloaded.
* Creating a new sequence
```js
var sequenceObject = $jSpaguetti.module("myModule").sequence("mySequenceBaz")
```

#### Instructions

##### Commands

#### Running

#### Stopping

#### Debugging
