function(sequenceName){
	var currentSequence = currentModule.sequences[sequenceName]
	var initialRoute = new Route(0, 0)
	var initialState = new State(initialRoute, {}, null, false)
	var sequence = {
		name: sequenceName,
		hooks: getSharedFunctions(moduleName, sequenceName),
		module: currentModule,
		events: document.createDocumentFragment(),
		state: initialState,
		released: true,
		instructions: [],
		run: {% "run.js" %},
		reset: {% "reset.js" %}
	}

	sequence.events.addEventListener(LAST_COMMAND_TERMINATED, (event) => { //It listens for last command terminated event
		event.stopPropagation()
		currentModule.sequences[sequenceName].events.dispatchEvent(getEvent(SEQUENCE_RELEASED, currentModule.sequences[sequenceName]))
		if (currentModule.config.developerMode) showDebugMessage("Last command terminated event dispatched (" + moduleName + ":" + sequenceName + "): ", getObjectSnapshot(currentSequence.state))
		currentModule.sequences[sequenceName].run(currentSequence.state)
	})

	sequence.events.addEventListener(SEQUENCE_RELEASED, (event) => { //It listens for last command terminated event
		event.stopPropagation()
		if (currentModule.config.developerMode) showDebugMessage("Procedure released event dispatched (" + moduleName + ":" + sequenceName + "): ", getObjectSnapshot(currentSequence.state))
		currentModule.sequences[sequenceName].released = true
	})

	if (currentSequence == undefined){ //It defines a new sequence object if it do not exist yet
		currentModule.sequences[sequenceName] = sequence
		currentSequence = currentModule.sequences[sequenceName]
	}
	//It returns a current sequence object
	return currentModule.sequences[sequenceName]
}