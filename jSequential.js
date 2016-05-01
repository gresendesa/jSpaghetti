(function(){
	/*Global constants*/
	const LAST_COMMAND_TERMINATED = "lastCommandTerminated"
	const PAGE_IS_ABOUT_TO_RELOAD = "beforeunload"
	const EVENT_LAST_COMMAND_TERMINATED = new Event(LAST_COMMAND_TERMINATED)
	/*Storage class*/
	function Storage(storageName){
		this.storageName = storageName
		this.get = function(){
			return JSON.parse(sessionStorage.getItem(storageName))
		}
		this.set = function(data){
			sessionStorage.setItem(storageName, JSON.stringify(data))
		}
	}

	/*It listens for the reload page event. It save all sequences states before to reload page*/
	window.addEventListener(PAGE_IS_ABOUT_TO_RELOAD, function(event){
		for(var moduleName in cborg.modules){
			for(var sequenceName in cborg.modules[moduleName].sequences){
				var localStorage = new Storage(String("cborg:" + moduleName + ":" + sequenceName))
				localStorage.set(cborg.modules[moduleName].sequences[sequenceName].state)
			}
		}
	})

	/*Main framework object*/
	var cborg = {
		modules: {}, //This object stores each module as a element
		module: function(moduleName){ //This function returns the module object especified by moduleName
			var currentModule = cborg.modules[moduleName]
			var module = {
				sequences: {},
				procedures: {},
				procedure: function(procedureName, procedure){
					currentModule.procedures[procedureName] = procedure //It defines a new procedure. It overwrites if the procedure already exists
				},
				sequence: function(sequenceName){
					var currentSequence = currentModule.sequences[sequenceName]
					var sequence = {
						state: {
							shared: {},
							route: {instruction: 0, command: 0},
							lastProcedureRoute: null,
							isWaitingForSignal: false
						},
						instructions: [],
						run: function(){
							//--Storage--//
							var localStorage = new Storage(String("cborg:" + moduleName + ":" + sequenceName)) //It sets the Storage object
							var storedData = localStorage.get()
							if (storedData){
								currentSequence.state = storedData //Restore the stored data
							}
							//--Listeners--//
							var listener = document.createDocumentFragment() //Disposable element used to listen last command terminated event
							listener.addEventListener(LAST_COMMAND_TERMINATED, function(){ //It listens for last command terminated event
								//clearInterval(reloadPageListener)
								console.log("hey")
							})

							listener.dispatchEvent(EVENT_LAST_COMMAND_TERMINATED)
						}
					}
					if (currentSequence == undefined){ //It defines a new sequence object if it do not exist yet
						currentModule.sequences[sequenceName] = sequence
						currentSequence = currentModule.sequences[sequenceName]
					}
					//It returns a current sequence object
					return currentModule.sequences[sequenceName]
				}
			}
			if (currentModule == undefined){ //It defines a new module if it do not exist yet
				cborg.modules[moduleName] = module
				currentModule = cborg.modules[moduleName]
			}
			return currentModule
		}
	}

	return $cborg = cborg
})()