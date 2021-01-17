//It gets the functions that can be used into the procedures
function getSharedFunctions(moduleName, sequenceName){
	return{
		next: function(message){
			const currentSequence = jSpaghetti.modules[moduleName].sequences[sequenceName]
			currentSequence.blocked = true
			const callback = () => {
				currentSequence.blocked = false
				if (jSpaghetti.modules[moduleName].config.debugMode) showDebugMessage("Next called (" + moduleName + ":" + sequenceName + "): ", message)
				currentSequence.events.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED, currentSequence))
			}
			currentSequence.state.callLastProcedure = false
			currentSequence.state.shared.$ = message
			if(currentSequence.released){
				callback()
			} else {
				const interval = setInterval(() => {
					if(currentSequence.released){
						clearInterval(interval)
						callback()
					}
				}, DEFAULT_DELAY * 5)
			}
		},
		raise: function(message){
			const currentSequence = jSpaghetti.modules[moduleName].sequences[sequenceName]
			currentSequence.blocked = true
			const callback = () => {
				let currentSequence = jSpaghetti.modules[moduleName].sequences[sequenceName]
				currentSequence.blocked = false
				if (jSpaghetti.modules[moduleName].config.debugMode) showDebugMessage("Error raised (" + moduleName + ":" + sequenceName + "): ", message)
				//const currentCommand = getCommandByRoute(currentSequence.instructions, currentSequence.state.route)
				//const currentCommandInstructionPosition = currentSequence.state.route.command
				//const currentInstruction = getInstructionByRoute(currentSequence.instructions, currentSequence.state.route).label
				//let errorMessage = message + " (" + moduleName + ":" + sequenceName + ":" + currentInstruction + ":" + currentCommandInstructionPosition + ":" + currentCommand + ")"
				let errorMessage = message + " (" + moduleName + ":" + sequenceName + ")"
				currentSequence.events.dispatchEvent(getEvent(SEQUENCE_ERROR, errorMessage))
			}
			if(currentSequence.released){
				callback()
			} else {
				const interval = setInterval(() => {
					if(currentSequence.released){
						clearInterval(interval)
						callback()
					}
				}, DEFAULT_DELAY * 5)
			}
		},
		getObjectSnapshot: getObjectSnapshot
	}
}