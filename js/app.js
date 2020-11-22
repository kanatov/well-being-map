'use strict';

class App extends Global {
	constructor(_strings) {
		super(_strings);

		/* Init Storage */
		const storageGlobal = {
			render: (_state) => { this.ui.render(_state); }
		};
		this.storage = new Storage(this.strings, storageGlobal);

		/* Init UI */
		const uiGlobal = {
			validateCategory: (_name) => { this.validateCategory(_name); },
			validateTask: (_formDataObject) => { this.validateTask(_formDataObject); }
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
		for (var category of this.storage.state.categories) {
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
}