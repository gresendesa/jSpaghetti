/*It returns the command by route*/
function getCommandByRoute(instructions, route){
	var instructionCommands = getInstructionByRoute(instructions, route).commands
	return instructionCommands[route.command]
}