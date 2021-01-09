var mod = $jSpaghetti.module("myModule")

mod.config.debugMode = true

mod.procedure("C", function(shared, hooks){
    return true
})

var sequence = mod.sequence("showPhrase")

sequence.state.shared.num1 = 2
sequence.state.shared.num2 = 1

sequence.instructions = [
    {0: "C"}
]

/*sequence.events.addEventListener("terminated", function(){
	sequence.reset()
})
sequence.run()*/

//Output: quick brown fox jumps over the lazy dog