import { parseISO, compareAsc } from 'date-fns';
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
import { createTodoElement } from './todoComponent.js';
import { save } from './storage.js';
import { createGhostCard, createSidebarItem } from './projectComponent.js';

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
		showResetConfirmation();
	});
	sidebar.appendChild(resetBtn);
}

export function createBoard(contextData) {
	const wrapper = document.querySelector('.todo-wrapper');
	if (!wrapper) return;
	wrapper.textContent = '';

	if (contextData.length === 0) {
		const ghostCard = createGhostCard(() => {
			showProjectModal();
		});
		wrapper.appendChild(ghostCard);
		return;
	}

	const container = document.createElement('div');
	container.classList.add('boardContainer');

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
			projectCard.classList.add('is-empty');
			const emptyAddBtn = document.createElement('button');
			emptyAddBtn.textContent = '+ Add your first task';
			emptyAddBtn.classList.add('empty-task-btn');
			emptyAddBtn.onclick = () => {
				setActiveProject(project.getName());
				showModal(getTodoForm(handleTodoSubmit));
			};
			projectCard.appendChild(emptyAddBtn);
		} else {
			renderTodoList(project, projectCard);
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
		const emptyAddBtn = document.createElement('button');
		emptyAddBtn.textContent = '+ Add your first task';
		emptyAddBtn.classList.add('empty-task-btn');
		emptyAddBtn.onclick = () => {
			setActiveProject(project.getName());
			showModal(getTodoForm(handleTodoSubmit));
		};
		projectCard.appendChild(emptyAddBtn);
	} else {
		renderTodoList(project, projectCard);
	}
	container.appendChild(headerContainer);
	container.appendChild(projectCard);
	wrapper.appendChild(container);
}

export function renderProjects() {
	const listContainer = document.querySelector('#project-list');
	listContainer.textContent = '';
	const activeProject = getActiveProject();
	const currentView = getView();

	const overviewBtn = document.querySelector('#overview-btn');
	overviewBtn.classList.toggle(
		'active-project',
		currentView === 'DASHBOARD' || !activeProject
	);

	const projects = getAllProjects();

	projects.forEach((project) => {
		const isActive =
			activeProject && project.getName() === activeProject.getName();

		const projectElement = createSidebarItem(
			project,
			(p) => {
				setActiveProject(p.getName());
				switchView('SINGLE', p);
				renderProjects();
			},
			(p) => {
				showEditProjectModal(p.getName());
			},
			(p) => {
				const taskCount = p.getTodos().length;
				if (taskCount > 0) {
					showDeleteConfirmation(p.getName(), taskCount);
				} else {
					performDelete(p.getName());
				}
			},
			isActive
		);

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
			createBoard(getAllProjects());
		}
	}
	window.scrollTo(0, 0);
}

export function renderTodoList(project, container) {
	const todos = project.getTodos();

	const sortedTodos = [...todos].sort((a, b) => {
		if (a.completed !== b.completed) {
			return a.completed - b.completed;
		}
		if (a.dueDate && b.dueDate) {
			return compareAsc(parseISO(a.dueDate), parseISO(b.dueDate));
		}
		return 0;
	});

	sortedTodos.forEach((todo) => {
		const todoElement = createTodoElement(
			todo,
			(t) => {
				t.completed = !t.completed;
				save(getAllProjects());
				renderTodos();
			},
			(t) => {
				removeTodoFromProject(project, t);
				renderTodos();
			},
			(t) => {
				if (t.completed) return;
				const newForm = getTodoForm((newData) => {
					updateTodo(project, t, newData);
				}, t);
				showModal(newForm);
			}
		);

		container.appendChild(todoElement);
	});
}

export function setupFocusMode() {
	const container = document.querySelector('.app-container');
	const toggleFocusBtn = document.querySelector('#toggle-focus-btn');

	toggleFocusBtn.addEventListener('click', () => {
		const isFocus = container.classList.toggle('focus-mode');

		if (isFocus) {
			toggleFocusBtn.textContent = '[	|]';
			toggleFocusBtn.dataset.state = 'exit';
		} else {
			toggleFocusBtn.textContent = '[| ]';
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
		const name = input.element.value.trim();
		if (name !== '') {
			addProject(name);
			closeModal();
			renderProjects();
			renderTodos();
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

export function updateTodo(project, todo, newData) {
	updateTodoFromProject(project, todo, newData);
	renderTodos();
	closeModal();
}

export function handleTodoSubmit(data) {
	let activeProject = getActiveProject();

	if (!activeProject) {
		alert('Please create a project first before adding tasks!');
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

export function showDeleteConfirmation(projectName, taskCount) {
	const container = document.createElement('div');
	container.classList.add('confirm-modal');

	const deleteMsgTitle = document.createElement('h3');
	deleteMsgTitle.textContent = 'Delete Project?';

	const deleteMsgText = document.createElement('p');
	deleteMsgText.textContent = `Are you sure you want to delete "${projectName}"?`;

	const warningMsgText = document.createElement('p');
	warningMsgText.textContent = `This will permanently remove ${taskCount} tasks.`;
	warningMsgText.classList.add('warning');

	const cancelBtn = document.createElement('button');
	cancelBtn.textContent = 'Cancel';
	cancelBtn.classList.add('cancel-btn');
	cancelBtn.onclick = closeModal;

	const deleteBtn = document.createElement('button');
	deleteBtn.textContent = 'Delete Everything';
	deleteBtn.classList.add('danger-btn');
	deleteBtn.onclick = () => {
		performDelete(projectName);
		closeModal();
	};

	const btnGroup = document.createElement('div');
	btnGroup.classList.add('confirm-btns');
	btnGroup.appendChild(cancelBtn);
	btnGroup.appendChild(deleteBtn);

	container.appendChild(deleteMsgTitle);
	container.appendChild(deleteMsgText);
	container.appendChild(warningMsgText);
	container.appendChild(btnGroup);
	showModal(container);
}

export function performDelete(projectName) {
	deleteProject(projectName);
	const active = getAllProjects();
	if (active.length === 0) {
		switchView('DASHBOARD', getAllProjects());
	}
	renderProjects();
	renderTodos();
}

export function showResetConfirmation() {
	const container = document.createElement('div');
	container.classList.add('confirm-modal');

	const title = document.createElement('h3');
	title.textContent = 'Restore Demo Story?';

	const msg = document.createElement('p');
	msg.textContent = `This will clear all your current projects and tasks and restore the original demo. This action cannot be undone.`;

	const cancelBtn = document.createElement('button');
	cancelBtn.textContent = 'keep My Data';
	cancelBtn.classList.add('cancel-btn');
	cancelBtn.onclick = closeModal;

	const resetBtn = document.createElement('button');
	resetBtn.textContent = 'Delete Everything';
	resetBtn.classList.add('danger-btn');
	resetBtn.onclick = () => {
		localStorage.clear();
		window.location.reload();
	};

	const btnGroup = document.createElement('div');
	btnGroup.classList.add('confirm-btns');
	btnGroup.appendChild(cancelBtn);
	btnGroup.appendChild(resetBtn);

	container.appendChild(title);
	container.appendChild(msg);
	container.appendChild(btnGroup);
	showModal(container);
}
