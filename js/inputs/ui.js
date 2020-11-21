'use strict';

class UI {
	constructor(_methods) {
		this.methods = _methods;

		/* Listen 'New category' UI form */
		this.addListener(
			this.methods.getDom().addCategoryForm,
			'submit',
			this.processNewCategoryForm.bind(this)
		);
	}

	/* Process 'New category' form response */
	processNewCategoryForm(e) {
		e.preventDefault();

		const formData = new FormData(e.target);
		for (var [key, value] of formData.entries()) {
			this.methods.addCategory(value);
		}
	}

	/* Add a custom listener */
	addListener(_id, _event, _method) {
		const element = document.getElementById(_id);
		element.addEventListener(_event, _method);
	}
}