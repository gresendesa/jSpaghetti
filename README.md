[jSpaghetti](https://github.com/gresendesa/jSpaghetti)
=================================================

## Synopsis

jSpaghetti is a Javascript API to build automation scripts with sequential and declarative paradigm.

## Motivation

The project came from the necessity of an easy way to write browser javascript bots. The project was generalized to cover other purposes, though.

## Installation

Just include the file on document page, like:
```html
<script type="text/javascript" src="jSpaghetti.js"></script>
```
This code can be also injected on the document page using tools like Greasemonkey or something.

## API Reference
Warning: This manual is just a sketch. Detailed manual coming soon

### Modules
* Creating a new module
```js
var moduleObject = $jSpaghetti.module("myModule")
```

### Procedures
Procedures are custom functions to be used as a library for the sequences. Each module has its own procedures. 
* Defining procedures
```js
$jSpaghetti.module("myModule").procedure("myProcedureFoo", function(){
	//Code something in here
})

$jSpaghetti.module("myModule").procedure("myProcedureBar", function(){
	//Code something in here
})

//Define as much as you need
```

### Sequences
A sequence provides a wrapped environment for the execution of the instructions. It manages the execution to provide a shared data between the procedures. The data is not lost when page is reloaded.
* Creating a new sequence
```js
var sequenceObject = $jSpaghetti.module("myModule").sequence("mySequenceBaz")
```

#### Instructions
This is the best part. You can use a declarative way to write the script behavior. Procedures can be arranged to be executed in a defined order:
```js
sequenceObject.intructions = [
	{"step1":["myProcedureFoo", "myProcedureBar"]},
	{"labelX":"myProcedureBax"}
]

//Define as much as you need
```

##### Commands
Internal commands can change the script behavior.
```js 
"_exit" //Finish the sequence execution
``` 
```js 
{"wait": 1000} //Wait the defined time in ms
``` 
```js 
{"wait": "_forTheSignal"} //Wait until a signal is dispached
``` 
```js 
{"wait": "_forPageToReload"} //Pause the sequence execution and resume after page is reloaded
```
```js 
{"gotoif":["2 == 1", "step1", "labelX"]} // It redirects the program flow (In this case to the "labelX")
``` 

#### Running
* To execute a sequence use something like this:
```js
$jSpaghetti.module("myModule").procedure("myProcedureBar").run()
```

#### Stopping
```js
$jSpaghetti.module("myModule").procedure("myProcedureBar").reset()
```
#### Debugging
To see what is happening during the sequence execution, turn on the debug mode. The debugging log will be shown on browser console.
```js
$jSpaghetti.module("myModule").config.debugMode = true
```

### Shared data
Data can be shared between procedures during the sequence execution. The shared object is received as the first parameter on each procedure. If this object is modified, that changes will be available for the next instruction. The previous procedure return value is always available on the "$" attribute of this object. 

```js
$jSpaghetti.module("myModule").procedure("myProcedureBar", function(sharedData){
	console.log(sharedData.$) //It will show the value returned for the previous procedure
	sharedData.foo = "baz" //This attribute and its value will be available for the next procedures
	return 2000 //This value will be available on the "$" attribute in the next procedure
})
```

### Events
The sequences return the "terminated" event when the sequence is done.
```js
$jSpaghetti.module("myModule").procedure("myProcedureBar").events.addEventListener("terminated", function(){
	//Code something in here
})
```

### Examples

```js
var module = $jSpaghetti.module("myModule")

module.procedure("A", function(){
    console.log("brown fox jumps ")
})
module.procedure("B", function(){
    console.log("over the lazy dog")
})
module.procedure("C", function(){
    console.log("quick ")
})

var sequence = module.sequence("showPhrase")
sequence.instructions = [
    {0: "C"},
    {"foo": ["A", "B"]}
]

sequence.run()

//Output: quick brown fox jumps over the lazy dog

```
