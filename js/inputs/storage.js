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

	/* ---------------------------------------------------------------------------
	 * Empty templates
	 */

	/* Generate empty state */
	get newID() {
		const newID = (new Date()).getTime();
		return newID;
	}
	get emptyState() {
		const emptyState = {
			categories: [],
			tasks: []
		};
		return emptyState;
	}
	get emptyCategory() {
		const emptyState = {
			id: this.newID,
			name: ''
		};
		return emptyState;
	}
	get emptyTask() {
		const emptyState = {
			id: this.newID,
			name: '',
			categories: {}
		};
		return emptyState;
	}

	/* ---------------------------------------------------------------------------
	 * New elements
	 */

	/* Create category class using parameters */
	getCategory(_parameters) {
		return new Category(_parameters);
	}

	/* Add new category */
	addCategory(_parameters) {
		const newCategory = this.getCategory(_parameters);

		/* Update state */
		const newState = this.state;
		newState.categories.push(newCategory);
		this.state = newState;
	}

	/* Create task class using parameters */
	getTask(_parameters) {
		return new Task(_parameters);
	}

	/* Add new task */
	addTask(_parameters) {
		const newTask = this.getTask(_parameters);

		/* Update state */
		const newState = this.state;
		newState.tasks.push(newTask);
		this.state = newState;
	}

	/* ---------------------------------------------------------------------------
	 * Save and Load
	 */

	/* Get storage key */
	getStorageKey(_request) {
		const storageName = this.strings.storageName;
		const key = storageName + '-' + _request;
		return key;
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

	/* Processing of loaded item */
	validateLoadedItem(_key, _state, _classification) {
		const item = this.storage.getItem(_key);
		const parsedItem = JSON.parse(item);

		if (parsedItem) {
			if (typeof parsedItem === 'object' && parsedItem !== null) {
				for (var parameters of parsedItem) {
					/* Convert objects to classes */
					const classed = _classification(parameters);
					_state.push(classed);
				}
			}
		}
	}

	/* Return state */
	get state() {
		/* Make an empty state */
		var state = this.emptyState;

		/* Try to load state */
		if (this.storage) {

			/* Load categories */
			const categoriesKey = this.getStorageKey(this.strings.storageCategories);
			this.validateLoadedItem(
				categoriesKey,
				state.categories,
				(_parameters) => { return this.getCategory(_parameters); }
			);

			/* Load tasks */
			const tasksKey = this.getStorageKey(this.strings.storageTasks);
			this.validateLoadedItem(
				tasksKey,
				state.tasks,
				(_parameters) => { return this.getTask(_parameters); }
			);
		}
		return state;
	}

	set state(_state) {
		if (this.storage) {

			/* Save categories */
			const categories = this.getSerialisedArray(_state.categories);
			const categoriesKey = this.getStorageKey(this.strings.storageCategories);
			this.storage.setItem(categoriesKey, JSON.stringify(categories));

			/* Save tasks */
			const tasks = this.getSerialisedArray(_state.tasks);
			const tasksKey = this.getStorageKey(this.strings.storageTasks);
			this.storage.setItem(tasksKey, JSON.stringify(tasks));

			/* Refresh page */
			this.global.render(this.state);
		}
	}
}