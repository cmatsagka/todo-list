import { addProject, getAllProjects } from './todoManager.js';

export function setInitialUI(name) {
	const content = document.querySelector('#content');

	const addContainer = document.createElement('div');
	addContainer.classList.add('add-container');

	const input = document.createElement('input');
	input.placeholder = 'New Project Name';
	input.id = 'project-input';

	const addButton = document.createElement('button');
	addButton.classList.add('add-btn');
	addButton.textContent = 'Add Project';

	addButton.addEventListener('click', () => {
		addProject(name);
		renderProjects();
	});

	addContainer.appendChild(input);
	addContainer.appendChild(addButton);
	content.appendChild(addContainer);
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
