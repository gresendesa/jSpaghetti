//It runs a functions assyncronously
function runAssyncronously(callback){
	setTimeout(function(){
		callback()
	}, 0)
}