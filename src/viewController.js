import { setView, getView } from './todoManager.js';

const renderers = {
	board: null,
	list: null,
};

export function registerRenderers(fns) {
	renderers.board = fns.board;
	renderers.list = fns.list;
}

export function switchView(viewType, contextData) {
	if (!viewType) return getView();
	setView(viewType);
	const wrapper = document.querySelector('.todo-wrapper');
	if (wrapper) wrapper.textContent = '';

	if (viewType === 'DASHBOARD' && renderers.board) {
		renderers.board(contextData);
	} else if (viewType === 'SINGLE' && renderers.list) {
		renderers.list(contextData);
	}

	return viewType;
}
