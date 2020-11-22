'use strict';

class Category extends Name {
	constructor(_strings) {
		super(_strings);
	}

	getSerialisedObject() {
		const objectSuper = super.getSerialisedObject();
		const objectThis = {};

		let object = {
			...objectSuper,
			...objectThis
		}

		return object;
	}
}