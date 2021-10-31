const samplesDatabase = {}

function getSample(name){
	return samplesDatabase[name]
}

/*
 *
 * Samples
 *
 */


const samples = [

	({ name='sample0' }) => { 
		let sample = $jSpaghetti.module(name)
		sample.config.debugMode = true
		//var sequence = sample.sequence(sequenceName)
		return { name, sample }
	},


	({ name='sample1' }) => {
		let sample = $jSpaghetti.module(name)
		sample.config.debugMode = true
		//var sequence = sample.sequence(sequenceName)
		return { name, sample }
	}

]

samples.forEach(sampleFunction => {
	const { name, sample } = sampleFunction({})
	samplesDatabase[name] = sample
})
