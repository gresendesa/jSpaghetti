(function(){
	const LAST_COMMAND_TERMINATED = "lastCommandTerminated"
const SEQUENCE_RELEASED = "sequenceReleased"
const PAGE_IS_ABOUT_TO_RELOAD = "beforeunload"
const SEQUENCE_TERMINATED = "terminated"
const SEQUENCE_RESET = "reset"
const STORAGE_NAME = "\"jSpaghetti:\" + moduleName + \":\" + sequenceName"
const EXIT_COMMAND = "exit"
const GOTOIF_COMMAND = "jumpif"
const WAIT_COMMAND = "wait"
const WAIT_FOR_PAGE_TO_RELOAD = "page-reload"
const INTERNAL_OBJECT_COMMANDS_LIST = [WAIT_COMMAND, GOTOIF_COMMAND, EXIT_COMMAND]
const DEFAULT_DELAY = 10
	/*Route class*/
/*Route class*/
function Route(intruction, command){
	this.instruction = intruction
	this.command = command
}

/*State class*/
/*State class*/
function State(route, shared, lastProcedureRoute, callLastProcedure){
	this.route = route
	this.shared = shared
	this.lastProcedureRoute = lastProcedureRoute
	this.callLastProcedure = callLastProcedure
}
	/*It gets the first attribute name of the object informed*/
/*It gets the first attribute name of the object informed*/
function getFirstAttribName(obj){
	return Object.keys(obj)[0]
}

/*It returns the instruction content by route*/
/*It returns the instruction content by route*/
function getInstructionByRoute(instructions, route){
	var instructionLabel = getFirstAttribName(instructions[route.instruction])
	var instructionCommands = instructions[route.instruction][instructionLabel]
	return {label: instructionLabel, commands: instructionCommands}
}

/*It returns the command by route*/
/*It returns the command by route*/
function getCommandByRoute(instructions, route){
	var instructionCommands = getInstructionByRoute(instructions, route).commands
	return instructionCommands[route.command]
}

/*It returns next route*/
/*It returns next route*/
function getNextRoute(instructions, route){
	var instructionCommands = getInstructionByRoute(instructions, route).commands
	var nextRoute = new Route(route.instruction, route.command)
	if (route.command < instructionCommands.length - 1){
		nextRoute.command += 1
	} else if (route.instruction < instructions.length - 1){
		nextRoute.instruction += 1
		nextRoute.command = 0
	} else {
		nextRoute = null
	}
	return nextRoute
}

/*This function returns the position of the first instruction that has the especified label name*/
/*This function returns the position of the first instruction that has the especified label name*/
function getInstructionPosByLabel(label, instructions){
	for (var i = 0; i < instructions.length; i++) {
		if (instructions[i].hasOwnProperty(label)) {
			return i
		}
	}
	return false
}

/*It checks if there is an error on instruction commands*/
/*It checks if there is an error on instruction commands*/
function checkInstructionsSyntax(instructions, procedures){
	if (instructions.length > 0){
		for (var i = 0; i < instructions.length; i++) {
			var instructionLabel = getFirstAttribName(instructions[i])

			if (Object.prototype.toString.call(instructions[i][instructionLabel]) != '[object Array]'){ //It turns a non object intruction content into a array
				instructions[i][instructionLabel] = [instructions[i][instructionLabel]]
			}
			for (var z = 0; z < instructions[i][instructionLabel].length; z++) {
				switch(typeof(instructions[i][instructionLabel][z])){
					case 'object':
						var internalComName = getFirstAttribName(instructions[i][instructionLabel][z])
						if (INTERNAL_OBJECT_COMMANDS_LIST.indexOf(internalComName) == -1) return "Internal command \"" + internalComName + "\" is undefined"
						var comContent = instructions[i][instructionLabel][z][internalComName]
						if ((internalComName == EXIT_COMMAND) || (internalComName == WAIT_COMMAND)){
							if (typeof(comContent) === 'object'){
								var label = getFirstAttribName(comContent)
								return "Label \"" + label + "\" is undefined"
							}
						} else
						if (internalComName == GOTOIF_COMMAND){
							if (Object.prototype.toString.call(comContent) == '[object Array]'){
								if (comContent.length < 2) return "Internal command \"" + internalComName + "\" must receive an array that must have at least 2 positions"
								for (var y = 1; y < comContent.length; y++) {
									var intructionLabel = comContent[y]
									if ((getInstructionPosByLabel(intructionLabel, instructions) === false) && (intructionLabel != EXIT_COMMAND)) return "Instruction label \"" + intructionLabel + "\" is undefined"
								}
							} else {
								return "Internal command \"" + internalComName + "\" must receive an array"
							}
						}
						break
					default:
						var procedureName = instructions[i][instructionLabel][z]
						if (!procedures.hasOwnProperty(procedureName) && (procedureName != EXIT_COMMAND)) return "Procedure \"" + procedureName + "\" is undefined"
						break
				}
			}
		}
		return true
	} else {
		return "There are no instructions to be executed"
	}
}

/*This function shows a custom message error on browser console*/
/*This function shows a custom message error on browser console*/
function throwErrorNotification(message, subject){
	console.error("jSpaghetti error:", message, subject)
}

/*This function show a custom message on browser console*/
/*This function show a custom message on browser console*/
function showDebugMessage(message, subject){
	console.log("jSpaghetti debug:", message, subject)
}

/*This function evaluates a Tomato expression*/
/*This function evaluates a Tomato expression*/
function evaluateExpression(expression, shared){
	const STORAGETOKEN = /\*|SHARED/g
	expression = String(expression).replace(STORAGETOKEN, "shared")
	var result = eval(expression)
	return result
}

//It gets the functions that can be used into the procedures
//It gets the functions that can be used into the procedures
function getSharedFunctions(moduleName, sequenceName){
	return{
		next: function(message){
			const callback = () => {
				if (jSpaghetti.modules[moduleName].config.debugMode) showDebugMessage("Next called (" + moduleName + ":" + sequenceName + "): ", message)
				//jSpaghetti.modules[moduleName].sequences[sequenceName].state.callLastProcedure = false
				//jSpaghetti.modules[moduleName].sequences[sequenceName].state.shared.$ = message
				jSpaghetti.modules[moduleName].sequences[sequenceName].events.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
			}
			jSpaghetti.modules[moduleName].sequences[sequenceName].state.callLastProcedure = false
			jSpaghetti.modules[moduleName].sequences[sequenceName].state.shared.$ = message
			if(jSpaghetti.modules[moduleName].sequences[sequenceName].released){
				callback()
			} else {
				const interval = setInterval(() => {
					if(jSpaghetti.modules[moduleName].sequences[sequenceName].released){
						clearInterval(interval)
						callback()
					}
				}, DEFAULT_DELAY * 5)
			}
		},
		getObjectSnapshot: getObjectSnapshot
	}
}

/*It defines route as null and show a message*/
/*It defines route as null and show a message*/
function dispatchExitCommand(moduleName, sequenceName){
	jSpaghetti.modules[moduleName].sequences[sequenceName].state.route = null
	if (jSpaghetti.modules[moduleName].config.debugMode) showDebugMessage("Exit command dispatched (" + moduleName + ":" + sequenceName + ")", " ")
}

/*It snapshots a object*/
/*It snapshots a object*/
function getObjectSnapshot(obj){
	if(typeof(obj) == 'object'){
		return JSON.parse(JSON.stringify(obj))
	} else return false
}

/*It creates a new event object*/
/*It creates a new event object*/
function getEvent(eventName){
	var newEvent = new Event(eventName)
	return newEvent
}

/*It listens for the reload page event. It save all sequences states before to reload page*/
/*It listens for the reload page event. It save all sequences states before to reload page*/
function startStateSaver() {
	window.addEventListener(PAGE_IS_ABOUT_TO_RELOAD, function(event){
		jSpaghetti.state.ready = false
		for(var moduleName in jSpaghetti.modules){
			for(var sequenceName in jSpaghetti.modules[moduleName].sequences){
				var localStorage = new jSpaghetti.Storage(eval(STORAGE_NAME))
				localStorage.set(jSpaghetti.modules[moduleName].sequences[sequenceName].state, function(){
					//nothing
				})
			}
		}
	})
}

//It runs a functions assyncronously
//It runs a functions assyncronously
function runAssyncronously(callback){
	setTimeout(function(){
		callback()
	}, 0)
}

	/*Main framework object*/
	var jSpaghetti = {
		state: {
			ready: true,
			running : false
		},
		version: "0.1.6",
		modules: {}, //This object stores each module as a element
		module: function(moduleName){ //This function returns the module object especified by moduleName
	var currentModule = jSpaghetti.modules[moduleName]
	var module = {
		name: moduleName,
		config: {
			debugMode: false,
			developerMode: false
		},
		sequences: {},
		procedures: {},
		procedure: function(procedureName, procedure){
	currentModule.procedures[procedureName] = procedure //It defines a new procedure. It overwrites if the procedure already exists
},
		sequence: function(sequenceName){
	var currentSequence = currentModule.sequences[sequenceName]
	var initialRoute = new Route(0, 0)
	var initialState = new State(initialRoute, {}, null, false)
	var sequence = {
		name: sequenceName,
		module: currentModule,
		events: document.createDocumentFragment(),
		state: initialState,
		released: true,
		instructions: [],
		run: function(lastState){
	setTimeout(function(){
		if (jSpaghetti.state.ready){
			//-------------------//
			//-----Listeners-----//
			//-------------------//
			if(!jSpaghetti.state.running){
				jSpaghetti.state.running = true
				startStateSaver()
			}
			//var listener = document.createDocumentFragment() //Disposable element used to listen last command terminated event
			//listener.addEventListener(LAST_COMMAND_TERMINATED, function(){ //It listens for last command terminated event

			//It checks the intructions syntax
			var resultSyntaxCheck = checkInstructionsSyntax(currentSequence.instructions, currentModule.procedures)

			var runNextCommand = function(commonData){
	if (commonData)
	currentSequence.state = commonData
	
	if ((currentSequence.state.route) &&
		(resultSyntaxCheck === true)){ //It executes only route is different from null
		//-------------------//
		//--Command Handler--//
		//-------------------//
		//It redirects the route to the last procedure if it configured that way
		if(currentSequence.state.callLastProcedure){
			currentSequence.state.callLastProcedure = false
			currentSequence.state.route = currentSequence.state.lastProcedureRoute
		}

		var currentCommand = getCommandByRoute(currentSequence.instructions, currentSequence.state.route)
		var currentCommandInstructionPosition = currentSequence.state.route.command
		var currentInstruction = getInstructionByRoute(currentSequence.instructions, currentSequence.state.route).label
		var nextRoute = getNextRoute(currentSequence.instructions, currentSequence.state.route)

		switch(typeof(currentCommand)){
			case 'object': //It handles internal object commands
				switch(Object.keys(currentCommand)[0]){
					case WAIT_COMMAND:
						if (currentCommand[WAIT_COMMAND] == WAIT_FOR_PAGE_TO_RELOAD){
							currentSequence.state.route = nextRoute
							if (currentModule.config.debugMode) showDebugMessage("Waiting for page to reload " + "(" + moduleName + ":" + sequenceName + ":" + currentInstruction + ":" + currentCommandInstructionPosition + ")", " ")
						} else {
							//It waits for the especified time until dispatching last command event
							var timeToWait = evaluateExpression(currentCommand[WAIT_COMMAND], currentSequence.state.shared)
							if (currentModule.config.debugMode) showDebugMessage("Waiting " + timeToWait + " ms (" + moduleName + ":" + sequenceName + ":" + currentInstruction + ":" + currentCommandInstructionPosition + ")", " ")
							var waitCount = 0
							var loop = setInterval(function(){
								waitCount++
								if ((!currentSequence.state.route) ||
									(waitCount >= timeToWait/DEFAULT_DELAY)){
									clearInterval(loop)
									if (!currentSequence.state.route){
										if (currentModule.config.debugMode) showDebugMessage("Wait process was abruptly interrupted (" + moduleName + ":" + sequenceName + ")", " ")
									} else {
										currentSequence.state.route = nextRoute
									}
									//listener.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
									currentModule.sequences[sequenceName].events.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
								}
							}, DEFAULT_DELAY)
						}
						break
					case GOTOIF_COMMAND:
						if (evaluateExpression(currentCommand[GOTOIF_COMMAND][0], currentSequence.state.shared)){
							if (currentModule.config.debugMode) showDebugMessage("Gotoif returned true (" + moduleName + ":" + sequenceName + ":" + currentInstruction + ":" + currentCommandInstructionPosition + ")", " ")
							var redirect = currentCommand[GOTOIF_COMMAND][1]
							currentSequence.state.route.command = 0
							currentSequence.state.route.instruction = getInstructionPosByLabel(currentCommand[GOTOIF_COMMAND][1], currentSequence.instructions)
						} else {
							if (currentModule.config.debugMode) showDebugMessage("Gotoif returned false (" + moduleName + ":" + sequenceName + ":" + currentInstruction + ":" + currentCommandInstructionPosition + ")", " ")
							if (currentCommand[GOTOIF_COMMAND].length > 2){
								var redirect = currentCommand[GOTOIF_COMMAND][2]
								currentSequence.state.route.command = 0
								currentSequence.state.route.instruction = getInstructionPosByLabel(currentCommand[GOTOIF_COMMAND][2], currentSequence.instructions)
							} else {
								currentSequence.state.route = nextRoute
							}
						}
						if (redirect){
							if (currentModule.config.debugMode) showDebugMessage("Flow redirected to \"" + redirect + "\" (" + moduleName + ":" + sequenceName + ")", " ")
						}
						//listener.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
						currentModule.sequences[sequenceName].events.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
						break

					case EXIT_COMMAND:
						var shouldExit = evaluateExpression(currentCommand[EXIT_COMMAND], currentSequence.state.shared)
						if(shouldExit){
							if (currentModule.config.debugMode) showDebugMessage("Exit returned true (" + moduleName + ":" + sequenceName + ":" + currentInstruction + ":" + currentCommandInstructionPosition + ")", " ")
							dispatchExitCommand(moduleName, sequenceName)
						} else {
							if (currentModule.config.debugMode) showDebugMessage("Exit returned false (" + moduleName + ":" + sequenceName + ":" + currentInstruction + ":" + currentCommandInstructionPosition + ")", " ")
							currentSequence.state.route = nextRoute	
						}
						currentModule.sequences[sequenceName].events.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
						break
					default: break
				}
				break
			default: //Ir handles custom procedure commands
				currentSequence.state.lastProcedureRoute = new Route(currentSequence.state.route.instruction, currentSequence.state.route.command)
				currentSequence.state.route = nextRoute
				if (currentModule.config.debugMode) showDebugMessage("Running command", "\"" + moduleName + ":" + sequenceName + ":" + currentInstruction + ":" + currentCommandInstructionPosition + ":" + currentCommand + "\"")
				//setTimeout makes asynchronous calls to prevent stack growing
				currentSequence.released = false
				currentSequence.state.callLastProcedure = true
				runAssyncronously(function(){
					const value_returned = currentModule.procedures[currentCommand](currentSequence.state.shared, getSharedFunctions(moduleName, sequenceName)) //It executes defined procedure strictly speaking
					//If the functions returns nothing, then the next state is not called automatically
					if(value_returned !== undefined){
						//listener.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
						currentSequence.state.callLastProcedure = false
						currentSequence.state.shared.$ = value_returned
						currentModule.sequences[sequenceName].events.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
					}
					//} else {
					//	currentSequence.state.callLastProcedure = true
					//}
					currentModule.sequences[sequenceName].events.dispatchEvent(getEvent(SEQUENCE_RELEASED))
				})
				break
		}
		
	} else {
		if (resultSyntaxCheck !== true) throwErrorNotification(resultSyntaxCheck + " (" + moduleName + ":" + sequenceName + ")", " ")
		if (currentSequence.state.route == null) {
			if (currentModule.config.debugMode) showDebugMessage("Sequence is terminated (" + moduleName + ":" + sequenceName + ")", " ")
			currentSequence.events.dispatchEvent(getEvent(SEQUENCE_TERMINATED)) //It says that sequence is terminated
		}
		
	}
}
			//-------------------//
			//--Data recovering--//
			//-------------------//
			if (lastState){ //It recovers the last state if avaiable
				if (currentModule.config.developerMode) showDebugMessage("Data recovered from the last state (" + moduleName + ":" + sequenceName + "): ", getObjectSnapshot(currentSequence.state))
				runNextCommand(lastState)
			} else { //If the last state is not avaiable then data is caught from storage
				var localStorage = new jSpaghetti.Storage(eval(STORAGE_NAME)) //It sets the Storage object
				localStorage.get(function(data){
					if(data){
						if (currentModule.config.developerMode) showDebugMessage("Data recovered from the local storage (" + moduleName + ":" + sequenceName + "): ", getObjectSnapshot(data))
						if(data.shared){
							data.shared = { ...currentSequence.state.shared, ...data.shared }
						}
						runNextCommand(data)
					} else {
						if (currentModule.config.developerMode) showDebugMessage("Data recovered from the initial state (" + moduleName + ":" + sequenceName + "): ", getObjectSnapshot(currentSequence.state))
						runNextCommand(currentSequence.state)
					}
				})
			}
													
		} else {
			if (currentModule.config.developerMode) showDebugMessage("jSpaghetti is not ready: Probably the page is about to be reloaded (" + moduleName + ":" + sequenceName + ")", " ")
		}
	}, DEFAULT_DELAY)
		
},
		reset: function(callback){
	currentSequence.state.route = null //Reset sequence
	setTimeout(function(){
		var routeReset = new Route(0, 0)
		currentSequence.state = new State(routeReset, {$: undefined}, null, false) //Reset sequence
		var localStorage = new jSpaghetti.Storage(eval(STORAGE_NAME))
		localStorage.reset(function(){
			if(callback)
			callback(currentSequence)
		}) 
		if (currentModule.config.debugMode) showDebugMessage("Sequence is reset (" + moduleName + ":" + sequenceName + ")", " ")
		currentSequence.events.dispatchEvent(getEvent(SEQUENCE_RESET))
	}, DEFAULT_DELAY * 5)
}
	}

	sequence.events.addEventListener(LAST_COMMAND_TERMINATED, (event) => { //It listens for last command terminated event
		event.stopPropagation()
		if (currentModule.config.developerMode) showDebugMessage("Last command terminated event dispatched (" + moduleName + ":" + sequenceName + "): ", getObjectSnapshot(currentSequence.state))
		currentModule.sequences[sequenceName].run(currentSequence.state)
	})

	sequence.events.addEventListener(SEQUENCE_RELEASED, (event) => { //It listens for last command terminated event
		event.stopPropagation()
		if (currentModule.config.developerMode) showDebugMessage("Procedure released event dispatched (" + moduleName + ":" + sequenceName + "): ", getObjectSnapshot(currentSequence.state))
		currentModule.sequences[sequenceName].released = true
	})

	if (currentSequence == undefined){ //It defines a new sequence object if it do not exist yet
		currentModule.sequences[sequenceName] = sequence
		currentSequence = currentModule.sequences[sequenceName]
	}
	//It returns a current sequence object
	return currentModule.sequences[sequenceName]
}
	}
	if (currentModule == undefined){ //It defines a new module if it do not exist yet
		jSpaghetti.modules[moduleName] = module
		currentModule = jSpaghetti.modules[moduleName]
	}
	return currentModule
},
		Storage: /*Customizable Storage class*/
function(storageName){
	this.get = function(callback){
		if(callback)
		runAssyncronously(function(){
			callback(JSON.parse(sessionStorage.getItem(storageName)))
		})
	}
	this.set = function(data, callback){
		if(callback)
		runAssyncronously(callback)
		sessionStorage.setItem(storageName, JSON.stringify(data))
	}
	this.reset = function(callback){
		if(callback)
		runAssyncronously(callback)
		sessionStorage.removeItem(storageName)
	}
}
	}
	return $jSpaghetti = jSpaghetti
})()
