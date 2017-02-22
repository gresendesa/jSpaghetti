/*This function returns the position of the first instruction that has the especified label name*/
function getInstructionPosByLabel(label, instructions){
	for (var i = 0; i < instructions.length; i++) {
		if (instructions[i].hasOwnProperty(label)) {
			return i
		}
	}
	return false
}