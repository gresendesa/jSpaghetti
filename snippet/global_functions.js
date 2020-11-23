/*It gets the first attribute name of the object informed*/
{% "functions/global/getFirstAttribName.js" %}

/*It returns the instruction content by route*/
{% "functions/global/getInstructionByRoute.js" %}

/*It returns the command by route*/
{% "functions/global/getCommandByRoute.js" %}

/*It returns next route*/
{% "functions/global/getNextRoute.js" %}

/*This function returns the position of the first instruction that has the especified label name*/
{% "functions/global/getInstructionPosByLabel.js" %}

/*It checks if there is an error on instruction commands*/
{% "functions/global/checkInstructionsSyntax.js" %}

/*This function shows a custom message error on browser console*/
{% "functions/global/throwErrorNotification.js" %}

/*This function show a custom message on browser console*/
{% "functions/global/showDebugMessage.js" %}

/*This function evaluates a Tomato expression*/
{% "functions/global/evaluateExpression.js" %}

//Start signal listener process
{% "functions/global/startSignalListener.js" %}

//It gets the functions that can be used into the procedures
{% "functions/global/getSharedFunctions.js" %}

/*It defines route as null and show a message*/
{% "functions/global/dispatchExitCommand.js" %}

/*It snapshots a object*/
{% "functions/global/getObjectSnapshot.js" %}

/*It creates a new event object*/
{% "functions/global/getEvent.js" %}

/*It listens for the reload page event. It save all sequences states before to reload page*/
{% "functions/global/startStateSaver.js" %}

//It runs a functions assyncronously
{% "functions/global/runAssyncronously.js" %}