'use strict';

class Name {
	constructor(_strings) {
		this._id = _strings.id;
		this._name = _strings.name;
	}
	get id() {
		return this._id;
	}
	get name() {
		return this._name;
	}

	getSerialisedObject() {
		const object = {
			id: this.id,
			name: this.name
		};
		return object;
	}
}