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

	addButton.addEventListener('click', () => {
		let name = input.textContent;
		addProject(name);
		renderProjects();
	});

	controls.appendChild(input);
	controls.appendChild(addButton);
	content.appendChild(controls);
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
