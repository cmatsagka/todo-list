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
	todoTitle.setAttribute('title', todo.title);
	todoElement.appendChild(todoTitle);

	if (todo.dueDate && todo.dueDate !== '') {
		const todoDate = document.createElement('div');
		todoDate.classList.add('todo-date');

		try {
			const dateObj = parseISO(todo.dueDate);
			const formattedDate = format(dateObj, 'MMM do, yyyy');
			todoDate.textContent = `Due: ${formattedDate}`;

			if (isPast(dateObj) && !isToday(dateObj) && !todo.completed) {
				todoDate.classList.add('overdue');
				todoDate.textContent += ' !';
			}
		} catch (error) {
			todoDate.textContent = `Due: ${todo.dueDate}`;
		}

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
