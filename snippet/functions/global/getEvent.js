/*It creates a new event object*/
function getEvent(eventName, sequence){
	var newEvent = new CustomEvent(eventName, {detail: sequence})
	return newEvent
}