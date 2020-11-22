'use strict';

class Task extends Name {
	constructor(_strings) {
		super(_strings);
		this.categories = _strings.categories;
	}

	getSerialisedObject() {
		const objectSuper = super.getSerialisedObject();
		const objectThis = {
			categories: this.categories
		};
		let object = {
			...objectSuper,
			...objectThis
		}

		return object;
	}
}