var module = $jSpaghetti.module("myModule")

module.config.debugMode = true

module.procedure("A", function(){
    console.log("brown fox jumps ")
    return true
})
module.procedure("B", function(){
    console.log("over the lazy dog")
    return true
})
module.procedure("C", function(shared, hooks){
	console.log(shared)
    console.log("quick ")
    return true
})

var sequence = module.sequence("showPhrase")

sequence.state.shared.num1 = 2
sequence.state.shared.num2 = 1

sequence.instructions = [
    {0: "C"},
    {"foo": ["A", "B", {"exit": "*.num1 < *.num2"}, "C"]}
]

sequence.events.addEventListener("terminated", function(seq){
    console.log("terminated sequence data", seq)
	sequence.reset()
})

sequence.events.addEventListener("error", function(seq){
    console.log("error:", seq.detail)
    sequence.reset()
})

const sequenceError = module.sequence('emptySequence')
sequenceError.events.addEventListener("error", function(seq){
    console.log("error:", seq.detail)
    sequence.reset()
})

sequence.run()
sequenceError.run()

//Output: quick brown fox jumps over the lazy dog