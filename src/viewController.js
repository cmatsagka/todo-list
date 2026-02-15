let viewDashBoard = 'DASHBOARD';
let viewSingleProject = 'SINGLE';

let currentView = viewDashBoard;

export function switchView(viewType, contextData) {
	const mainArea = document.querySelector('#todo-items');
	mainArea.textContent = '';

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
