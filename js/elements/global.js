'use strict';

class Global {
	constructor(_strings, _global) {
		this._strings = _strings;
		this._global = {};

		this.updateGlobal(_global);
	}
	updateGlobal(_global) {
		if (_global) {
			for (var [key, value] of Object.entries(_global)) {
				this._global[key] = _global[key];
			}
		}
	}
	get strings() {
		return this._strings;
	}
	get global() {
		return this._global;
	}
}