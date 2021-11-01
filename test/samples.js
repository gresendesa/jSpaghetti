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

	({ name='sampleClear' }) => { 
		let sample = $jSpaghetti.module(name)
		sample.config.debugMode = true
		return { name, sample }
	},


	({ name='sampleCore' }) => {
		let sample = $jSpaghetti.module(name)
		sample.config.debugMode = true
		return { name, sample }
	}

]

samples.forEach(sampleFunction => {
	const { name, sample } = sampleFunction({})
	samplesDatabase[name] = sample
})
