'use strict';

class Task extends Name {
	constructor(_parameters) {
		super(_parameters);
		this.categories = _parameters.categories;
		this.historyEvents = _parameters.historyEvents;
	}

	get serialisedObject() {
		const objectSuper = super.serialisedObject;
		const objectThis = {
			categories: this.categories,
			historyEvents: this.historyEvents
		};
		let object = {
			...objectSuper,
			...objectThis
		}

		return object;
	}

	get timestamp() {
		const now = new Date();
		const timestamp = {
			utc: now.getTime(),
			timezoneOffset: now.getTimezoneOffset()
		}
		return timestamp;
	}

	removeCategory(_categoryID) {
		if (this.categories[_categoryID]) {
			delete this.categories[_categoryID];
		}
	}

	use() {
		const timestamp = this.timestamp;
		this.historyEvents[timestamp.utc] = timestamp.timezoneOffset;
	}
}