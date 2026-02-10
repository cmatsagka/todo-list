export function createProject(name) {
	let todos = [];

	const getName = () => {
		return name;
	};

	const addTodo = (todo) => {
		todos.push(todo);
	};

	const getTodos = () => {
		return todos.slice();
	};

	const deleteTodo = (index) => {
		todos.splice(index, 1);
	};

	const updateTodo = (index) => {
		todos[index] = newData;
	};

	return { getName, addTodo, getTodos, deleteTodo, updateTodo };
}
