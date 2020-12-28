/*It checks if there is an error on instruction commands*/
function checkInstructionsSyntax(instructions, procedures){
	if (instructions.length > 0){
		for (var i = 0; i < instructions.length; i++) {
			var instructionLabel = getFirstAttribName(instructions[i])

			if (Object.prototype.toString.call(instructions[i][instructionLabel]) != '[object Array]'){ //It turns a non object intruction content into a array
				instructions[i][instructionLabel] = [instructions[i][instructionLabel]]
			}
			for (var z = 0; z < instructions[i][instructionLabel].length; z++) {
				switch(typeof(instructions[i][instructionLabel][z])){
					case 'object':
						var internalComName = getFirstAttribName(instructions[i][instructionLabel][z])
						if (INTERNAL_OBJECT_COMMANDS_LIST.indexOf(internalComName) == -1) return "Internal command \"" + internalComName + "\" is undefined"
						var comContent = instructions[i][instructionLabel][z][internalComName]
						if ((internalComName == EXIT_COMMAND) || (internalComName == WAIT_COMMAND)){
							if (typeof(comContent) === 'object'){
								var label = getFirstAttribName(comContent)
								return "Label \"" + label + "\" is undefined"
							}
						} else
						if (internalComName == GOTOIF_COMMAND){
							if (Object.prototype.toString.call(comContent) == '[object Array]'){
								if (comContent.length < 2) return "Internal command \"" + internalComName + "\" must receive an array that must have at least 2 positions"
								for (var y = 1; y < comContent.length; y++) {
									var intructionLabel = comContent[y]
									if ((getInstructionPosByLabel(intructionLabel, instructions) === false) && (intructionLabel != EXIT_COMMAND)) return "Instruction label \"" + intructionLabel + "\" is undefined"
								}
							} else {
								return "Internal command \"" + internalComName + "\" must receive an array"
							}
						}
						break
					default:
						var procedureName = instructions[i][instructionLabel][z]
						if (!procedures.hasOwnProperty(procedureName) && (procedureName != EXIT_COMMAND)) return "Procedure \"" + procedureName + "\" is undefined"
						break
				}
			}
		}
		return true
	} else {
		return "There are no instructions to be executed"
	}
}