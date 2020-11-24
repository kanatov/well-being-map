'use strict';

class Name {
	constructor(_strings) {
		this._id = _strings.id;
		this.name = _strings.name;
	}
	get id() {
		return this._id;
	}
	getSerialisedObject() {
		const object = {
			id: this.id,
			name: this.name
		};
		return object;
	}
}