var module = $jSpaghetti.module("myModule")

module.procedure("A", function(){
    console.log("brown fox jumps ")
    return false
})
module.procedure("B", function(){
    console.log("over the lazy dog")
    return false
})
module.procedure("C", function(shared, func){
    console.log("quick ")
  	setTimeout(() => {
  		func.next()
  	}, 3000);
})

var sequence = module.sequence("showPhrase")

sequence.reset()

sequence.instructions = [
    {0: "C"},
    {"foo": ["A", "B"]}
]

sequence.run()

//Output: quick brown fox jumps over the lazy dog