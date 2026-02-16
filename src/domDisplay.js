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
	clearCompletedTasks,
} from './todoManager.js';
import { createTodo } from './todo.js';
import { createFormElement, getTodoForm } from './todoForm.js';
import { closeModal, showModal } from './modal.js';
import { switchView } from './viewController.js';
import { getView } from './todoManager.js';
import { save } from './storage.js';

export function setUI() {
	const sidebar = document.querySelector('#sidebar');

	const overviewBtn = document.querySelector('#overview-btn');
	overviewBtn.addEventListener('click', () => {
		switchView('DASHBOARD', getAllProjects());
		renderProjects();
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

	if (contextData.length === 0) {
		const msg = document.createElement('p');
		msg.classList.add('empty-project-msg');
		msg.textContent = 'No  projects yet. Create one to get started!';
		wrapper.appendChild(msg);
		return;
	}

	contextData.forEach((project) => {
		const projectCard = document.createElement('div');
		projectCard.classList.add('project-card');
		const titleHeader = document.createElement('h3');
		titleHeader.textContent = project.getName();
		projectCard.appendChild(titleHeader);

		const header = document.createElement('div');
		header.classList.add('project-header');

		const clearBtn = document.createElement('button');
		clearBtn.textContent = 'Clear Completed';
		clearBtn.classList.add('clear-completed-btn');

		clearBtn.onclick = () => {
			clearCompletedTasks(project);
			renderTodos();
		};

		projectCard.appendChild(header);
		projectCard.appendChild(clearBtn);

		const todos = project.getTodos();

		if (todos.length === 0) {
			const emptyMsg = document.createElement('p');
			emptyMsg.textContent = 'No tasks in this project!';
			emptyMsg.classList.add('empty-task-msg');
			projectCard.appendChild(emptyMsg);
		} else {
			const sortedTodos = [...todos].sort(
				(a, b) => a.completed - b.completed
			);

			sortedTodos.forEach((todo) => {
				const realIndex = todos.indexOf(todo);

				const todoElement = createTodoElement(todo, realIndex, project);
				projectCard.appendChild(todoElement);
			});
		}

		container.appendChild(projectCard);
	});
	wrapper.appendChild(container);
}

export function createList(project) {
	const wrapper = document.querySelector('.todo-wrapper');
	const container = document.createElement('div');
	container.classList.add('listContainer');

	const headerContainer = document.createElement('div');
	headerContainer.classList.add('project-header');

	const titleHeader = document.createElement('h2');
	titleHeader.textContent = project.getName();

	const clearBtn = document.createElement('button');
	clearBtn.textContent = 'Clear Completed';
	clearBtn.classList.add('clear-completed-btn');

	clearBtn.onclick = () => {
		clearCompletedTasks(project);
		renderTodos();
	};

	headerContainer.appendChild(titleHeader);
	headerContainer.appendChild(clearBtn);

	const projectCard = document.createElement('div');
	projectCard.classList.add('project-card');

	const todos = project.getTodos();

	if (todos.length === 0) {
		const emptyMsg = document.createElement('p');
		emptyMsg.textContent = 'No tasks in this project!';
		emptyMsg.classList.add('empty-task-msg');
		projectCard.appendChild(emptyMsg);
	} else {
		const sortedTodos = [...todos].sort(
			(a, b) => a.completed - b.completed
		);

		sortedTodos.forEach((todo) => {
			const realIndex = todos.indexOf(todo);

			const todoElement = createTodoElement(todo, realIndex, project);

			projectCard.appendChild(todoElement);
		});
	}
	container.appendChild(headerContainer);
	container.appendChild(projectCard);
	wrapper.appendChild(container);
}

export function createTodoElement(todo, index, project) {
	if (!todo) return null;

	const todoElement = document.createElement('div');
	todoElement.classList.add('todo-item');

	if (todo.completed) {
		todoElement.classList.add('completed');
	}

	const checkBtn = document.createElement('div');
	checkBtn.classList.add('check-circle');

	if (todo.completed) {
		checkBtn.classList.add('checked');
	}

	checkBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		todo.completed = !todo.completed;

		todoElement.classList.toggle('completed');
		checkBtn.classList.toggle('checked');

		save(getAllProjects());
		renderTodos();
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

	deleteBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		removeTodoFromProject(project, index);
		renderTodos();
	});

	todoElement.addEventListener('click', () => {
		if (todo.completed) return;
		const newForm = getTodoForm((newData) => {
			updateTodo(project, index, newData);
		}, todo);
		showModal(newForm);
	});

	todoElement.appendChild(checkBtn);
	todoElement.appendChild(deleteBtn);
	return todoElement;
}

export function renderProjects() {
	const listContainer = document.querySelector('#project-list');
	listContainer.textContent = '';
	const overviewBtn = document.querySelector('#overview-btn');
	const currentView = getView();

	if (currentView === 'DASHBOARD') {
		overviewBtn.classList.add('active-project');
	} else {
		overviewBtn.classList.remove('active-project');
	}

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

			deleteProject(projectName);
			const allProjects = getAllProjects();
			if (allProjects.length > 0) {
				setActiveProject(allProjects[0].getName());
			}
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
	if (!wrapper) return;
	wrapper.textContent = '';

	if (view === 'DASHBOARD') {
		switchView('DASHBOARD', getAllProjects());
	} else {
		if (activeProject) {
			switchView('SINGLE', activeProject);
		} else {
			createBoard([]);
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
		alert('Please create a project firs before adding tasks!');
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
