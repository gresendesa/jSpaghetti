function(sequenceName){
	var currentSequence = currentModule.sequences[sequenceName]
	var initialRoute = new Route(0, 0)
	var initialState = new State(initialRoute, {$: undefined}, null, false)
	var sequence = {
		name: sequenceName,
		module: currentModule,
		events: document.createDocumentFragment(),
		state: initialState,
		signalChannel: null,
		instructions: [],
		run: {% "run.js" %},
		reset: {% "reset.js" %}
	}
	if (currentSequence == undefined){ //It defines a new sequence object if it do not exist yet
		currentModule.sequences[sequenceName] = sequence
		currentSequence = currentModule.sequences[sequenceName]
	}
	//It returns a current sequence object
	return currentModule.sequences[sequenceName]
}