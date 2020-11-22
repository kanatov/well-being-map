'use strict';

class Storage extends Global {
	constructor(_strings, _global) {
		super(_strings, _global);

		/* Init storage */
		this.storage = null;
		if (Storage) {
			this.storage = window.localStorage;
		}
	}

	get keyCategories() {
		const storageName = this.strings.storageName;
		const categoriesName = this.strings.categoriesName;

		const name = storageName + '-' + categoriesName;
		return name;
	}

	/* Generate empty state */
	get emptyState() {
		const emptyState = {
			categories: []
		};
		return emptyState;
	}

	/* Create category class using parameters */
	getCategory(_parameters) {
		return new Category(_parameters);
	}

	/* Add new category */
	addCategory(_parameters) {
		const category = this.getCategory(_parameters);

		/* Update state */
		const newState = this.state;
		newState.categories.push(category);
		this.state = newState;
	}

	/* Prepare array to saving */
	getSerialisedArray(_classesArray) {
		const array = [];

		for (var classObject of _classesArray) {
			const serialisedObject = classObject.getSerialisedObject();
			array.push(serialisedObject);
		}

		return array;
	}

	/* Return state */
	get state() {
		/* Make an empty state */
		var state = this.emptyState;

		/* Try to load state */
		if (this.storage) {
			/* Load categories */
			const getResult = this.storage.getItem(this.keyCategories);
			const loadState = JSON.parse(getResult);

			/* Validation */
			if (loadState) {
				if (typeof loadState === 'object' && loadState !== null) {
					for (var category of loadState) {
						/* Convert objects to classes */
						const categoryClass = this.getCategory(category);
						state.categories.push(categoryClass);
					}
				}
			}
		}
		return state;
	}

	set state(_state) {
		if (this.storage) {

			/* Save categories */
			const categories = this.getSerialisedArray(_state.categories);
			this.storage.setItem(this.keyCategories, JSON.stringify(categories));

			/* Refresh page */
			this.global.render(this.state);
		}
	}
}