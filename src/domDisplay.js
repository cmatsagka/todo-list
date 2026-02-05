import {
	addProject,
	getActiveProject,
	getAllProjects,
	setActiveProject,
} from './todoManager.js';
import { createTodo } from './todo.js';

export function setUI() {
	const content = document.querySelector('#content');

	const controls = document.createElement('div');
	controls.classList.add('controls');

	const input = document.createElement('input');
	input.placeholder = 'New Project Name';
	input.id = 'project-input';

	const addButton = document.createElement('button');
	addButton.classList.add('add-btn');
	addButton.textContent = 'Add Project';

	const listContainer = document.createElement('div');
	listContainer.id = 'project-list';

	addButton.addEventListener('click', () => {
		let projectName = input.value;

		if (projectName !== '') {
			addProject(projectName);
			input.value = '';
			renderProjects();
		}
	});

	const formContainer = document.createElement('div');
	formContainer.classList.add('form-group');

	const formTitle = document.createElement('div');
	formTitle.classList.add('form-group');

	const labelTitle = document.createElement('label');
	labelTitle.textContent = 'Add todo title';
	const todoTitle = document.createElement('input');
	todoTitle.placeholder = "I've got to do...";
	todoTitle.required = true;

	formTitle.appendChild(labelTitle);
	formTitle.appendChild(todoTitle);

	const formDescr = document.createElement('div');
	formDescr.classList.add('form-group');

	const labelDescr = document.createElement('label');
	labelDescr.textContent = 'Describe it';
	const todoDescr = document.createElement('input');
	todoDescr.placeholder = "It's a task about...";

	formDescr.appendChild(labelDescr);
	formDescr.appendChild(todoDescr);

	const formDate = document.createElement('div');
	formDate.classList.add('form-group');

	const labelDate = document.createElement('label');
	labelDate.textContent = 'Due Date';
	const todoDate = document.createElement('input');
	todoDate.type = 'date';

	formDate.appendChild(labelDate);
	formDate.appendChild(todoDate);

	const formPriority = document.createElement('div');
	formPriority.classList.add('form-group');

	const labelPrior = document.createElement('label');
	labelPrior.textContent = 'Priority';
	const todoPrior = document.createElement('select');

	['Low', 'Medium', 'High'].forEach((level) => {
		const option = document.createElement('option');
		option.value = level.toLocaleLowerCase();
		option.textContent = level;
		todoPrior.appendChild(option);
	});

	formPriority.appendChild(labelPrior);
	formPriority.appendChild(todoPrior);

	const submitTodo = document.createElement('button');
	submitTodo.classList.add('submit-btn');
	submitTodo.textContent = 'Add todo';

	submitTodo.addEventListener('click', () => {
		let newTodo = createTodo(
			todoTitle.value,
			todoDescr.value,
			todoDate.value,
			todoPrior.value
		);

		let activeProject = getActiveProject();

		if (todoTitle.value !== '') {
			activeProject.addTodo(newTodo);
			renderTodos();

			todoTitle.value = '';
			todoDescr.value = '';
			todoDate.value = '';
		} else {
			alert('Please enter a title to your todo');
		}
	});

	formContainer.appendChild(formTitle);
	formContainer.appendChild(formDescr);
	formContainer.appendChild(formDate);
	formContainer.appendChild(formPriority);
	formContainer.appendChild(submitTodo);

	const todoContainer = document.createElement('div');
	todoContainer.classList.add('todoContainer');

	controls.appendChild(input);
	controls.appendChild(addButton);
	content.appendChild(controls);
	content.appendChild(formContainer);
	content.appendChild(listContainer);
	content.appendChild(todoContainer);
}

export function renderProjects() {
	const listContainer = document.querySelector('#project-list');
	listContainer.textContent = '';

	const projects = getAllProjects();

	projects.forEach((project) => {
		const projectElement = document.createElement('p');
		projectElement.classList.add('project-item');
		projectElement.textContent = project.getName();

		listContainer.appendChild(projectElement);

		projectElement.addEventListener('click', () => {
			setActiveProject(project.getName());
			let activeProject = getActiveProject();
			console.log('Current project is:', activeProject.getName());

			renderTodos();
		});
	});
}

export function renderTodos() {
	const todoContainer = document.querySelector('.todoContainer');
	todoContainer.textContent = '';

	let activeProject = getActiveProject();

	if (!activeProject) {
		console.warn('No active project selected');
		return;
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
		todoContainer.appendChild(todoElement);
	});
}
