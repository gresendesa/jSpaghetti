(function(){
	return $cborg = {
		modules: {}, //This object stores each module as a element
		module: function(moduleName){ //This function returns the module object especified by moduleName
			var currentModule = $cborg.modules[moduleName]
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
				$cborg.modules[moduleName] = module
				currentModule = $cborg.modules[moduleName]
			}
			return currentModule
		}
	}
})()