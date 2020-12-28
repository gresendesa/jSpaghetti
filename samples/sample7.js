var m = $jSpaghetti.module("myModule")

m.config.debugMode = true
//module.config.developerMode = true

m.procedure("foo", function(shared, hooks){
    console.log("message-foo")
    return true
})

m.procedure("baz", function(shared, hooks){
    console.log("message-baz")
    shared.count++
    if(shared.count>10){
        hooks.next('baz-returned')
    }
    return location.reload()
})

m.procedure("bar", function(shared, hooks){
    console.log("message-bar", "last return:", shared.$)
    return true
})


var sequence = m.sequence("example")

sequence.instructions = [
    {"@init": ["foo"]},
    {"@run": ["baz","bar",{"wait":"page-reload"}]},
    {"@finish": [{"exit":true}]}
]

sequence.events.addEventListener("terminated", function(){
	sequence.reset()
})
sequence.run()

//Output: quick brown fox jumps over the lazy dog