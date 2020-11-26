'use strict';

class Category extends Name {
	constructor(_strings) {
		super(_strings);
	}

	get serialisedObject() {
		const objectSuper = super.serialisedObject;
		const objectThis = {};

		let object = {
			...objectSuper,
			...objectThis
		}

		return object;
	}
}