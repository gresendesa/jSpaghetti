/*It returns next route*/
function getNextRoute(instructions, route){
	var instructionCommands = getInstructionByRoute(instructions, route).commands
	var nextRoute = new Route(route.instruction, route.command)
	if (route.command < instructionCommands.length - 1){
		nextRoute.command += 1
	} else if (route.instruction < instructions.length - 1){
		nextRoute.instruction += 1
		nextRoute.command = 0
	} else {
		nextRoute = null
	}
	return nextRoute
}