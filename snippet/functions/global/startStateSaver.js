/*It listens for the reload page event. It save all sequences states before to reload page*/
function startStateSaver() {
	window.addEventListener(PAGE_IS_ABOUT_TO_RELOAD, function(event){
		jSpaghetti.state.ready = false
		for(var moduleName in jSpaghetti.modules){
			for(var sequenceName in jSpaghetti.modules[moduleName].sequences){
				//var localStorage = new jSpaghetti.Storage(eval(STORAGE_NAME))
				var localStorage = new jSpaghetti.Storage(STORAGE_NAME(moduleName, sequenceName))
				localStorage.set(jSpaghetti.modules[moduleName].sequences[sequenceName].state, function(){
					//nothing
				})
			}
		}
	})
}