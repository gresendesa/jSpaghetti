//====================================================//
// test: module creating
// it checks if environment creating raises any error
//====================================================//
const moduleSequenceAndProcedureTest = function(data, subjectHooks) {
	const { module, sequence } = getEnvironment('mod', 'seq')

	module.procedure("proc0", function(shared, hooks){
		shared.payload = 'yo'
	    return true
	})

	sequence.instructions = [
	    {0: "proc0"}
	]

	sequence.events.addEventListener("terminated", function(event){
		//console.log(event.detail.state.shared)
		sequence.reset(() => {
			console.log('reseted')
			subjectHooks.forward()
		})
	})

	sequence.run()
}

//====================================================//
// test: sequence creating
// it checks if sequence creating raises any error
//====================================================//
const sequenceCreating = function(data, subjectHooks) {
	const { module, sequence } = getEnvironment('mod', 'seq')
	subjectHooks.forward()
}

let subjects = [
	moduleSequenceAndProcedureTest,
	sequenceCreating
]

let tester = new BrowserTester(subjects)
tester.executeNextSubject()
//tester.resetState(() => {})

