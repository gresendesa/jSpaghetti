var m = $jSpaghetti.module("myModule")

m.config.debugMode = true
//module.config.developerMode = true

m.procedure("test", function(shared, hooks){
	//throw('merd')
	console.log('waiting 5 sec to raise an error')
    setTimeout(() => {
    	hooks.raise('oh gosh!')
    }, 5000)
})

var sequence = m.sequence("example")

sequence.instructions = [
    {"@init": ["test"]}
]

sequence.events.addEventListener("error", function(e){
	console.log("error raised", e.detail)
	sequence.reset()
})

sequence.events.addEventListener("terminated", function(e){
	sequence.reset()
})


sequence.run()