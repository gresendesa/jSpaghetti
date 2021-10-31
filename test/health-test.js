//====================================================//
// test: module creating
// it checks if environment creating raises any error
//====================================================//
const moduleSequenceAndProcedureTest = function(data, tester) {
	

	const sampleModule = getSample('sample0')
	sampleModule.procedure("proc0", function(shared, hooks){
		shared.payload = 'yo'
	    return true
	})

	var sequence = sampleModule.sequence("basic")

	sequence.instructions = [
	    {0: "proc0"}
	]

	sequence.events.addEventListener("terminated", function(event){
		sequence.reset(() => {
			console.log('reseted')
			tester.forward()
		})
	})

	sequence.run()
}

//====================================================//
// test: sequence creating
// it checks if sequence creating raises any error
//====================================================//
const sequenceCreating = function(data, tester) {
	const { module, sequence } = getEnvironment('mod', 'seq')
	tester.forward()
}

let subjects = [
	moduleSequenceAndProcedureTest,
	sequenceCreating
]

let tester = new BrowserTester(subjects)
tester.executeNextSubject()
//tester.resetState(() => {})

