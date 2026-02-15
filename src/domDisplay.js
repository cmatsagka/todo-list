import {
	addProject,
	getActiveProject,
	getAllProjects,
	setActiveProject,
	deleteProject,
	addTodoToProject,
	removeTodoFromProject,
	updateTodoFromProject,
	renameProject,
} from './todoManager.js';
import { createTodo } from './todo.js';
import { createFormElement, getTodoForm } from './todoForm.js';
import { closeModal, showModal } from './modal.js';
import { switchView } from './viewController.js';
import { getView } from './todoManager.js';

export function setUI() {
	const sidebar = document.querySelector('#sidebar');

	const overviewBtn = document.querySelector('#overview-btn');
	overviewBtn.addEventListener('click', () => {
		switchView('DASHBOARD', getAllProjects());
	});

	const resetBtn = document.createElement('button');
	resetBtn.textContent = 'Restore Demo Story';
	resetBtn.classList.add('reset-demo-btn');
	resetBtn.addEventListener('click', () => {
		if (
			confirm('Restore the demo? This will clear your current projects.')
		) {
			localStorage.clear();
			window.location.reload();
		}
	});
	sidebar.appendChild(resetBtn);
}

export function createBoard(contextData) {
	const wrapper = document.querySelector('.todo-wrapper');
	const container = document.createElement('div');
	container.classList.add('boardContainer');

	contextData.forEach((project) => {
		const projectCard = document.createElement('div');
		projectCard.classList.add('project-card');
		const titleHeader = document.createElement('h3');
		titleHeader.textContent = project.getName();
		projectCard.appendChild(titleHeader);

		const todos = project.getTodos();
		todos.forEach((todo, index) => {
			const todoElement = createTodoElement(todo, index, project);
			projectCard.appendChild(todoElement);
		});

		container.appendChild(projectCard);
	});
	wrapper.appendChild(container);
}

export function createList(contextData) {
	const wrapper = document.querySelector('.todo-wrapper');
	const container = document.createElement('div');
	container.classList.add('listContainer');

	const titleHeader = document.createElement('h2');
	titleHeader.textContent = contextData.getName();
	const projectCard = document.createElement('div');
	projectCard.classList.add('project-card');

	const todos = contextData.getTodos();

	todos.forEach((todo, index) => {
		const todoElement = createTodoElement(todo, index, contextData);

		projectCard.appendChild(todoElement);
	});
	container.appendChild(titleHeader);
	container.appendChild(projectCard);
	wrapper.appendChild(container);
}

export function createTodoElement(todo, index, project) {
	if (!todo) return null;

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
		removeTodoFromProject(project, index);
		renderTodos();
	});

	todoElement.addEventListener('click', () => {
		const newForm = getTodoForm((newData) => {
			updateTodo(project, index, newData);
		}, todo);
		showModal(newForm);
	});

	todoElement.appendChild(deleteBtn);
	return todoElement;
}

export function renderProjects() {
	const listContainer = document.querySelector('#project-list');
	listContainer.textContent = '';

	const projects = getAllProjects();

	projects.forEach((project) => {
		const projectElement = document.createElement('p');
		projectElement.classList.add('project-item');
		projectElement.textContent = project.getName();
		const btnGroup = document.createElement('div');
		btnGroup.classList.add('btn-group');

		const editProjectBtn = document.createElement('button');
		editProjectBtn.classList.add('edit-btn');
		editProjectBtn.textContent = '✎';

		editProjectBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			showEditProjectModal(project.getName());
		});

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
			switchView('SINGLE', project);
			renderProjects();
		});

		if (project.getName() === getActiveProject().getName()) {
			projectElement.classList.add('active-project');
		}

		btnGroup.appendChild(editProjectBtn);
		btnGroup.appendChild(deleteProjectBtn);
		projectElement.appendChild(btnGroup);
		listContainer.appendChild(projectElement);
	});
}

export function renderTodos() {
	const activeProject = getActiveProject();
	const view = getView();
	const wrapper = document.querySelector('.todo-wrapper');
	const overviewBtn = document.querySelector('#overview-btn');

	if (!wrapper) return;

	if (view === 'DASHBOARD') {
		switchView('DASHBOARD', getAllProjects());
	} else {
		if (activeProject) {
			switchView('SINGLE', activeProject);
		}
	}
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
		showModal(getTodoForm(handleTodoSubmit));
	};

	const projectBtn = document.createElement('button');
	projectBtn.textContent = '+ New Project';

	projectBtn.onclick = () => {
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
			closeModal();
			renderProjects();
		}
	});

	container.appendChild(input.group);
	container.appendChild(saveBtn);
	showModal(container);
}

export function showEditProjectModal(oldName) {
	if (oldName === 'General') return;

	const container = document.createElement('div');
	container.classList.add('project-modal-form');

	const input = createFormElement('Rename Project', '', true);
	input.element.value = oldName;

	const saveBtn = document.createElement('button');
	saveBtn.textContent = 'Save Changes';

	saveBtn.addEventListener('click', () => {
		const newName = input.element.value.trim();
		const nameExists = getAllProjects().some(
			(p) => p.getName() === newName
		);

		if (newName !== '' && newName !== oldName) {
			if (nameExists) {
				alert('A project with that name already exists!');
				return;
			}

			renameProject(oldName, newName);
			setActiveProject(newName);
			closeModal();
			renderProjects();
			renderTodos();
		}
	});

	container.appendChild(input.group);
	container.appendChild(saveBtn);
	showModal(container);
}

export function updateTodo(project, index, newData) {
	updateTodoFromProject(project, index, newData);
	renderTodos();
	closeModal();
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

		closeModal();
		renderTodos();
	} else {
		alert('Please enter a title!');
	}
}
