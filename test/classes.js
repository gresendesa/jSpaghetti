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

	constructor(subject, tester) {
		this.subject = subject
		this.subjectOrder = 1 + tester.subjects.findIndex((element, index, array) => {
			return subject === element
		})
		this.testerSubjectsAmount = tester.subjects.length
		Test.page.publicInfo({ text: `running test ${this.subject.name} [${this.subjectOrder}/${this.testerSubjectsAmount}]` })
	}

	run(payload, hooks) {
		try {
			console.warn(`RUNNING SUBJECT [${this.subject.name}] [${this.subjectOrder}/${this.testerSubjectsAmount}]`, 'payload', payload)
			const value = this.subject(payload, hooks)
			Test.onSuccess({ message: `success on ${this.subject.name} [${this.subjectOrder}/${this.testerSubjectsAmount}]` })
			return value
		} catch (e) {
			Test.onFailure({ label: `error on ${this.subject.name} [${this.subjectOrder}/${this.testerSubjectsAmount}]`, message: e })
			throw new Error(`error on test ${this.subject.name} [${this.subjectOrder}/${this.testerSubjectsAmount}]`)
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
	static forwardEvent = 'forward'
	static initialState = {
		cursor: null,
		data: null
	}

	/*
		Tester class

		description: The class receives an array of subject which should be tested.
		The subjects are supposed to be tested in order. One after another.
		If the page reloads, the state of the tester must be preserved.
		The state is composed by:
			- cursor: An integer that saves the current subject under testing
			- data: Some data which will be passed to the test
	*/

	state = BrowserTester.initialState

	constructor(subjects) {
		this.subjects = subjects
		this.events = document.createDocumentFragment()
		window.addEventListener('beforeunload', (event) => {
			this.saveState(() => {console.log('ok before reload')})
		})
	}

	pickState(callback) {
		if(typeof callback === 'function'){
			if (this.state.cursor!==null){
				var state = this.state
			} else {
				var state = JSON.parse(sessionStorage.getItem(BrowserTester.storageLabel))
				state = ((state) ? state : {
					cursor: 0,
					data: {}
				})
			}
			callback(state)
		}
	}

	saveState(callback) {
		if(this.state.cursor!==null){
			sessionStorage.setItem(BrowserTester.storageLabel, JSON.stringify(this.state))
		}
		if(typeof callback === 'function'){
			callback()
		}
	}

	resetState(callback) {
		sessionStorage.removeItem(BrowserTester.storageLabel)
		this.state = BrowserTester.initialState
		callback()
	}

	finish() {
		this.resetState(() => {
			console.log('ok finished')
		})
	}

	executeNextSubject(value) {

		const forwardHook = (value) => {
			if(typeof this.subjects[this.state.cursor+1] === 'undefined'){
				this.finish()
				return
			}
			this.state.cursor += 1
			this.executeNextSubject(value)
		}

		const updateStateHook = (object) => {
			//Object.assign(this.state, object)
			this.state = Deep.merge(this.state, object)
		}

		const getStateHook = () => {
			return this.state
		}


		const runSubject = ({ cursor, subjects, payload }) => {
			let test = new Test(subjects[cursor], this)
			let hooks = { 
				forward: forwardHook, 
				updateState: updateStateHook, 
				getState: getStateHook 
			}
			return test.run(payload, hooks) //Here payload and hooks are passed to subject test
		}

		this.pickState((state) => {
			this.state = state
			let cursor = this.state.cursor
			let subjects = this.subjects
			let payload = value
			runSubject({ cursor, subjects, payload })
		})
		
	}

}