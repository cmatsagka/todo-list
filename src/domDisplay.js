import {
	addProject,
	getActiveProject,
	getAllProjects,
	setActiveProject,
	deleteProject,
	addTodoToProject,
	removeTodoFromProject,
	updateTodoFromProject,
} from './todoManager.js';
import { createTodo } from './todo.js';
import { createFormElement, getTodoForm } from './todoForm.js';
import { showModal } from './modal.js';

export function setUI() {
	const sidebar = document.querySelector('#sidebar');
	const projectList = document.querySelector('#project-list');

	sidebar.appendChild(projectList);
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
	const titleHeader = document.querySelector('#active-project-name');
	todoListContainer.textContent = '';
	const activeProject = getActiveProject();

	if (!activeProject) {
		if (titleHeader) {
			titleHeader.textContent = 'No project Selected';
			const message = document.createElement('p');
			message.classList.add('empty-message');
			message.textContent =
				'Select a project from the sidebar to view tasks.';
			todoListContainer.appendChild(message);
		}
		return;
	}
	if (titleHeader) {
		titleHeader.textContent = activeProject.getName();
	}

	const todos = activeProject.getTodos();

	if (!todos || todos.length === 0) {
		const message = document.createElement('p');
		message.classList.add('empty-message');
		message.textContent =
			'This project is empty. Click "+ New Task" to start!';
		todoListContainer.appendChild(message);
		return;
	}

	todos.forEach((todo, index) => {
		if (!todo) return;
		const todoElement = document.createElement('div');
		todoElement.classList.add('todo-item');

		if (todo.priority === 'high') {
			todoElement.classList.add('high-priority');
		}

		if (todo.priority === 'medium') {
			todoElement.classList.add('medium-priority');
		}

		const todoTitle = document.createElement('div');
		todoTitle.classList.add('todo-title');
		todoTitle.textContent = `${todo.title}`;
		todoElement.appendChild(todoTitle);

		if (todo.dueDate !== '') {
			const todoDate = document.createElement('div');
			todoDate.classList.add('todo-date');
			todoDate.textContent = `Due: ${todo.dueDate}`;

			todoElement.appendChild(todoDate);
		}

		const deleteBtn = document.createElement('button');
		deleteBtn.classList.add('delete-btn');
		deleteBtn.textContent = 'X';

		deleteBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			removeTodoFromProject(activeProject, index);
			renderTodos();
		});

		todoElement.addEventListener('click', () => {
			const newForm = getTodoForm((newData) => {
				updateTodo(activeProject, index, newData);
			}, todo);
			showModal(newForm);
		});

		todoElement.appendChild(deleteBtn);
		todoListContainer.appendChild(todoElement);
	});
}

export function setupFocusMode() {
	const container = document.querySelector('.app-container');
	const toggleFocusBtn = document.querySelector('#toggle-focus-btn');

	toggleFocusBtn.addEventListener('click', () => {
		const isFocus = container.classList.toggle('focus-mode');

		if (isFocus) {
			toggleFocusBtn.textContent = 'X';
			toggleFocusBtn.dataset.state = 'exit';
		} else {
			toggleFocusBtn.textContent = 'Focus Mode';
			toggleFocusBtn.dataset.state = 'focus';
		}
	});
}

export function setupAddTodoButton() {
	const fab = document.querySelector('#floating-add-btn');

	if (fab) {
		fab.addEventListener('click', () => {
			showAddChoiceModal();
		});
	}
}

export function showAddChoiceModal() {
	const container = document.createElement('div');
	container.classList.add('choice-container');

	const taskBtn = document.createElement('button');
	taskBtn.textContent = '+ New Task';

	taskBtn.onclick = () => {
		const dialog = document.querySelector('#dialog');
		dialog.remove();
		showModal(getTodoForm(handleTodoSubmit));
	};

	const projectBtn = document.createElement('button');
	projectBtn.textContent = '+ New Project';

	projectBtn.onclick = () => {
		const dialog = document.querySelector('#dialog');
		dialog.remove();
		showProjectModal();
	};

	container.appendChild(taskBtn);
	container.appendChild(projectBtn);
	showModal(container);
}

export function showProjectModal() {
	const container = document.createElement('div');
	container.classList.add('project-modal-form');

	const input = createFormElement(
		'Project Name',
		'Enter project name...',
		true
	);
	const saveBtn = document.createElement('button');
	saveBtn.textContent = 'Create Project';

	saveBtn.addEventListener('click', () => {
		const name = input.element.value;
		if (name !== '') {
			addProject(name);
			const dialog = document.querySelector('#dialog');
			dialog.remove();
			renderProjects();
		}
	});

	container.appendChild(input.group);
	container.appendChild(saveBtn);
	showModal(container);
}

export function updateTodo(project, index, newData) {
	updateTodoFromProject(project, index, newData);
	renderTodos();
	const dialog = document.querySelector('#dialog');
	if (dialog) {
		dialog.close();
		dialog.remove();
	}
}

export function handleTodoSubmit(data) {
	let activeProject = getActiveProject();

	if (!activeProject) {
		alert('Please select or create a project first!');
		return;
	}

	if (data.title !== '') {
		const newTodo = createTodo(
			data.title,
			data.description,
			data.dueDate,
			data.priority
		);

		addTodoToProject(activeProject, newTodo);

		const dialog = document.querySelector('#dialog');

		if (dialog) {
			dialog.close();
			dialog.remove();
		}
		renderTodos();
	} else {
		alert('Please enter a title!');
	}
}
