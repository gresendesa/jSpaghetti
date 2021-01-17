var m = $jSpaghetti.module("myModule")

m.config.debugMode = true
//module.config.developerMode = true

m.procedure("test", function(shared, hooks){
    
})

var sequence = m.sequence("example")

sequence.instructions = [
    {"@init": ["test"]}
]

sequence.events.addEventListener("terminated", function(seq){
	console.log("terminated sequence data", seq)
	sequence.reset()
})
sequence.run()

setTimeout(() => {
	console.log('sending SEQUENCE_TERMINATED event...')
    sequence.events.dispatchEvent(new Event("terminated"))
},5000)

//Output: quick brown fox jumps over the lazy dog