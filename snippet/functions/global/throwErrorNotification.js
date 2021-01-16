/*This function shows a custom message error on browser console*/
function throwErrorNotification(message, subject, target, event){
	console.error("jSpaghetti error:", message, subject)
	if(target){
		target.dispatchEvent(event)
	}
}