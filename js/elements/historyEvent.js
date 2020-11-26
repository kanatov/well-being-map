'use strict';

class HistoryEvent {
	constructor(_parameters) {
		this._timestampUTC = _parameters.timestampUTC;
		this._timezoneOffset = _parameters.timezoneOffset;
	}
	get timestampUTC() {
		return this._timestampUTC;
	}
	get timezoneOffset() {
		return this._timezoneOffset;
	}
	get serialisedObject() {
		const object = {
			timestampUTC: this.timestampUTC,
			timezoneOffset: this.timezoneOffset,
		};
		return object;
	}
}