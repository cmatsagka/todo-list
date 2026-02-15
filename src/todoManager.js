import { createProject } from './project.js';
import { load, save } from './storage.js';

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
activeProject = projects[0] || null;

let currentView = 'DASHBOARD';

export const getView = () => currentView;

export const setView = (newView) => {
	currentView = newView;
};

export const addProject = (name) => {
	if (projects.some((p) => p.getName() === name)) return;

	const newProject = createProject(name);
	projects.push(newProject);
	save(projects);
};

export const deleteProject = (projectName) => {
	projects = projects.filter((p) => p.getName() !== projectName);

	if (activeProject && activeProject.getName() === projectName) {
		activeProject = projects[0];
	}
	save(projects);
};

export const renameProject = (oldName, newName) => {
	const project = projects.find((p) => p.getName() === oldName);

	if (project) {
		project.setName(newName);
		save(projects);
		activeProject = project;
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

export const addTodoToProject = (project, todoData) => {
	project.addTodo(todoData);
	save(projects);
};

export const removeTodoFromProject = (project, index) => {
	project.deleteTodo(index);
	save(projects);
};

export const updateTodoFromProject = (project, index, newData) => {
	project.updateTodo(index, newData);
	save(projects);
};
