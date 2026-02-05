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

	const project = localStorage.getItem(key);

	if (!project) {
		return null;
	}

	const data = JSON.parse(project);
	return data;
}
