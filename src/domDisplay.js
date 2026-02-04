import { addProject, getAllProjects } from './todoManager.js';

const content = document.querySelector('#content');

export function setInitialUI(name) {
	const addButton = document.createElement('button');
	addButton.classList.add('add-btn');
	addButton.textContent = 'Add Project';

	addButton.addEventListener('click', () => {
		addProject(name);
	});

	renderProjects();
	content.appendChild(addButton);
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
