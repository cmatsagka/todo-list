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
	const projectForm = document.createElement('div');
	projectForm.classList.add('project-form-slot');

	const projectInput = createFormElement(
		'Project Name',
		'New Project...',
		true
	);

	const addProjectBtn = createFormElement('Add Project', '', false, 'button');

	projectForm.appendChild(projectInput.group);
	projectForm.appendChild(addProjectBtn.group);
	sidebar.appendChild(projectForm);
	sidebar.appendChild(projectList);

	addProjectBtn.element.addEventListener('click', () => {
		let name = projectInput.element.value;

		if (name !== '') {
			addProject(name);
			projectInput.element.value = '';
			renderProjects();
		}
	});
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

export function setupAddTodoButton() {
	const addButtons = document.querySelectorAll(
		'#toggle-form-btn, #floating-add-btn'
	);

	addButtons.forEach((btn) => {
		btn.addEventListener('click', () => {
			const newTodoForm = getTodoForm(handleTodoSubmit);
			showModal(newTodoForm);
		});
	});
}

export function setupFocusMode() {
	const container = document.querySelector('.app-container');
	const toggleFocusBtn = document.querySelector('#toggle-focus-btn');
	const toggleFormBtn = document.querySelector('#toggle-form-btn');

	toggleFocusBtn.addEventListener('click', () => {
		const isFocus = container.classList.toggle('focus-mode');

		if (isFocus) {
			toggleFocusBtn.textContent = 'X';
			toggleFocusBtn.dataset.state = 'exit';
			toggleFormBtn.style.opacity = '0';
			toggleFormBtn.style.pointerEvents = 'none';
		} else {
			toggleFocusBtn.textContent = 'Focus Mode';
			toggleFocusBtn.dataset.state = 'focus';
			toggleFormBtn.style.opacity = '1';
			toggleFormBtn.style.pointerEvents = 'auto';
		}
	});
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
