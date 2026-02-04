import { addProject, getAllProjects } from './todoManager.js';

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

		addProject(projectName);
		renderProjects();
	});

	controls.appendChild(input);
	controls.appendChild(addButton);
	content.appendChild(controls);
	content.appendChild(listContainer);
}

export function renderProjects() {
	content.textContent = '';
	const projects = getAllProjects();

	projects.forEach((project) => {
		const projectElement = document.createElement('p');
		projectElement.classList.add('project-item');
		projectElement.textContent = project.getName();

		content.appendChild(projectElement);
	});
}
