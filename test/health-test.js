//====================================================//
// test: module creating
// it checks if environment creating raises any error
//====================================================//
let moduleCreating = function(data, hooks) {
	let { module, sequence } = getEnvironment('mod', 'seq')
	console.log(module, sequence)
	hooks.forward()
}

//====================================================//
// test: sequence creating
// it checks if sequence creating raises any error
//====================================================//
let sequenceCreating = function(data, hooks) {
	let { module, sequence } = getEnvironment('mod', 'seq')
	console.log(module, sequence)
	hooks.forward()
}

let subjects = [
	moduleCreating,
	sequenceCreating
]

let tester = new BrowserTester(subjects)
tester.executeNextSubject()
//tester.resetState(() => {})

