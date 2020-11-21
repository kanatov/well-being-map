'use strict';

class Storage {
	constructor(_methods) {
		this.methods = _methods;

		/* Init storage */
		this.storage = null;
		if (Storage) {
			this.storage = window.localStorage;
		}
	}

	/* Generate empty state */
	getEmptyState() {
		const emptyState = {
			categories: []
		};
		return emptyState;
	}

	/* Return state */
	get state() {
		/* Make an empty state */
		var state = this.getEmptyState();

		/* Try to load state */
		if (this.storage) {
			const storageName = this.methods.getParameters().storageName;
			const getResult = this.storage.getItem(storageName);
			const loadState = JSON.parse(getResult);

			if (loadState) {
				if (typeof loadState === 'object' && loadState !== null) {
					state = loadState;
				}
			}
		}
		return state;
	}

	set state(_state) {
		if (this.storage) {
			/* Save state */
			const storageName = this.methods.getParameters().storageName;
			this.storage.setItem(storageName, JSON.stringify(_state));

			/* Refresh page */
			this.methods.render();
		}
	}
}