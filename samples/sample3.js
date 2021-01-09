var module = $jSpaghetti.module("myModule")

module.config.debugMode = true
//module.config.developerMode = true

module.procedure("foo", function(shared, func){
    console.log("message-foo")
    return true
})

module.procedure("baz", function(shared, func){
    console.log("message-baz")
    return true
})

var sequence = module.sequence("example")

sequence.instructions = [
    {"@init": ["foo",{"wait": 5000}]},
    {"@run": ["baz"]},
    {"@finish": [{"exit": true}]}
]

sequence.events.addEventListener("terminated", function(seq){
	console.log("terminated sequence data", seq)
	sequence.reset()
})
sequence.run()

//Output: quick brown fox jumps over the lazy dog