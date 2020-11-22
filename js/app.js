'use strict';

class App extends Global {
	constructor(_strings) {
		super(_strings);
		/* Init
		 */
		/* Init Storage */
		const storageGlobal = {
			render: (_state) => { this.ui.render(_state); }
		};
		this.storage = new Storage(this.strings, storageGlobal);

		/* Init UI */
		const uiGlobal = {
			validateCategory: (_name) => { this.validateCategory(_name); }
		};
		this.ui = new UI(this.strings, uiGlobal);

		/* Render */
		this.ui.render(this.storage.state);
	}

	/* Add category */
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
			const parameters = {
				id: (new Date()).getTime(),
				name: name
			};
			this.storage.addCategory(parameters);
		} else {
			/* Existing name */
			console.log('"' + name + '" already exist');
		}
	}
}