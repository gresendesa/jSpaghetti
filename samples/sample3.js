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

sequence.reset()

sequence.instructions = [
    {"@init": ["foo",{"wait": 5000}]},
    {"@run": ["baz"]},
    {"@finish": ["_exit"]}
]

sequence.run()

//Output: quick brown fox jumps over the lazy dog