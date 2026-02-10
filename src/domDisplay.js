import {
	addProject,
	getActiveProject,
	getAllProjects,
	setActiveProject,
	deleteProject,
	addTodoToProject,
	removeTodoFromProject,
} from './todoManager.js';
import { createTodo } from './todo.js';
import { createFormElement, getTodoForm } from './todoForm.js';
import { save } from './storage.js';

let editingTodoIndex = null;

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

	const todoFormSlot = document.querySelector('#todo-form-slot');

	const handleTodoSubmit = (data) => {
		let activeProject = getActiveProject();

		if (editingTodoIndex !== null) {
			activeProject.updateTodo(editingTodoIndex, data);
			editingTodoIndex = null;
		} else {
			const newTodo = createTodo(
				data.title,
				data.description,
				data.date,
				data.priority
			);
			addTodoToProject(activeProject, newTodo);
		}
		save(getAllProjects());
		renderTodos();
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
	if (!activeProject) return;

	const titleHeader = document.querySelector('#active-project-name');

	if (titleHeader) {
		titleHeader.textContent = activeProject.getName();
	}

	const todos = activeProject.getTodos();

	if (!todos) return;

	todos.forEach((todo, index) => {
		const todoElement = document.createElement('div');
		todoElement.classList.add('todo-item');

		todoElement.addEventListener('click', () => {
			editingTodoIndex = index;
			const data = getActiveProject().getTodos()[index];

			titleField.element.value = data.title;
			descrField.element.value = data.description;
			dateField.element.value = data.dueDate;
			priorField.element.value = data.priority;

			const toggleBtn = document.querySelector('#toggle-form-btn');
			const formSlot = document.querySelector('#todo-form-slot');

			toggleBtn.textContent = 'Save Changes';
			formSlot.classList.add('active');
		});

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

		deleteBtn.addEventListener('click', () => {
			removeTodoFromProject(activeProject, index);
			renderTodos();
		});

		todoElement.appendChild(deleteBtn);
		todoListContainer.appendChild(todoElement);
	});
}

export function setupFormToggle() {
	const formSlot = document.querySelector('#todo-form-slot');
	const toggleBtn = document.querySelector('#toggle-form-btn');

	toggleBtn.addEventListener('click', () => {
		const isActive = formSlot.classList.toggle('active');

		if (isActive) {
			toggleBtn.textContent = 'Cancel';
			toggleBtn.dataset.state = 'cancel';
		} else {
			toggleBtn.textContent = '+ New Task';
			toggleBtn.dataset.state = 'add';
		}
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
