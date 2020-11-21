'use strict';

class App {
	constructor(_parameters) {
		this.parameters = _parameters;

		/* Init Storage */
		const storageMethods = {
			getParameters: this.getParameters.bind(this),
			render: this.render.bind(this)
		};
		this.storage = new Storage(storageMethods);

		/* Init UI */
		const uiMethods = {
			getParameters: this.getParameters.bind(this),
			addCategory: this.addCategory.bind(this)
		};
		this.ui = new UI(uiMethods);
	}

	/* Methods
	 */

	/* Read-Write state */
	get state() {
		return this.storage.state;
	}
	set state(_state) {
		this.storage.state = _state;
	}

	/* Return dom elements list */
	getParameters() {
		return this.parameters;
	}

	/* Add category */
	addCategory(_name) {
		/* If the name is unique */
		var unique = true;
		for (var category of this.state.categories) {
			if (category._name == _name) {
				unique = false;
				break;
			}
		}
		if (unique) {
			/* Unique name */
			const category = new Category(_name);

			/* Update state */
			const newState = this.state;
			newState.categories.push(category);
			this.state = newState;

		} else {
			/* Existing name */
			console.log('"' + _name + '" already exist');
		}
	}
	render() {
		console.log('Render');
		console.log(this.state);
	}
}