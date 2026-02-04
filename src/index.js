import './styles.css';
import { createTodo } from './todo.js';
import { createProject } from './project.js';
import { todoManager } from './todoManager.js';

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

let myProject = createProject('Home');
myProject.addTodo(todo1);
myProject.addTodo(todo2);

console.log(myProject.getTodos());
