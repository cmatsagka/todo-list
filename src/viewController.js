import { createBoard, createList } from './domDisplay.js';

let currentView = 'DASHBOARD';

export function switchView(viewType, contextData) {
	currentView = viewType;
	const wrapper = document.querySelector('.todo-wrapper');
	wrapper.textContent = '';

	switch (viewType) {
		case 'DASHBOARD':
			createBoard(contextData);
			break;
		case 'SINGLE':
			createList(contextData);
	}
}
