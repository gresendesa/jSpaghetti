(function(){
	{% "snippet/constants.js" %}
	{% "snippet/global_classes.js" %}
	{% "snippet/global_functions.js" %}

	/*Main framework object*/
	var jSpaghetti = {
		state: {
			ready: true,
			running : false
		},
		version: "0.1.6",
		modules: {}, //This object stores each module as a element
		module: {% "snippet/functions/module.js" %},
		Storage: {% "class/Storage.js" %}
	}
	return $jSpaghetti = jSpaghetti
})()