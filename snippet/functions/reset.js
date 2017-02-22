function(callback){
	currentSequence.state.route = null //Reset sequence
	setTimeout(function(){
		var routeReseted = new Route(0, 0)
		currentSequence.state = new State(routeReseted, {$: undefined}, null, false) //Reset sequence
		var localStorage = new jSpaghetti.Storage(eval(STORAGE_NAME))
		localStorage.reset(function(){
			if(callback)
			callback(currentSequence)
		}) 
		if (currentModule.config.debugMode) showDebugMessage("Sequence is reset (" + moduleName + ":" + sequenceName + ")", " ")
		currentSequence.events.dispatchEvent(getEvent(SEQUENCE_RESET))
	}, DEFAULT_DELAY * 5)
}