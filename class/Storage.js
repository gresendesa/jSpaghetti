/*Customizable Storage class*/
function(storageName){
	this.get = function(callback){
		if(callback)
		runAssyncronously(function(){
			callback(JSON.parse(sessionStorage.getItem(storageName)))
		})
	}
	this.set = function(data, callback){
		if(callback)
		runAssyncronously(callback)
		sessionStorage.setItem(storageName, JSON.stringify(data))
	}
	this.reset = function(callback){
		if(callback)
		runAssyncronously(callback)
		sessionStorage.removeItem(storageName)
	}
}