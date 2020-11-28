function(commonData){
	if (commonData)
	currentSequence.state = commonData
	
	if ((currentSequence.state.route) &&
		(resultSyntaxCheck === true)){ //It executes only route is different from null
		//-------------------//
		//--Command Handler--//
		//-------------------//
		//It redirects the route to the last procedure route if it was waiting for the signal before page has reloaded
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
						if (typeof(currentCommand[WAIT_COMMAND]) == 'object'){
							switch(getFirstAttribName(currentCommand[WAIT_COMMAND])){
								case WAIT_FOR_THE_SIGNAL_FLAG:
									currentSequence.state.lastProcedureRoute = new Route(currentSequence.state.route.instruction, currentSequence.state.route.command)
									currentSequence.state.callLastProcedure = true
									currentSequence.state.route = nextRoute
									startSignalListener(moduleName, sequenceName) //It starts the signal listener
									if (currentModule.config.debugMode) showDebugMessage("Waiting for the signal and running command", "\"" + moduleName + ":" + sequenceName + ":" + currentInstruction + ":" + currentCommandInstructionPosition + ":" + currentCommand[WAIT_COMMAND][WAIT_FOR_THE_SIGNAL_FLAG] + "\"")
									runAssyncronously(function(){
										currentSequence.state.shared.$ = currentModule.procedures[currentCommand[WAIT_COMMAND][WAIT_FOR_THE_SIGNAL_FLAG]](currentSequence.state.shared, getSharedFunctions(moduleName, sequenceName)) //It executes defined procedure strictly speaking
									})

									break
								default: break
							}
						} else if (currentCommand[WAIT_COMMAND] == WAIT_FOR_THE_SIGNAL_FLAG){
							currentSequence.state.callLastProcedure = true
							currentSequence.state.route = nextRoute
							startSignalListener(moduleName, sequenceName) //It starts the signal listener
							if (currentModule.config.debugMode) showDebugMessage("Waiting for the signal " + "(" + moduleName + ":" + sequenceName + ":" + currentInstruction + ":" + currentCommandInstructionPosition + ")", " ")
						} else if (currentCommand[WAIT_COMMAND] == WAIT_FOR_PAGE_TO_RELOAD){
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
							if (currentCommand[GOTOIF_COMMAND][1] != EXIT_COMMAND){
								var redirect = currentCommand[GOTOIF_COMMAND][1]
								currentSequence.state.route.command = 0
								currentSequence.state.route.instruction = getInstructionPosByLabel(currentCommand[GOTOIF_COMMAND][1], currentSequence.instructions)
							} else dispatchExitCommand(moduleName, sequenceName)
						} else {
							if (currentModule.config.debugMode) showDebugMessage("Gotoif returned false (" + moduleName + ":" + sequenceName + ":" + currentInstruction + ":" + currentCommandInstructionPosition + ")", " ")
							if (currentCommand[GOTOIF_COMMAND].length > 2){
								if (currentCommand[GOTOIF_COMMAND][2] != EXIT_COMMAND){
									var redirect = currentCommand[GOTOIF_COMMAND][2]
									currentSequence.state.route.command = 0
									currentSequence.state.route.instruction = getInstructionPosByLabel(currentCommand[GOTOIF_COMMAND][2], currentSequence.instructions)
								} else dispatchExitCommand(moduleName, sequenceName)
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
					default: break
				}
				break
			default: //Ir handles custom procedure commands and _exit
				if (currentCommand != EXIT_COMMAND){
					currentSequence.state.lastProcedureRoute = new Route(currentSequence.state.route.instruction, currentSequence.state.route.command)
					currentSequence.state.route = nextRoute
					if (currentModule.config.debugMode) showDebugMessage("Running command", "\"" + moduleName + ":" + sequenceName + ":" + currentInstruction + ":" + currentCommandInstructionPosition + ":" + currentCommand + "\"")
					//setTimeout makes asynchronous calls to prevent stack growing
					currentSequence.released = false
					runAssyncronously(function(){
						const value_returned = currentModule.procedures[currentCommand](currentSequence.state.shared, getSharedFunctions(moduleName, sequenceName)) //It executes defined procedure strictly speaking
						//If the functions returns nothing, then the next state is not called automatically
						if(value_returned !== undefined){
							//listener.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
							currentSequence.state.shared.$ = value_returned
							currentModule.sequences[sequenceName].events.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
						} else {
							currentSequence.state.callLastProcedure = true
						}
						currentModule.sequences[sequenceName].events.dispatchEvent(getEvent(PROCEDURE_RELEASED))
					})
				} else {
					dispatchExitCommand(moduleName, sequenceName)
					//listener.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
					currentModule.sequences[sequenceName].events.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
				}
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