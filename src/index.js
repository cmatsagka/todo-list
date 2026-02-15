import './styles.css';
import {
	createBoard,
	createList,
	renderProjects,
	setUI,
	setupFocusMode,
	setupAddTodoButton,
} from './domDisplay.js';
import { loadDemoStory } from './demo.js';
import { getAllProjects } from './todoManager.js';
import { registerRenderers, switchView } from './viewController.js';

function init() {
	registerRenderers({
		board: createBoard,
		list: createList,
	});
	setUI();
	setupAddTodoButton();
	setupFocusMode();

	const existingProjects = getAllProjects();

	const totalTodos = existingProjects.reduce(
		(acc, p) => acc + p.getTodos().length,
		0
	);

	if (existingProjects.length <= 1 && totalTodos === 0) {
		loadDemoStory();
	}
	renderProjects();
	switchView('DASHBOARD', getAllProjects());
}

init();
