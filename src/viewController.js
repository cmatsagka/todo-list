import { setView, getView } from './todoManager.js';

const renderers = {
	DASHBOARD: null,
	SINGLE: null,
};

export function registerRenderers(fns) {
	renderers.DASHBOARD = fns.board;
	renderers.SINGLE = fns.list;
}

export function switchView(viewType, contextData) {
	if (!viewType) return getView();
	setView(viewType);
	const wrapper = document.querySelector('.todo-wrapper');
	if (wrapper) wrapper.textContent = '';

	if (viewType === 'DASHBOARD' && renderers.DASHBOARD) {
		renderers.DASHBOARD(contextData);
	} else if (viewType === 'SINGLE' && renderers.SINGLE) {
		renderers.SINGLE(contextData);
	}

	return viewType;
}
