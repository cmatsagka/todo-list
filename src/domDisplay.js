import {
	addProject,
	getActiveProject,
	getAllProjects,
	setActiveProject,
	deleteProject,
} from './todoManager.js';
import { createTodo } from './todo.js';
import { createFormElement, getTodoForm } from './todoForm.js';

export function setUI() {
	const sidebar = document.querySelector('#sidebar');
	const projectList = document.querySelector('#project-list');

	const projectInput = createFormElement(
		'Project Name',
		'New Project...',
		true
	);
	const addProjectBtn = createFormElement('Add Project', '', false, 'button');

	sidebar.appendChild(projectInput.group);
	sidebar.appendChild(addProjectBtn.group);
	sidebar.appendChild(projectList);

	addProjectBtn.element.addEventListener('click', () => {
		let name = projectInput.element.value;

		if (name !== '') {
			addProject(name);
			projectInput.element.value = '';
			renderProjects();
		}
	});

	const todoFormSlot = document.querySelector('#todo-form-slot');

	const handleTodoSubmit = (data) => {
		let activeProject = getActiveProject();

		if (data.title !== '') {
			const newTodo = createTodo(
				data.title,
				data.description,
				data.date,
				data.priority
			);
			activeProject.addTodo(newTodo);
			renderTodos();
		} else {
			alert('Please enter a title!');
		}
	};
	const formContainer = getTodoForm(handleTodoSubmit);
	todoFormSlot.appendChild(formContainer);
}

export function renderProjects() {
	const listContainer = document.querySelector('#project-list');
	listContainer.textContent = '';

	const projects = getAllProjects();

	projects.forEach((project) => {
		const projectElement = document.createElement('p');
		projectElement.classList.add('project-item');
		projectElement.textContent = project.getName();

		const deleteProjectBtn = document.createElement('button');
		deleteProjectBtn.classList.add('delete-btn');
		deleteProjectBtn.textContent = 'X';

		deleteProjectBtn.addEventListener('click', (e) => {
			e.stopPropagation();

			const projectName = project.getName();
			if (projectName === 'General') {
				return alert('Cannot delete General project');
			}

			deleteProject(projectName);
			setActiveProject('General');
			renderProjects();
			renderTodos();
		});

		projectElement.addEventListener('click', () => {
			setActiveProject(project.getName());

			renderProjects();
			renderTodos();
		});

		if (project.getName() === getActiveProject().getName()) {
			projectElement.classList.add('active');
		}

		projectElement.appendChild(deleteProjectBtn);
		listContainer.appendChild(projectElement);
	});
}

export function renderTodos() {
	const todoListContainer = document.querySelector('#todo-items');
	todoListContainer.textContent = '';

	const activeProject = getActiveProject();

	const titleHeader = document.querySelector('#active-project-name');

	if (titleHeader) {
		titleHeader.textContent = activeProject.getName();
	}

	const todos = activeProject.getTodos();

	if (!todos) return;

	todos.forEach((todo, index) => {
		const todoElement = document.createElement('div');
		todoElement.classList.add('todo-item');

		todoElement.textContent = `${todo.title} - Due: ${todo.dueDate}`;

		const deleteBtn = document.createElement('button');
		deleteBtn.classList.add('delete-btn');
		deleteBtn.textContent = 'X';

		deleteBtn.addEventListener('click', () => {
			activeProject.deleteTodo(index);
			renderTodos();
		});

		todoElement.appendChild(deleteBtn);
		todoListContainer.appendChild(todoElement);
	});
}
