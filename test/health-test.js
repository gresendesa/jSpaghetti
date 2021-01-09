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

const testPage = new TestPage()


//====================================================//
// test: module creating
// it checks if module creating raises any error
//====================================================//
var testName = 'module creating'
testPage.publicInfo({ text: `running test: ${testName}` })
try{
	let randomName = `module${Math.floor((Math.random() * 100) + 1)}`
	var randomModule = $jSpaghetti.module(randomName)
	testPage.publicSucess({ text: testName })
} catch (e) {
	testPage.publicFailure({ text: `testName => ${e}` })
	throw new Error(`error on test: ${testName}`);
}

//====================================================//
// test: sequence creating
// it checks if sequence creating raises any error
//====================================================//
var testName = 'sequence creating'
testPage.publicInfo({ text: `running test: ${testName}` })
try{
	let randomName = `sequence${Math.floor((Math.random() * 100) + 1)}`
	var randomModule = randomModule.sequence(randomName)
	testPage.publicSucess({ text: testName })
} catch (e) {
	testPage.publicFailure({ text: `testName => ${e}` })
	throw new Error(`error on test: ${testName}`);
}




/*setInterval(() => {
	(new TestPage()).publicSucess({ text: 'ok' })
	(new TestPage()).publicFailure({ text: 'error' })
}, 2000)*/