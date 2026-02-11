import './styles.css';
import {
	renderProjects,
	renderTodos,
	setUI,
	setupFocusMode,
	setupAddTodoButton,
} from './domDisplay.js';
import { loadDemoStory } from './demo.js';
import { getAllProjects } from './todoManager.js';

function init() {
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
	renderTodos();
}

init();
