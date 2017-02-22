//Start signal listener process
function startSignalListener(moduleName, sequenceName){
	var currentSequence = jSpaghetti.modules[moduleName].sequences[sequenceName]
	var loop = setInterval(function(){
		if ((!currentSequence.state.route) || ((currentSequence.signalChannel != null) && (jSpaghetti.state.ready))){
			clearInterval(loop)
			if (!currentSequence.state.route){
				if (jSpaghetti.modules[moduleName].config.debugMode) showDebugMessage("Signal listener was abruptly interrupted (" + moduleName + ":" + sequenceName + ")", " ")
			} else {
				if (jSpaghetti.modules[moduleName].config.debugMode) showDebugMessage("Roger! (" + moduleName + ":" + sequenceName + "): ", currentSequence.signalChannel)
				currentSequence.state.shared.$ = currentSequence.signalChannel
				currentSequence.signalChannel = null
				currentSequence.state.callLastProcedure = false
			}

			jSpaghetti.modules[moduleName].sequences[sequenceName].run(currentSequence.state)
		}
	}, DEFAULT_DELAY)
}