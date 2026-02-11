export function createProject(name) {
	let todos = [];

	const getName = () => {
		return name;
	};

	const setName = (newName) => {
		name = newName;
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

	const updateTodo = (index, newData) => {
		todos[index] = newData;
	};

	return { getName, setName, addTodo, getTodos, deleteTodo, updateTodo };
}
