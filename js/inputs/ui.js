'use strict';

class UI extends Global {
	constructor(_global) {
		super(_global);
	}

	init() {
		/* Listen 'New category' UI form */
		/*
		this.addListener(
			this.strings.addCategoryForm,
			'submit',
			this.processNewCategoryForm.bind(this)
		);
		*/
		const element = document.getElementById(this.strings.addCategoryForm);
		element.addEventListener('submit', (e) => { this.processNewCategoryForm(e); });
	}

	/* Process 'New category' form response */
	processNewCategoryForm(e) {
		e.preventDefault();

		const formData = new FormData(e.target);
		for (var [key, value] of formData.entries()) {
			/* closure fuckup */
			this.global.addCategory(value);
		}
	}

	/* Add a custom listener */
	addListener(_id, _event, _method) {
		const element = document.getElementById(_id);
		element.addEventListener(_event, _method);
	}
	getCloneById(_id) {
		const templateDom = document.getElementById(_id);
		const cloneDom = templateDom.cloneNode(true);
		return cloneDom;
	}
	getDomCategory(_category) {
		const templateId = this.strings.templateCategory;
		const template = this.getCloneById(templateId);
		const title = template.querySelector('.category-title');
		title.innerHTML = _category.name;
		return template;
	}
	render() {
		/* Clean categories */
		const categoriesContainerId = this.strings.categories;
		const categoriesContainer = document.getElementById(categoriesContainerId);
		categoriesContainer.innerHTML = '';

		for (var category of this.global.state.categories) {
			const domCategory = this.getDomCategory(category);
			categoriesContainer.appendChild(domCategory);
		}
	}
}