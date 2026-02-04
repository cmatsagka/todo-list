export function createProject(name) {
	let todos = [];

	const getName = () => {
		return name;
	};

	const addTodo = (todo) => {
		return todos.push(todo);
	};

	const getTodos = () => {
		return todos.slice();
	};

	return { getName, addTodo, getTodos };
}
