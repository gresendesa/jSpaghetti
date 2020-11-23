function(moduleName){ //This function returns the module object especified by moduleName
	var currentModule = jSpaghetti.modules[moduleName]
	var module = {
		name: moduleName,
		config: {
			debugMode: false,
			developerMode: false
		},
		sequences: {},
		procedures: {},
		procedure: {% "procedure.js" %},
		sequence: {% "sequence.js" %}
	}
	if (currentModule == undefined){ //It defines a new module if it do not exist yet
		jSpaghetti.modules[moduleName] = module
		currentModule = jSpaghetti.modules[moduleName]
	}
	return currentModule
}