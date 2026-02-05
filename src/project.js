export function createProject(name) {
	let todos = [];

	const getName = () => {
		name;
	};

	const addTodo = (todo) => {
		todos.push(todo);
	};

	const getTodos = () => {
		todos.slice();
	};

	const deleteTodo = (index) => {
		todos.splice(index, 1);
	};

	return { getName, addTodo, getTodos, deleteTodo };
}
