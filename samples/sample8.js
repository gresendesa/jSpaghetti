var m = $jSpaghetti.module("myModule")

m.config.debugMode = true
//module.config.developerMode = true

m.procedure("test", function(shared, hooks){
    
})

var sequence = m.sequence("example")

sequence.instructions = [
    {"@init": ["test"]}
]

sequence.events.addEventListener("terminated", function(){
	sequence.reset()
})
sequence.run()

setTimeout(() => {
    sequence.events.dispatchEvent(new Event("SEQUENCE_TERMINATED"))
},5000)

//Output: quick brown fox jumps over the lazy dog