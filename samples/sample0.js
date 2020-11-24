var module = $jSpaghetti.module("myModule")

module.procedure("A", function(){
    console.log("brown fox jumps ")
    return true
})
module.procedure("B", function(){
    console.log("over the lazy dog")
    return true
})
module.procedure("C", function(shared, hooks){
    console.log("quick ")
    return true
})

var sequence = module.sequence("showPhrase")

sequence.reset()

sequence.instructions = [
    {0: "C"},
    {"foo": ["A", "B"]}
]

sequence.run()

//Output: quick brown fox jumps over the lazy dog