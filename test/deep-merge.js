//Source: https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6

class Deep {
	// Merge a `source` object to a `target` recursively
	static merge(target, source)  {
	// Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
		for (const key of Object.keys(source)) {
			if (source[key] instanceof Object) Object.assign(source[key], Deep.merge(target[key], source[key]))
		}

		// Join `target` and modified `source`
		Object.assign(target || {}, source)
		return target
	}
}