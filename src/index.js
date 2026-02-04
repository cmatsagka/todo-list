import './styles.css';
import { createTodo } from './todo.js';
import { createProject } from './project.js';
import {
	renderProjects,
	renderTodos,
	setInitialUI,
	setUI,
} from './domDisplay.js';
import { addProject, deleteProject, getAllProjects } from './todoManager.js';

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

const general = getAllProjects()[0];
general.addTodo(todo1);
general.addTodo(todo2);

setUI();
renderProjects();
renderTodos();
