function(commonData){
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
									currentSequence.events.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED, currentSequence))
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
						currentSequence.events.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED, currentSequence))
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
						currentSequence.events.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED, currentSequence))
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
					try {

						const value_returned = currentModule.procedures[currentCommand](currentSequence.state.shared, currentSequence.hooks) //It executes defined procedure strictly speaking
						//If the functions returns nothing, then the next state is not called automatically
						if(value_returned !== undefined){
							//listener.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
							currentSequence.state.callLastProcedure = false
							currentSequence.state.shared.$ = value_returned
							currentSequence.events.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED, currentSequence))
						} else {
							currentSequence.events.dispatchEvent(getEvent(SEQUENCE_RELEASED, currentSequence))
						}

					} catch (error) {
						let errorMessage = error + " (" + moduleName + ":" + sequenceName + ":" + currentInstruction + ":" + currentCommandInstructionPosition + ":" + currentCommand + ")"
						throwErrorNotification(errorMessage, " ", currentSequence.events, getEvent(SEQUENCE_ERROR, errorMessage))
					}
				})
				break
		}
		
	} else {
		if (resultSyntaxCheck !== true){
			let errorMessage = resultSyntaxCheck + " (" + moduleName + ":" + sequenceName + ")"
			throwErrorNotification(errorMessage, " ", currentSequence.events, getEvent(SEQUENCE_ERROR, errorMessage))
		}
		if (currentSequence.state.route == null) {
			if (currentModule.config.debugMode) showDebugMessage("Sequence is terminated (" + moduleName + ":" + sequenceName + ")", " ")
			currentSequence.events.dispatchEvent(getEvent(SEQUENCE_TERMINATED, currentSequence)) //It says that sequence is terminated
		}
		
	}
}