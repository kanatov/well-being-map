'use strict';

class App extends Global {
	constructor(_strings) {
		super(_strings);

		/* Init Storage */
		const storageGlobal = {
			render: (_state) => { this.ui.render(_state); },
		};
		this.storage = new Storage(this.strings, storageGlobal);

		/* Init UI */
		const uiGlobal = {
			validateCategory: (_name) => { this.validateCategory(_name); },
			validateTask: (_formDataObject) => { this.validateTask(_formDataObject); },
			validateNewTaskValue: (_newValue, _taskID, _categoryID) => { this.validateNewTaskValue(_newValue, _taskID, _categoryID); },
			validateNewTaskTitle: (_taskID, _title) => { this.validateNewTaskTitle(_taskID, _title); },
			removeCategory: (_categoryID) => { this.removeCategory(_categoryID); },
			removeTask: (_taskID) => { this.removeTask(_taskID); },
			validateUsedTask: (_taskID) => { this.validateUsedTask(_taskID); },
		};
		this.ui = new UI(this.strings, uiGlobal);

		/* Render */
		this.ui.render(this.storage.state);
	}

	/* ---------------------------------------------------------------------------
	 * Validation tools
	 */
	/* Validate new category */
	validateCategory(_name) {
		/* Format the string */
		const name = _name.toLowerCase();

		/* If the name is unique */
		var unique = true;
		for (var [categoryID, category] of Object.entries(this.storage.state.categories)) {
			if (category.name == name) {
				unique = false;
				break;
			}
		}
		if (unique) {
			/* Unique name */
			const parameters = this.storage.emptyCategory;
			parameters.name = name;
			this.storage.addCategory(parameters);
		} else {
			/* Existing name */
			console.log('"' + name + '" already exist');
		}
	}

	/* Validate new task */
	validateTask(_formDataObject) {
		const newTask = this.storage.emptyTask;
		const newTaskName = _formDataObject.name.toLowerCase();
		newTask.name = newTaskName;

		for (var [key, value] of Object.entries(_formDataObject)) {
			if (key != 'name') {
				if (value != 0) {
					newTask.categories[key] = value;
				}
			}
		}

		this.storage.addTask(newTask);
	}

	/* Validate new value */
	validateNewTaskValue(_newValue, _taskID, _categoryID) {
		/* Check if task exist */
		const task = this.storage.state.tasks[_taskID];

		if (task) {
			const oldValue = task.categories[_categoryID];
			if (oldValue != _newValue) {
				task.categories[_categoryID] = _newValue;
				this.storage.changeTask(task);
			} else {
				console.log('New value is the same as the old one!');
			}
		} else {
			console.log('No such task! WEIRD! ID: ' + _taskID);
		}
	}

	removeCategory(_categoryID) {
		this.storage.removeCategory(_categoryID);
	}

	removeTask(_taskID) {
		this.storage.removeTask(_taskID);
	}

	validateNewTaskTitle(_taskID, _title) {
		/* Check if task exist */
		const task = this.storage.state.tasks[_taskID];

		if (task && _title) {
			const newTitle = _title.toLowerCase();
			if (task.name != newTitle) {
				task.name = newTitle;
				this.storage.changeTask(task);
			} else {
				console.log('New title is the same as the old one!');
			}
		} else {
			console.log('No such task! WEIRD! ID: ' + _taskID);
		}
	}

	validateUsedTask(_taskID) {
		this.storage.addHistoryEvent(_taskID);
	}


}