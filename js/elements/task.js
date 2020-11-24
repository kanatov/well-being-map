'use strict';

class Task extends Name {
	constructor(_strings) {
		super(_strings);
		this.categories = _strings.categories;
	}

	removeCategory(_categoryID) {
		if (this.categories[_categoryID]) {
			delete this.categories[_categoryID];
		}
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