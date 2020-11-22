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
			validateCategory: (_name) => { this.validateCategory(_name); }
		};
		this.ui = new UI(this.strings, uiGlobal);

		/* Render */
		this.ui.render(this.storage.state);
	}

	/* Add category */
	validateCategory(_name) {
		/* If the name is unique */
		var unique = true;
		for (var category of this.storage.state.categories) {
			if (category._name == _name) {
				unique = false;
				break;
			}
		}
		if (unique) {
			/* Unique name */
			const strings = {
				id: (new Date()).getTime(),
				name: _name
			};
			this.storage.addCategory(strings);
		} else {
			/* Existing name */
			console.log('"' + _name + '" already exist');
		}
	}
}