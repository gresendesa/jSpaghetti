var module = $jSpaghetti.module("myModule")

module.config.debugMode = true
module.config.developerMode = true


module.procedure("foo", function(shared, hooks){
    console.log("inside foo")
    return null
})

module.procedure("baz", function(shared, hooks){
    setTimeout(() => {
        shared.ok = false
        hooks.next("pey")
    },5000)
})

module.procedure("bar", function(shared, hooks){
    console.log("inside bar")
    return null
})

module.procedure("boi", function(shared, hooks){
    console.log("inside boi")
    return null
})


var sequence = module.sequence("example")

sequence.instructions = [
    {"@init": ["foo","baz",{"jumpif":["!*.ok","@finish"]}]},
    {"@go": ["bar","boi"]},
    {"@finish": [{"exit": true}]}
]

sequence.events.addEventListener("terminated", function(seq){
    console.log("terminated sequence data", seq)
	sequence.reset()
})
sequence.run()