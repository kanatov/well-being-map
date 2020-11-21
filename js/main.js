'use strict';

class App {
	constructor(_dom) {
		this.dom = _dom;
		this.hello = 'hello';

		/* Init UI */
		const UImethods = {
			getDom: this.getDom.bind(this),
			addCategory: this.addCategory.bind(this)
		};
		this.ui = new UI(UImethods);
	}
	/* Methods
	 */

	/* Return dom elements list */
	getDom() {
		return this.dom;
	}

	/* Add category */
	addCategory(_name) {
		/* If categories not yet created */
		if (!this.categories) {
			this.categories = [];
		}

		/* If the name is unique */
		var unique = true;
		for (var category of this.categories) {
			if (category.name == _name) {
				unique = false;
				break;
			}
		}
		if (unique) {
			/* Unique name */
			const category = new Category(_name);
			this.categories.push(category);
		} else {
			/* Existing name */
			console.log('"' + _name + '" already exist');
		}
		console.log(this.categories);
	}
}