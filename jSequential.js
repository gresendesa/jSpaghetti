(function(){
	/*Global constants*/
	const LAST_COMMAND_TERMINATED = "lastCommandTerminated"
	const PAGE_IS_ABOUT_TO_RELOAD = "beforeunload"
	const STORAGE_NAME = "\"jSequential:\" + moduleName + \":\" + sequenceName"
	const INTERNAL_OBJECT_COMMANDS_LIST = ["wait", "gotoif"]

	/*Route class*/
	function Route(intruction, command){
		this.instruction = intruction
		this.command = command
	}

	/*It gets the first attribute name of the object informed*/
	function getFirstAttribName(obj){
		return Object.keys(obj)[0]
	}

	/*It returns the instruction content by route*/
	function getInstructionByRoute(instructions, route){
		var instructionLabel = getFirstAttribName(instructions[route.instruction])
		var instructionCommands = instructions[route.instruction][instructionLabel]
		return instructionCommands
	}

	/*It returns the command by route*/
	function getCommandByRoute(instructions, route){
		var instructionCommands = getInstructionByRoute(instructions, route)
		return instructionCommands[route.command]
	}

	/*It returns next route*/
	function getNextRoute(instructions, route){
		var instructionCommands = getInstructionByRoute(instructions, route)
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

	/*It checks if there is an error on instruction commands*/
	function checkInstructionsSyntax(instructions, procedures){
		for (var i = 0; i < instructions.length; i++) {
			var instructionLabel = getFirstAttribName(instructions[i])
			if (typeof instructions[i][instructionLabel] == 'string'){ //It turns string intruction content into a array
				instructions[i][instructionLabel] = [instructions[i][instructionLabel]]
			}
			for (var z = 0; z < instructions[i][instructionLabel].length; z++) {
				switch(typeof(instructions[i][instructionLabel][z])){
					case 'object':
						var internalComName = getFirstAttribName(instructions[i][instructionLabel][z])
						if (INTERNAL_OBJECT_COMMANDS_LIST.indexOf(internalComName) == -1) return "Internal command \"" + internalComName + "\" is undefined."
						break
					default:
						var procedureName = instructions[i][instructionLabel][z]
						if (!procedures.hasOwnProperty(procedureName) && (procedureName != "_exit")) return "Procedure \"" + procedureName + "\" is undefined."
						break
				}
			}
		}
		return true
	}

	//This function shows a custom message error on browser console
	function throwErrorNotification(message, subject){
		console.error("jSequential error: ", message, subject)
	}

	function showDebugMessage(message, subject){
		console.log("jSequential debug: ", message, subject)
	}

	/*It listens for the reload page event. It save all sequences states before to reload page*/
	window.addEventListener(PAGE_IS_ABOUT_TO_RELOAD, function(event){
		jSequential.state.ready = false
		for(var moduleName in jSequential.modules){
			for(var sequenceName in jSequential.modules[moduleName].sequences){
				var localStorage = new jSequential.Storage(eval(STORAGE_NAME))
				localStorage.set(jSequential.modules[moduleName].sequences[sequenceName].state)
			}
		}
	})

	/*Main framework object*/
	var jSequential = {
		state: {
			ready: true
		},
		modules: {}, //This object stores each module as a element
		module: function(moduleName){ //This function returns the module object especified by moduleName
			var currentModule = jSequential.modules[moduleName]
			var module = {
				config: {
					debugMode: false
				},
				sequences: {},
				procedures: {},
				procedure: function(procedureName, procedure){
					currentModule.procedures[procedureName] = procedure //It defines a new procedure. It overwrites if the procedure already exists
				},
				sequence: function(sequenceName){
					var currentSequence = currentModule.sequences[sequenceName]
					var initialRoute = new Route(0, 0)
					var sequence = {
						state: {
							shared: {$: null},
							route: initialRoute,
							lastProcedureRoute: null,
							isWaitingForSignal: false
						},
						instructions: [],
						run: function(lastState){
							if (jSequential.state.ready){
								//-------------------//
								//--Data recovering--//
								//-------------------//
								if (lastState){ //It recovers the last state if avaiable
									currentSequence.state = lastState
									if (currentModule.config.debugMode) showDebugMessage("Data recovered from last state (" + moduleName + ":" + sequenceName + "): ", currentSequence.state)
								} else { //If the last state is not avaiable then data is caught from storage
									var localStorage = new jSequential.Storage(eval(STORAGE_NAME)) //It sets the Storage object
									var storedData = localStorage.get()
									if (storedData){
										currentSequence.state = storedData //Restore the stored data
										if (currentModule.config.debugMode) showDebugMessage("Data recovered from local storage (" + moduleName + ":" + sequenceName + "): ", currentSequence.state)
									} else {
										if (currentModule.config.debugMode) showDebugMessage("Data recovered from initial state (" + moduleName + ":" + sequenceName + "): ", currentSequence.state)
									}
								}

								//It checks the intructions syntax
								var resultSyntaxCheck = checkInstructionsSyntax(currentSequence.instructions, currentModule.procedures)
								if ((currentSequence.state.route) &&
									(resultSyntaxCheck === true)){ //It executes only route is different from null
									//-------------------//
									//-----Listeners-----//
									//-------------------//
									var listener = document.createDocumentFragment() //Disposable element used to listen last command terminated event
									listener.addEventListener(LAST_COMMAND_TERMINATED, function(){ //It listens for last command terminated event
										currentModule.sequences[sequenceName].run(currentSequence.state)
										//console.log("Last command terminated")
									})

									//-------------------//
									//--Command Handler--//
									//-------------------//
									var lastCommandTerminatedEvent = new Event(LAST_COMMAND_TERMINATED)
									var currentCommand = getCommandByRoute(currentSequence.instructions, currentSequence.state.route)
									var nextRoute = getNextRoute(currentSequence.instructions, currentSequence.state.route)

									switch(typeof(currentCommand)){
										case 'object':
											console.log("hey")
											break
										default:
											if (currentCommand != "_exit"){
												currentSequence.state.lastProcedureRoute = new Route(currentSequence.state.route.instruction, currentSequence.state.route.command)
												currentSequence.state.route = nextRoute
												if (currentModule.config.debugMode) showDebugMessage("Running procedure", "\"" + moduleName + ":" + sequenceName + ":" + currentCommand + "\"")
												currentSequence.state.shared.$ = currentModule.procedures[currentCommand](currentSequence.state.shared) //It executes defined procedure strictly speaking
												listener.dispatchEvent(lastCommandTerminatedEvent)
											} else {
												currentSequence.state.route = null
												listener.dispatchEvent(lastCommandTerminatedEvent)
												if (currentModule.config.debugMode) showDebugMessage("Exit command dispatched", " ")
											}
											break
									}
									
								}
								if (resultSyntaxCheck !== true) throwErrorNotification(resultSyntaxCheck, " ")
								if ((currentSequence.state.route == null) && (currentModule.config.debugMode)) showDebugMessage("Sequence is terminated", " ")
							} else {
								if (currentModule.config.debugMode) showDebugMessage("Sequence is blocked, probably page is about to be reloaded", " ")
							}
								
						}
					}
					if (currentSequence == undefined){ //It defines a new sequence object if it do not exist yet
						currentModule.sequences[sequenceName] = sequence
						currentSequence = currentModule.sequences[sequenceName]
					}
					//It returns a current sequence object
					return currentModule.sequences[sequenceName]
				}
			}
			if (currentModule == undefined){ //It defines a new module if it do not exist yet
				jSequential.modules[moduleName] = module
				currentModule = jSequential.modules[moduleName]
			}
			return currentModule
		},
		Storage: function(storageName){ /*Customizable Storage class*/
			this.storageName = storageName
			this.get = function(){
				return JSON.parse(sessionStorage.getItem(this.storageName))
			}
			this.set = function(data){
				sessionStorage.setItem(this.storageName, JSON.stringify(data))
			}
		}
	}

	return $jSequential = jSequential
})()