'use strict';

class Name {
	constructor(_parameters, _global) {
		this._id = _parameters.id;
		this.name = _parameters.name;
	}
	get id() {
		return this._id;
	}
	get serialisedObject() {
		const object = {
			id: this.id,
			name: this.name
		};
		return object;
	}
}