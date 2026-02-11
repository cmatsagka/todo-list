import './styles.css';
import { createTodo } from './todo.js';
import { createProject } from './project.js';
import {
	renderProjects,
	renderTodos,
	setUI,
	setupFocusMode,
	setupAddTodoButton,
} from './domDisplay.js';
import { addProject, deleteProject, getAllProjects } from './todoManager.js';

setUI();
renderProjects();
renderTodos();
setupAddTodoButton();
setupFocusMode();
