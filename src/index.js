import './styles.css';
import { createTodo } from './todo.js';

const todo1 = createTodo(
	'say hi',
	'say hi after making todo',
	'6/2/2025',
	'medium'
);
const todo2 = createTodo(
	'say thanks',
	'say thanks after hearing something nice',
	'8/2/2025',
	'high'
);

console.log(todo1);
console.log(todo2);
