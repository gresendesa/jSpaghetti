/*It snapshots a object*/
function getObjectSnapshot(obj){
	if(typeof(obj) == 'object'){
		return JSON.parse(JSON.stringify(obj))
	} else return false
}