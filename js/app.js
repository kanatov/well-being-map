'use strict';

class App extends Global {
	constructor(_strings) {
		super(_strings);

		/* Init Storage */
		this.storage = new Storage(this.strings);

		/* Init UI */
		this.ui = new UI(this.strings);

		/* Update global */
		const uiGlobalUpdate = {
			addCategory: this.addCategory.bind(this),
			state: this.storage.state
		};
		this.ui.updateGlobal(uiGlobalUpdate);

		const storageGlobalUpdate = {
			render: this.ui.render.bind(this)
		};
		this.storage.updateGlobal(storageGlobalUpdate);

		/* Init */
		this.ui.init();

		/* Render */
		this.ui.render();
	}

	/* Add category */
	addCategory(_name) {
		/* If the name is unique */
		var unique = true;
		for (var category of this.storage.state.categories) {
			if (category._name == _name) {
				unique = false;
				break;
			}
		}
		// if (unique) {
		if (true) {
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