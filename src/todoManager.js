import { createProject } from './project.js';
import { load } from './storage.js';

let projects = [];
let activeProject;

const rawData = load();

if (!rawData) {
	const defaultProject = createProject('General');
	projects.push(defaultProject);
} else {
	rawData.forEach((projectData) => {
		let newProject = createProject(projectData.name);

		const todos = projectData.todos;

		todos.forEach((todo) => {
			newProject.addTodo(todo);
		});
		projects.push(newProject);
	});
}
activeProject = projects[0];

export const addProject = (name) => {
	if (projects.some((p) => p.getName() === name)) return;

	const newProject = createProject(name);
	projects.push(newProject);
};

export const deleteProject = (projectName) => {
	projects = projects.filter((p) => p.getName() !== projectName);

	if (activeProject.getName() === projectName) {
		activeProject = defaultProject;
	}
};

export const getAllProjects = () => [...projects];

export const setActiveProject = (projectName) => {
	const foundProject = projects.find((p) => p.getName() === projectName);

	if (foundProject) {
		activeProject = foundProject;
	}
};

export const getActiveProject = () => activeProject;
