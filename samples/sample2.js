var module = $jSpaghetti.module("myModule")

//module.config.debugMode = true
//module.config.developerMode = true

module.procedure("A", function(shared, func){
    console.log("brown fox jumps ")
    return false
})
module.procedure("B", function(shared, func){
    console.log("over the lazy dog --> ", shared.$)
    setTimeout(() => {
      func.next("opa")
    }, 2000)
})
module.procedure("C", function(shared, func){
    console.log("quick ")
  	return false
})
module.procedure("D", function(shared, func){
    console.log("here D --> last returned:", shared.$)
    shared.foo = 70
    return false
})
module.procedure("E", function(shared, func){
    console.log("here E. foo =",shared.foo)
    return "fkapitalism"
})
module.procedure("F", function(shared, func){
    console.log("here F --> last returned:", shared.$)
    return "@gmail.com"
})

var sequence = module.sequence("showPhrase")

sequence.reset()

sequence.instructions = [
    {0: "C"},
    {"foo": ["A","B","D",{"gotoif":["SHARED.foo>=70","bar","baz"]}]},
    {"bar": ["E"]},
    {"baz": ["F"]}
]

sequence.run()

//Output: quick brown fox jumps over the lazy dog