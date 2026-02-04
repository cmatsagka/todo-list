import {
	addProject,
	getActiveProject,
	getAllProjects,
	setActiveProject,
} from './todoManager.js';

export function setUI() {
	const content = document.querySelector('#content');

	const controls = document.createElement('div');
	controls.classList.add('controls');

	const input = document.createElement('input');
	input.placeholder = 'New Project Name';
	input.id = 'project-input';

	const addButton = document.createElement('button');
	addButton.classList.add('add-btn');
	addButton.textContent = 'Add Project';

	const listContainer = document.createElement('div');
	listContainer.id = 'project-list';

	addButton.addEventListener('click', () => {
		let projectName = input.value;

		if (projectName !== '') {
			addProject(projectName);
			input.value = '';
			renderProjects();
		}
	});

	controls.appendChild(input);
	controls.appendChild(addButton);
	content.appendChild(controls);
	content.appendChild(listContainer);
}

export function renderProjects() {
	const listContainer = document.querySelector('#project-list');
	listContainer.textContent = '';

	const projects = getAllProjects();

	projects.forEach((project) => {
		const projectElement = document.createElement('p');
		projectElement.classList.add('project-item');
		projectElement.textContent = project.getName();

		listContainer.appendChild(projectElement);

		projectElement.addEventListener('click', () => {
			setActiveProject(project.getName());
			let activeProject = getActiveProject();
			console.log('Current project is:', activeProject.getName());
		});
	});
}

export function renderTodos() {
	let activeProject = getActiveProject();

	let todos = activeProject.getTodos();

	const content = document.querySelector('#content');

	const todoContainer = document.createElement('div');
	todoContainer.classList.add('todoContainer');

	todos.forEach((todo) => {
		const todoElement = document.createElement('p');
		todoElement.classList.add('todo-item');

		todoContainer.appendChild(todo);
	});
}
