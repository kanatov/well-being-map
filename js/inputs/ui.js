'use strict';

class UI extends Global {
	constructor(_strings, _global) {
		super(_strings, _global);

		/* Reset */
		this.addListener(
			this.strings.reset,
			'click',
			() => { this.reset(); }
		);

		/* Listen to 'New category' form submit */
		this.addListener(
			this.strings.addCategoryForm,
			'submit',
			(_e) => { this.processCategoryForm(_e); }
		);

		/* Listen to 'New task' form submit */
		this.addListener(
			this.strings.addTaskForm,
			'submit',
			(_e) => { this.processTaskForm(_e); }
		);
	}

	/* ---------------------------------------------------------------------------
	 * Events
	 */

	/* Reset */
	reset() {
		localStorage.clear();
		location.reload();
	}

	/* Add cutom event listener tool */
	addListener(_id, _event, _method) {
		var element;
		if (typeof _id == 'string') {
			element = document.getElementById(_id);
		} else {
			element = _id;
		}
		element.addEventListener(_event, _method);
	}

	/* Process 'New category' form submit */
	processCategoryForm(_e) {
		_e.preventDefault();

		const formData = new FormData(_e.target);
		for (var [key, name] of formData.entries()) {
			this.global.validateCategory(name);
		}

		_e.target.reset();
	}

	/* Process 'New task' form submit */
	processTaskForm(_e) {
		_e.preventDefault();

		const formData = new FormData(_e.target);
		const formDataObject = {};
		for (var [key, value] of formData.entries()) {
			formDataObject[key] = value
		}
		this.global.validateTask(formDataObject);

		_e.target.reset();
	}

	/* Editing task title */
	editTaskTitle(_e) {
		_e.preventDefault();
		const title = _e.target.innerHTML;
		const newTitle = window.prompt("Enter new title", title);
		const taskID = _e.target.getAttribute(this.strings.taskID);
		this.global.validateNewTaskTitle(taskID, newTitle);
	}

	/* Editing task values */
	taskValueEdit(_e) {
		_e.preventDefault();
		const value = _e.target.innerHTML;
		const newValue = Number(window.prompt("Enter new value", value));
		const isNumber = /^\d+$/.test(newValue);
		if (isNumber) {
			const newValueString = newValue.toString();
			const taskID = _e.target.getAttribute(this.strings.taskID);
			const categoryID = _e.target.getAttribute(this.strings.categoryID);
			this.global.validateNewTaskValue(newValueString, taskID, categoryID);
		} else {
			console.log('Entered value is not a number');
		}
	}

	/* Removing category */
	removeCategory(_e) {
		_e.preventDefault();
		const id = _e.target.getAttribute(this.strings.categoryID);
		this.global.removeCategory(id);
	}

	/* Removing task */
	removeTask(_e) {
		_e.preventDefault();
		const id = _e.target.getAttribute(this.strings.taskID);
		this.global.removeTask(id);
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

		/* Remove category */
		const remove = template.querySelector('.' + this.strings.templateRemove);
		remove.setAttribute(this.strings.categoryID, _category.id);

		this.addListener(
			remove,
			'click',
			(_e) => { this.removeCategory(_e); }
		);

		return template;
	}

	getDomTask(_task) {
		const templateId = this.strings.templateTask;
		const template = this.getCloneById(templateId);

		/* Title */
		const titleDom = template.querySelector('.' + this.strings.templateTitle);
		titleDom.innerHTML = _task.name;

		/* Edit title */
		titleDom.setAttribute(this.strings.taskID, _task.id);

		this.addListener(
			titleDom,
			'click',
			(_e) => { this.editTaskTitle(_e); }
		);

		/* Remove task */
		const remove = template.querySelector('.' + this.strings.templateRemove);
		remove.setAttribute(this.strings.taskID, _task.id);

		this.addListener(
			remove,
			'click',
			(_e) => { this.removeTask(_e); }
		);

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

		/* Title */
		const titleDom = template.querySelector('.' + this.strings.templateTitle);
		titleDom.innerHTML = _category.name;

		/* Value */
		const valueDom = template.querySelector('.' + this.strings.templateValue);
		valueDom.setAttribute(this.strings.taskID, _task.id);
		valueDom.setAttribute(this.strings.categoryID, _category.id);
		const taskCategoryValue = _task.categories[_category.id];
		const value = taskCategoryValue ? taskCategoryValue : 0;
		valueDom.innerHTML = value;

		/* Edit value */
		this.addListener(
			valueDom,
			'click',
			(_e) => { this.taskValueEdit(_e); }
		);

		return template;
	}

	/* ---------------------------------------------------------------------------
	 * Render
	 */

	renderCategories(_state) {
		/* Clean categories */
		const emptyCategories = this.cleanInnerHTML(this.strings.categories);

		/* Render categories */
		for (var [key, category] of Object.entries(_state.categories)) {
			const dom = this.getDomCategory(category, category.id);

			/* Add dom element to parent */
			emptyCategories.appendChild(dom);
		}
		if (!emptyCategories.childNodes.length) {
			emptyCategories.innerHTML = '<h2>No categories yet, please add some.</h2>';
		}
	}

	renderNewTaskForm(_state) {
		/* Clean 'New task' form categories */
		const emptyTaskFormCategories = this.cleanInnerHTML(
			this.strings.addTaskForm,
			this.strings.addTaskFormCategories
		);

		/* Render 'New task' form categories */
		for (var [key, category] of Object.entries(_state.categories)) {
			const dom = this.getDomAddTaskCategory(category);
			emptyTaskFormCategories.appendChild(dom);
		}
		if (!emptyTaskFormCategories.childNodes.length) {
			emptyTaskFormCategories.innerHTML = 'No categories';
		}
	}

	renderTasks(_state) {
		/* Clean tasks */
		const emptyTasks = this.cleanInnerHTML(this.strings.tasks);

		/* Render tasks */
		for (var [key, task] of Object.entries(_state.tasks)) {
			const dom = this.getDomTask(task);
			const domCategories = dom.querySelector('.task-categories');

			for (var [key, category] of Object.entries(_state.categories)) {
				const domCategory = this.getDomTaskCategory(category, task);
				domCategories.appendChild(domCategory);
			}
			emptyTasks.appendChild(dom);
		}
	}

	render(_state) {
		this.renderCategories(_state);
		this.renderNewTaskForm(_state);
		this.renderTasks(_state);
	}
}