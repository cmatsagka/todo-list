export function renderProject() {
	const content = document.querySelector('#content');

	const project = document.createElement('p');
	project.classList.add('project');
	project.textContent = 'New project';

	content.appendChild(project);
}
