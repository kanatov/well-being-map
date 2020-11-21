'use strict';

class Name {
	constructor(_name) {
		this._id = (new Date()).getTime();
		this._name = _name;
	}
	get id() {
		return this._id;
	}
	get name() {
		return this._name;
	}
}