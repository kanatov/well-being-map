'use strict';

class Storage extends Global {
	constructor(_strings, _global) {
		super(_strings, _global);

		/* Wipe cache */
		this.wipeCache();

		/* Init storage */
		this.storage = null;
		if (Storage) {
			this.storage = window.localStorage;
		}
	}

	/* ---------------------------------------------------------------------------
	 * Empty templates
	 */

	get timestamp() {
		const now = new Date();
		const timestamp = {
			utc: now.getTime(),
			timezoneOffset: now.getTimezoneOffset()
		}
		return timestamp;
	}
	/* Generate empty state */
	get newID() {
		const newID = this.timestamp.utc;
		return newID;
	}
	get emptyState() {
		const empty = {
			categories: {},
			tasks: {},
			historyEvents: {}
		};
		return empty;
	}
	get emptyCategory() {
		const empty = {
			id: this.newID,
			name: ''
		};
		return empty;
	}
	get emptyTask() {
		const empty = {
			id: this.newID,
			name: '',
			categories: {},
			historyEvents: {},
		};
		return empty;
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
		newState.categories[newCategory.id] = newCategory;
		this.state = newState;
	}

	/* Create task class using parameters */
	getTask(_parameters) {
		// TODO: compare parameters with empty
		return new Task(_parameters);
	}

	/* Add new task */
	addTask(_parameters) {
		const newTask = this.getTask(_parameters);

		/* Update state */
		const newState = this.state;
		newState.tasks[newTask.id] = newTask;
		this.state = newState;
	}

	/* Add new history event */
	addHistoryEvent(_taskID) {
		const newState = this.state;
		newState.tasks[_taskID].use();
		this.state = newState;
	}



	/* ---------------------------------------------------------------------------
	 * Change state
	 */

	/* Remove category */
	removeCategory(_categoryID) {
		/* Delete category from categories */
		const newState = this.state;
		delete newState.categories[_categoryID];

		/* Delete category from tasks */
		for (var [taskID, task] of Object.entries(newState.tasks)) {
			task.removeCategory(_categoryID);
		}

		/* Update state */
		this.state = newState;
	}

	/* Remove task */
	removeTask(_taskID) {
		const newState = this.state;
		delete newState.tasks[_taskID];
		this.state = newState;
	}

	/* Use task */
	useTask(_taskID) {
		// const newState = this.state;
		// newState.tasks[_taskID];
	}

	/* Save modified task */
	changeTask(_task) {
		const newState = this.state; // ⚠️ does it makes sence?
		newState.tasks[_task.id] = _task;
		this.state = newState;
	}

	/* Remove task */
	removeHistoryEvent(_timestampUTC) {
		const newState = this.state;
		const taskID = newState.historyEvents[_timestampUTC].taskID;
		delete newState.tasks[taskID].historyEvents[_timestampUTC];
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

		for (var [key, classObject] of Object.entries(_classesArray)) {
			const serialisedObject = classObject.serialisedObject;
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
					_state[classed.id] = classed;
				}
			}
		}
	}

	/* Sort object keys */
	sortObject(_object) {
		const sortedObject = {};
		Object.keys(_object).sort().forEach(function (key) {
			sortedObject[key] = _object[key];
		});
		return sortedObject;
	}

	/* Return state */
	get state() {
		/* Make an empty state */
		var state = this.emptyState;

		if (this.cached) {
			state = this.cached;

		} else if (this.storage) {
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

			/* Make history events list */
			for (var [key, task] of Object.entries(state.tasks)) {
				for (var [timestampUTC, timezoneOffset] of Object.entries(task.historyEvents)) {
					state.historyEvents[timestampUTC] = {
						timestampUTC: timestampUTC,
						timezoneOffset: timezoneOffset,
						taskID: task.id
					};
				}
			}
			state.historyEvents = this.sortObject(state.historyEvents);
			console.log('State: ', state);
			return state;
		}
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

			/* Reset cache */
			this.wipeCache();

			/* Refresh page */
			this.global.render(this.state);
		}
	}

	/* Is state should be read from cache or not */
	wipeCache() {
		this.cached = null;
	}
}