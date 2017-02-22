/*It returns the instruction content by route*/
function getInstructionByRoute(instructions, route){
	var instructionLabel = getFirstAttribName(instructions[route.instruction])
	var instructionCommands = instructions[route.instruction][instructionLabel]
	return {label: instructionLabel, commands: instructionCommands}
}