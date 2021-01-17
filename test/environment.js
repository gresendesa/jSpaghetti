function getEnvironment(moduleName, sequenceName) {

	var module = $jSpaghetti.module(moduleName)
	module.config.debugMode = true

	module.procedure("C", function(shared, hooks){
	    return true
	})

	var sequence = module.sequence(sequenceName)

	sequence.state.shared.num1 = 2
	sequence.state.shared.num2 = 1

	sequence.instructions = [
	    {0: "C"}
	]

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