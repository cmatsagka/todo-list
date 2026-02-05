import {
	addProject,
	getActiveProject,
	getAllProjects,
	setActiveProject,
	deleteProject,
} from './todoManager.js';
import { createTodo } from './todo.js';
import { getTodoForm } from './todoForm.js';

export function setUI() {
	//sidebar - project control
	const sidebar = document.querySelector('#sidebar');

	const sidebarTitle = document.createElement('h2');
	sidebarTitle.textContent = 'Projects';

	const projectControls = document.createElement('div');
	projectControls.id = 'project-controls';
	projectControls.textContent = 'Here is the project control panel';

	const input = document.createElement('input');
	input.placeholder = 'New Project Name';
	input.id = 'project-input';

	const addButton = document.createElement('button');
	addButton.classList.add('add-btn');
	addButton.textContent = 'Add Project';

	projectControls.appendChild(input);
	projectControls.appendChild(addButton);

	const projectList = document.querySelector('#project-list');

	sidebar.appendChild(sidebarTitle);
	sidebar.appendChild(projectControls);
	sidebar.appendChild(projectList);

	addButton.addEventListener('click', () => {
		let projectName = input.value;

		if (projectName !== '') {
			addProject(projectName);
			input.value = '';
			renderProjects();
		}
	});

	//-------------------------------------//

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

	const todoFormSlot = document.querySelector('#todo-form-slot');
	const formContainer = getTodoForm();
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
