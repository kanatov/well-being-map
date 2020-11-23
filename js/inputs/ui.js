'use strict';

class UI extends Global {
	constructor(_strings, _global) {
		super(_strings, _global);

		/* Listen to 'New category' form submit */
		this.addListener(
			this.strings.addCategoryForm,
			'submit',
			(e) => { this.processCategoryForm(e); }
		);

		/* Listen to 'New task' form submit */
		this.addListener(
			this.strings.addTaskForm,
			'submit',
			(e) => { this.processTaskForm(e); }
		);
	}

	/* ---------------------------------------------------------------------------
	 * Events
	 */

	/* Add cutom event listener tool */
	addListener(_id, _event, _method) {
		const element = document.getElementById(_id);
		element.addEventListener(_event, _method);
	}

	/* Process 'New category' form submit */
	processCategoryForm(e) {
		e.preventDefault();

		const formData = new FormData(e.target);
		for (var [key, name] of formData.entries()) {
			this.global.validateCategory(name);
		}

		e.target.reset();
	}

	/* Process 'New task' form submit */
	processTaskForm(e) {
		e.preventDefault();

		const formData = new FormData(e.target);
		const formDataObject = {};
		for (var [key, value] of formData.entries()) {
			formDataObject[key] = value
		}
		this.global.validateTask(formDataObject);

		e.target.reset();
	}


	/* ---------------------------------------------------------------------------
	 * Dom tools
	 */
	cleanInnerHTML(_id, _class) {
		var dom = document.getElementById(_id);
		if (_class) {
			const newDom = dom.querySelector('.' + _class);
			dom = newDom;
		}
		dom.innerHTML = '';
		return dom;
	}

	getCloneById(_id) {
		const templateDom = document.getElementById(_id);
		const cloneDom = templateDom.cloneNode(true);
		cloneDom.removeAttribute("id");
		return cloneDom;
	}

	getDomCategory(_category) {
		const templateId = this.strings.templateCategory;
		const template = this.getCloneById(templateId);
		template.setAttribute(this.strings.categoryID, _category.id);

		/* Title */
		const titleDom = template.querySelector('.' + this.strings.templateTitle);
		titleDom.innerHTML = _category.name;

		return template;
	}

	getDomTask(_task) {
		const templateId = this.strings.templateTask;
		const template = this.getCloneById(templateId);

		/* Title */
		const titleDom = template.querySelector('.' + this.strings.templateTitle);
		titleDom.innerHTML = _task.name;
		return template;
	}

	getDomAddTaskCategory(_category) {
		const templateId = this.strings.templateAddTaskFormCategory;
		const template = this.getCloneById(templateId);

		/* Label */
		const labelDom = template.querySelector('label');
		labelDom.setAttribute("for", _category.id);
		labelDom.innerHTML = _category.name;

		/* Input */
		const inputDom = template.querySelector('input');
		inputDom.setAttribute("name", _category.id);

		return template;
	}

	getDomTaskCategory(_category, _task) {
		const templateId = this.strings.templateTaskCategory;
		const template = this.getCloneById(templateId);
		template.setAttribute(this.strings.categoryID, _category.id);

		/* Title */
		const titleDom = template.querySelector('.' + this.strings.templateTitle);
		titleDom.innerHTML = _category.name;

		/* Value */
		const valueDom = template.querySelector('.' + this.strings.templateValue);
		const taskCategoryValue = _task.categories[_category.id];
		const value = taskCategoryValue ? taskCategoryValue : 0;
		valueDom.innerHTML = value;

		return template;
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
		if (!emptyCategories.childNodes.length) {
			emptyCategories.innerHTML = '<b>No categories yet, please addsome</b>';
		}

		/* Clean 'New task' form categories */
		const emptyTaskFormCategories = this.cleanInnerHTML(
			this.strings.addTaskForm,
			this.strings.addTaskFormCategories
		);

		/* Render 'New task' form categories */
		for (var category of _state.categories) {
			const dom = this.getDomAddTaskCategory(category);
			emptyTaskFormCategories.appendChild(dom);
		}
		if (!emptyTaskFormCategories.childNodes.length) {
			emptyTaskFormCategories.innerHTML = 'No categories';
		}

		/* Clean tasks */
		const emptyTasks = this.cleanInnerHTML(this.strings.tasks);

		/* Render tasks */
		for (var task of _state.tasks) {
			const dom = this.getDomTask(task);
			const domCategories = dom.querySelector('.task-categories');

			for (var category of _state.categories) {
				const category2 = this.getDomTaskCategory(category, task);
				domCategories.appendChild(category2);
			}

			emptyTasks.appendChild(dom);
		}
	}
}