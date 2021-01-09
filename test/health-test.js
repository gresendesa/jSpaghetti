class TestPage {

	constructor() {
		this.container = document.getElementById("steps")
	}

	pushItem({ item, className }) {
		this.container.insertAdjacentHTML('beforeend', `<li class="${className}">${item}</li>`);
	}

	publicSucess({ text }) {
		let item =  `✅ ${text}`
		let className = 'success'
		this.pushItem({ item, className })
	}

	publicInfo({ text }) {
		let item =  `ℹ ${text}`
		let className = 'info'
		this.pushItem({ item, className })
	}

	publicFailure({ text }) {
		let item =  `❌ ${text}`
		let className = 'failure'
		this.pushItem({ item, className })
	}

}

class Test {

	static page = new TestPage()

	constructor(subject) {
		this.subject = subject
		Test.page.publicInfo({ text: `running test ${this.subject.name}` })
	}

	run(data) {
		try {
			const value = this.subject(data)
			Test.onSuccess({ message: `success on ${this.subject.name}` })
			return value
		} catch (e) {
			Test.onFailure({ label: `error on ${this.subject.name}`, message: e })
			throw new Error(`error on test ${this.subject.name}`)
		}
	}

	static onSuccess({ label, message }) {
		Test.page.publicSucess({ text: message })
	}

	static onFailure({ label, message }) {
		Test.page.publicFailure({ text: `${label} => ${message}` })
	}

}

class BrowserTester {

	static storageLabel = 'browsertest-state'

	/*
		Tester class

		description: The class receives an array of subject which should be tested.
		The subjects are supposed to be tested in order. One after another.
		If the page reloads, the state of the tester must be preserved.
		The state is composed by:
			- cursor: An integer that saves the current subject under testing
			- data: Some data which will be passed to the test
	*/

	state = {}

	constructor(subjects) {
		this.subjects = subjects
		this.data = null
		this.cursor = 0
	}

	getState(callback) {
		callback(localStorage.getItem(BrowserTester.storageLabel))
	}

	saveState(callback) {
		localStorage.setItem(BrowserTester.storageLabel, this.state)
		callback()
	}

	resetState(callback) {
		localStorage.setItem(BrowserTester.storageLabel, undefined)
		callback()
	}

	execute() {

		const runSubject = function({ cursor, subjects, data }){
			let test = new Test(subjects[cursor])
			return test.run(data)
		}

		this.getState((state) => {
			let cursor = ((state) ? state.cursor : 0)
			let subjects = this.subjects
			let data = ((state) ? state.data : {})
			runSubject({ cursor, subjects, data })
		})
	}

}

let test = null
let data = null

//====================================================//
// test: module creating
// it checks if module creating raises any error
//====================================================//
let moduleCreating = function(data) {
	let randomName = `module${Math.floor((Math.random() * 100) + 1)}`
	var randomModule = $jSpaghetti.module(randomName)
	return randomModule
}
test = new Test(moduleCreating)
data = test.run({})

//====================================================//
// test: sequence creating
// it checks if sequence creating raises any error
//====================================================//
let sequenceCreating = function(mod) {
	let randomName = `sequence${Math.floor((Math.random() * 100) + 1)}`
	var randomSequence = mod.sequence(randomName)
}
//test = new Test(sequenceCreating)
//data = test.run(data)

let subjects = [
	moduleCreating,
	sequenceCreating
]

//const tester = new BrowserTester(subjects)
//tester.execute()


/*setInterval(() => {
	(new TestPage()).publicSucess({ text: 'ok' })
	(new TestPage()).publicFailure({ text: 'error' })
}, 2000)*/