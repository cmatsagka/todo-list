import { getAllProjects } from './todoManager.js';

export function renderProjects() {
	const content = document.querySelector('#content');

	content.textContent = '';
	const projects = getAllProjects();

	projects.forEach((project) => {
		const projectElement = document.createElement('p');
		projectElement.classList.add('project-item');
		projectElement.textContent = project.getName();

		content.appendChild(projectElement);
	});
}
