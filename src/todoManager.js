import { createProject } from './project.js';

let projects = [];

const defaultProject = createProject('General');
projects.push(defaultProject);

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

let activeProject = defaultProject;

export const setActiveProject = (projectName) => {
	const foundProject = projects.find((p) => p.getName() === projectName);

	if (foundProject) {
		activeProject = foundProject;
	}
};

export const getActiveProject = () => activeProject;
