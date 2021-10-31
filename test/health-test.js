//====================================================//
// test: module creating
// it checks if environment creating raises any error
//====================================================//
const moduleSequenceAndProcedureTest = function(data, tester) {
	
	const sampleModule = getSample('sampleClear')
	sampleModule.procedure("proc0", function(shared, hooks){
	    return true
	})

	const sequenceName = `sequence${Math.floor((Math.random() * 9999999) + 1)}`

	const sequence = sampleModule.sequence(sequenceName)
	sequence.instructions = [
	    {0: "proc0"}
	]

	sequence.reset(() => {
		sequence.run()
		sequence.events.addEventListener("terminated", function(event){
			if(event.detail.name !== sequenceName){
				tester.notifyError('sequence name diverges')
				return
			}
			sequence.reset(() => {
				tester.forward()
			})
		})
	})
	
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

