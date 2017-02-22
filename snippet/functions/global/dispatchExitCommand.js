/*It defines route as null and show a message*/
function dispatchExitCommand(moduleName, sequenceName){
	jSpaghetti.modules[moduleName].sequences[sequenceName].state.route = null
	if (jSpaghetti.modules[moduleName].config.debugMode) showDebugMessage("Exit command dispatched (" + moduleName + ":" + sequenceName + ")", " ")
}