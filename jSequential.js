(function(){
	/*Global constants*/
	const LAST_COMMAND_TERMINATED = "lastCommandTerminated"
	const PAGE_IS_ABOUT_TO_RELOAD = "beforeunload"
	const EVENT_LAST_COMMAND_TERMINATED = new Event(LAST_COMMAND_TERMINATED)
	const STORAGE_NAME = "\"cborg:\" + moduleName + \":\" + sequenceName"
	const INTERNAL_COMMANDS_LIST = ["wait", "gotoif"]

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
		var nextRoute = {instruction: route.instruction, command: route.command}
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
						if (INTERNAL_COMMANDS_LIST.indexOf(internalComName) == -1) return "Internal command \"" + internalComName + "\" is undefined."
						break
					default:
						var procedureName = instructions[i][instructionLabel][z]
						if (!procedures.hasOwnProperty(procedureName)) return "Procedure \"" + procedureName + "\" is undefined."
						break
				}
			}
		}
		return false
	}

	/*It listens for the reload page event. It save all sequences states before to reload page*/
	window.addEventListener(PAGE_IS_ABOUT_TO_RELOAD, function(event){
		for(var moduleName in cborg.modules){
			for(var sequenceName in cborg.modules[moduleName].sequences){
				var localStorage = new cborg.Storage(eval(STORAGE_NAME))
				localStorage.set(cborg.modules[moduleName].sequences[sequenceName].state)
			}
		}
		console.log("Page Reloaded: All sequences saved")
	})

	/*Main framework object*/
	var cborg = {
		modules: {}, //This object stores each module as a element
		module: function(moduleName){ //This functionfile:///home/gresendesa/%C3%81rea%20de%20Trabalho/tomatojs/tomatonew/tomato.html returns the module object especified by moduleName
			var currentModule = cborg.modules[moduleName]
			var module = {
				sequences: {},
				procedures: {},
				procedure: function(procedureName, procedure){
					currentModule.procedures[procedureName] = procedure //It defines a new procedure. It overwrites if the procedure already exists
				},
				sequence: function(sequenceName){
					var currentSequence = currentModule.sequences[sequenceName]
					var sequence = {
						state: {
							shared: {$: null},
							route: {instruction: 0, command: 0},
							lastProcedureRoute: null,
							isWaitingForSignal: false
						},
						instructions: [],
						run: function(lastState){
							//-------------------//
							//--Data recovering--//
							//-------------------//
							if (lastState){ //It recovers the last state if avaiable
								currentSequence.state = lastState
							} else { //If the last state is not avaiable then data is caught from storage
								var localStorage = new cborg.Storage(eval(STORAGE_NAME)) //It sets the Storage object
								var storedData = localStorage.get()
								if (storedData){
									currentSequence.state = storedData //Restore the stored data
								}
							}
							console.log(currentSequence.state)

							//-------------------//
							//-----Listeners-----//
							//-------------------//
							var listener = document.createDocumentFragment() //Disposable element used to listen last command terminated event
							listener.addEventListener(LAST_COMMAND_TERMINATED, function(){ //It listens for last command terminated event
								//clearInterval(reloadPageListener)
								console.log("Last command terminated")
							})

							//-------------------//
							//--Command Handler--//
							//-------------------//
							var currentCommand = getCommandByRoute(currentSequence.instructions, currentSequence.state.route)

							//console.log(currentCommand)
							console.log(getNextRoute(currentSequence.instructions, currentSequence.state.route))
							console.log(checkInstructionsSyntax(currentSequence.instructions, currentModule.procedures))

							listener.dispatchEvent(EVENT_LAST_COMMAND_TERMINATED)
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
				cborg.modules[moduleName] = module
				currentModule = cborg.modules[moduleName]
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

	return $cborg = cborg
})()