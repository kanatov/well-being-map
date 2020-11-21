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
		if (!this.categories) {
			this.categories = [];
		}
		this.categories.push(_name)
		console.log(this.categories);
	}
}