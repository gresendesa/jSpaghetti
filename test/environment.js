function getEnvironment(moduleName, sequenceName) {

	var module = $jSpaghetti.module(moduleName)
	module.config.debugMode = true

	var sequence = module.sequence(sequenceName)

	return {
		module,
		sequence
	}
}


/*sequence.events.addEventListener("terminated", function(){
	sequence.reset()
})
sequence.run()*/

//Output: quick brown fox jumps over the lazy dog