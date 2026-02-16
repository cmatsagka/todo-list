import { createProject } from './project.js';
import { createTodo } from './todo.js';

export function save(projects) {
	const data = projects.map((project) => {
		return { name: project.getName(), todos: project.getTodos() };
	});

	const project = JSON.stringify(data);
	const key = 'todo_app_data';
	localStorage.setItem(key, project);
}

export function load() {
	const key = 'todo_app_data';

	const rawJSON = localStorage.getItem(key);
	if (!rawJSON) return null;

	const rawData = JSON.parse(rawJSON);

	return rawData.map((projectData) => {
		const project = createProject(projectData.name);

		projectData.todos.forEach((todoData) => {
			const todo = createTodo(
				todoData.title,
				todoData.description,
				todoData.dueDate,
				todoData.priority,
				todoData.completed
			);

			project.addTodo(todo);
		});
		return project;
	});
}
