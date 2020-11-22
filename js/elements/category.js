'use strict';

class Category extends Name {
	constructor(_strings) {
		super(_strings);
		// this._activitiesID = [];
	}

	getSerialise() {
		const objectSuper = super.getSerialisedObject();
		const objectCategory = {};

		let object = {
			...objectSuper,
			...objectCategory
		}

		return object;
	}
}