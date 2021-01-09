var module = $jSpaghetti.module("myModule")

module.config.debugMode = true
//module.config.developerMode = true

module.procedure("foo", function(shared, hooks){
    console.log("message-foo")
    return true
})

module.procedure("baz", function(shared, hooks){
    console.log("message-baz")
    setTimeout(() => {
    	hooks.next("bouy");
    }, 5000);
})

module.procedure("bar", function(shared, hooks){
    console.log("message-bar")
    return true
})


var sequence = module.sequence("example")

sequence.instructions = [
    {"@init": ["foo"]},
    {"@run": ["baz","bar",{"wait": 5000}]},
    {"@finish": [{"wait": true}]}
]

sequence.events.addEventListener("terminated", function(seq){
    console.log("terminated sequence data", seq)
	sequence.reset()
})
sequence.run()

//Output: quick brown fox jumps over the lazy dog