//====================================================//
// test: module creating
// it checks if module creating raises any error
//====================================================//
let moduleCreating = function(data, hooks) {
	let randomName = `module${Math.floor((Math.random() * 100) + 1)}`
	var randomModule = $jSpaghetti.module(randomName)
	let state = hooks.getState()
	if(!state.data.ok){
		console.log('reloading')
		hooks.updateState({data: {ok: true}})
		location.reload()
	} else {
		hooks.forward(randomModule)
	}	
}

//====================================================//
// test: sequence creating
// it checks if sequence creating raises any error
//====================================================//
let sequenceCreating = function(mod, hooks) {
	let randomName = `sequence${Math.floor((Math.random() * 100) + 1)}`
	var randomSequence = mod.sequence(randomName)
	hooks.forward()
}

let subjects = [
	moduleCreating,
	sequenceCreating
]

let tester = new BrowserTester(subjects)
tester.executeNextSubject()
//tester.resetState(() => {})

