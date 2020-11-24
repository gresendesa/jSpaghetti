function(lastState){
	setTimeout(function(){
		if (jSpaghetti.state.ready){
			//-------------------//
			//-----Listeners-----//
			//-------------------//
			if(!jSpaghetti.state.running){
				jSpaghetti.state.running = true
				startStateSaver()
			}
			//var listener = document.createDocumentFragment() //Disposable element used to listen last command terminated event
			//listener.addEventListener(LAST_COMMAND_TERMINATED, function(){ //It listens for last command terminated event

			//It checks the intructions syntax
			var resultSyntaxCheck = checkInstructionsSyntax(currentSequence.instructions, currentModule.procedures)

			var runNextCommand = {% "runNextCommand.js" %}
			//-------------------//
			//--Data recovering--//
			//-------------------//
			if (lastState){ //It recovers the last state if avaiable
				if (currentModule.config.developerMode) showDebugMessage("Data recovered from the last state (" + moduleName + ":" + sequenceName + "): ", getObjectSnapshot(currentSequence.state))
				runNextCommand(lastState)
			} else { //If the last state is not avaiable then data is caught from storage
				var localStorage = new jSpaghetti.Storage(eval(STORAGE_NAME)) //It sets the Storage object
				localStorage.get(function(data){
					if(data){
						if (currentModule.config.developerMode) showDebugMessage("Data recovered from the local storage (" + moduleName + ":" + sequenceName + "): ", getObjectSnapshot(currentSequence.state))
					} else {
						if (currentModule.config.developerMode) showDebugMessage("Data recovered from the initial state (" + moduleName + ":" + sequenceName + "): ", getObjectSnapshot(currentSequence.state))
					}
					runNextCommand(data)
				})
			}
													
		} else {
			if (currentModule.config.developerMode) showDebugMessage("jSpaghetti is not ready: Probably the page is about to be reloaded (" + moduleName + ":" + sequenceName + ")", " ")
		}
	}, DEFAULT_DELAY)
		
}