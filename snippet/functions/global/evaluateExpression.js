/*This function evaluates a Tomato expression*/
function evaluateExpression(expression, shared){
	const STORAGETOKEN = /\*/g
	expression = String(expression).replace(STORAGETOKEN, "shared")
	var result = eval(expression)
	return result
}