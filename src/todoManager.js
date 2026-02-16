import { createProject } from './project.js';
import { load, save } from './storage.js';

let projects = load() || [];

if (projects.length === 0) {
	const defaultProject = createProject('General');
	projects.push(defaultProject);
	save(projects);
}

let activeProject = projects[0];

let currentView = 'DASHBOARD';

export const getView = () => currentView;

export const setView = (newView) => {
	currentView = newView;
};

export const clearCompletedTasks = (projectToClear) => {
	const target = projectToClear || getActiveProject();
	if (!target) return;

	const targetName =
		typeof target.getName === 'function' ? target.getName() : target.name;

	const liveProject = projects.find((p) => {
		const pName = typeof p.getName === 'function' ? p.getName() : p.name;
		return pName === targetName;
	});

	if (liveProject) {
		const todos =
			typeof liveProject.getTodos === 'function'
				? liveProject.getTodos()
				: liveProject.todos;

		const activeTasks = todos.filter((t) => !t.completed);

		if (typeof liveProject.setTodos === 'function') {
			liveProject.setTodos(activeTasks);
		} else {
			liveProject.todos = activeTasks;
		}

		save(projects);
	}
};

export const addProject = (name) => {
	if (projects.some((p) => p.getName() === name)) return;

	const newProject = createProject(name);
	projects.push(newProject);
	save(projects);
};

export const deleteProject = (projectName) => {
	projects = projects.filter((p) => p.getName() !== projectName);

	if (projects.length === 0) {
		const defaultProject = createProject('General');
		projects.push(defaultProject);
	}
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
