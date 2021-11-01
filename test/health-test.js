//====================================================//
// test: module creating
// it checks if environment creating raises any error
//====================================================//
const procedureBasic = function(data, tester) {
	
	const sampleModule = getSample('sampleClear')

	const sequenceName = `sequence${Math.floor((Math.random() * 9999999) + 1)}`
	const randomText = `text${Math.floor((Math.random() * 9999999) + 1)}`

	sampleModule.procedure("proc0", function(shared, hooks){
		shared.counter = 1
	    return randomText
	})

	const sequence = sampleModule.sequence(sequenceName)
	sequence.instructions = [
	    {0: "proc0"}
	]

	sequence.reset(() => {
		sequence.run()
		sequence.events.addEventListener("terminated", function(event){
			if(tester.observedValueDiverges('sequence name diverges', sequenceName, event.detail.name)) return
			if(tester.observedValueDiverges('default return diverges', randomText, event.detail.state.shared.$)) return
			if(tester.observedValueDiverges('some procedure are being executed multiple times', 1, event.detail.state.shared.counter)) return
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
	const sampleModule = getSample('sampleClear')
	sampleModule.procedure("proc0", function(shared, hooks){
	    return true
	})
	tester.forward()
}

let subjects = [
	procedureBasic,
	sequenceCreating
]

let tester = new BrowserTester(subjects)
tester.executeNextSubject()
//tester.resetState(() => {})

