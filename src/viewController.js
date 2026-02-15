import { createBoard, createList } from './domDisplay.js';

let viewDashBoard = 'DASHBOARD';
let viewSingleProject = 'SINGLE';

let currentView = viewDashBoard;

export function switchView(viewType, contextData) {
	const wrapper = document.querySelector('.todo-wrapper');
	wrapper.textContent = '';

	switch (viewType) {
		case viewDashBoard:
			createBoard(contextData);
			break;
		case viewSingleProject:
			createList(contextData);
	}
	currentView = viewType;

	return currentView;
}
