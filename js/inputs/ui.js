'use strict';

class UI extends Global {
	constructor(_strings, _global) {
		super(_strings, _global);

		const element = document.getElementById(this.strings.addCategoryForm);
		element.addEventListener('submit', (e) => { this.processNewCategoryForm(e); });
	}

	/* Listen 'New category' UI form */
	// this.addListener(
	// 	this.strings.addCategoryForm,
	// 	'submit',
	// 	this.processNewCategoryForm.bind(this)
	// );

	/* Process 'New category' form response */
	processNewCategoryForm(e) {
		e.preventDefault();

		const formData = new FormData(e.target);

		for (var [key, name] of formData.entries()) {
			this.global.validateCategory(name);
			e.target.reset();
		}
	}

	/* Add a custom listener */
	addListener(_id, _event, _method) {
		const element = document.getElementById(_id);
		element.addEventListener(_event, _method);
	}

	/* ---------------------------------------------------------------------------
	 * Dom tools
	 */
	getCloneById(_id) {
		const templateDom = document.getElementById(_id);
		const cloneDom = templateDom.cloneNode(true);
		return cloneDom;
	}

	getDomCategory(_category, _categoryID) {
		const templateId = this.strings.templateCategory;
		const template = this.getCloneById(templateId);
		template.setAttribute("id", 'category-' + _categoryID);

		/* Title */
		const titleDom = template.querySelector('.' + this.strings.templateCategoryTitle);
		titleDom.innerHTML = _category.name;

		return template;
	}

	getDomAddTaskCategory(_category, _categoryID) {
		const templateId = this.strings.addTaskFormCategory;
		const template = this.getCloneById(templateId);
		template.removeAttribute("id");

		/* Label */
		const labelDom = template.querySelector('label');
		labelDom.setAttribute("for", 'category-' + _categoryID);
		labelDom.innerHTML = _category.name;

		/* Input */
		const inputDom = template.querySelector('input');
		inputDom.setAttribute("name", 'category-' + _categoryID);

		return template;
	}

	cleanInnerHTML(_id, _class) {
		var dom = document.getElementById(_id);
		if (_class) {
			const newDom = dom.querySelector('.' + _class);
			dom = newDom;
		}
		dom.innerHTML = '';
		return dom;
	}

	/* ---------------------------------------------------------------------------
	 * Render
	 */
	render(_state) {
		/* Clean categories */
		const emptyCategories = this.cleanInnerHTML(this.strings.categories);

		/* Render categories */
		for (var category of _state.categories) {
			const dom = this.getDomCategory(category, category.id);
			emptyCategories.appendChild(dom);
		}

		/* Clean 'New task' form categories */
		const emptyTaskFromCategories = this.cleanInnerHTML(this.strings.addTaskForm, this.strings.addTaskFormCategories);

		/* Render 'New task' form categories */
		for (var category of _state.categories) {
			const dom = this.getDomAddTaskCategory(category, category.id);
			emptyTaskFromCategories.appendChild(dom);
		}

	}
}