var module = $jSpaghetti.module("myModule")

module.procedure("A", function(){
    console.log("brown fox jumps ")
    return false
})
module.procedure("B", function(){
    console.log("over the lazy dog")
    return false
})
module.procedure("C", function(shared, hooks){
    console.log("quick ")
  	setTimeout(() => {
  		hooks.next()
  	}, 3000);
})

var sequence = module.sequence("showPhrase")

sequence.instructions = [
    {0: "C"},
    {"foo": ["A", "B"]}
]

sequence.events.addEventListener("terminated", function(seq){
  console.log("terminated sequence data", seq)
  sequence.reset()
})
sequence.run()

//Output: quick brown fox jumps over the lazy dog