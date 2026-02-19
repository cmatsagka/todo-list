export function createTodoElement(todo, onToggle, onDelete, onEdit) {
	if (!todo) return null;

	const todoElement = document.createElement('div');
	todoElement.classList.add('todo-item');

	todoElement.classList.toggle('completed', todo.completed);
	todoElement.classList.toggle('high-priority', todo.priority === 'high');
	todoElement.classList.toggle('medium-priority', todo.priority === 'medium');

	const checkBtn = document.createElement('div');
	checkBtn.classList.add('check-circle');
	checkBtn.classList.toggle('checked', todo.completed);

	checkBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		onToggle(todo);
	});

	const todoTitle = document.createElement('div');
	todoTitle.classList.add('todo-title');
	todoTitle.textContent = todo.title;
	todoTitle.setAttribute('title', todo.title);

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
		onDelete(todo);
	});

	todoElement.addEventListener('click', () => {
		onEdit(todo);
	});

	todoElement.appendChild(checkBtn);
	todoElement.appendChild(todoTitle);
	todoElement.appendChild(deleteBtn);
	return todoElement;
}
