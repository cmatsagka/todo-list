export function createFormElement(
	label,
	placeholder,
	required = false,
	type = 'text'
) {
	const formGroup = document.createElement('div');
	formGroup.classList.add('form-group');

	const labelElement = document.createElement('label');
	labelElement.textContent = label;

	let field;

	if (type === 'select') {
		field = document.createElement('select');
		['Low', 'Medium', 'High'].forEach((level) => {
			const option = document.createElement('option');
			option.value = level.toLocaleLowerCase();
			option.textContent = level;
			field.appendChild(option);
		});
	} else if (type === 'button' || type === 'submit') {
		field = document.createElement('button');
		field.textContent = label;
		field.type = type;
	} else {
		field = document.createElement('input');
		field.type = type;
		field.placeholder = placeholder;
	}
	field.required = required;

	if (type !== 'button') {
		formGroup.appendChild(labelElement);
	}

	formGroup.appendChild(field);

	return { group: formGroup, element: field };
}

export function getTodoForm(onSubmit, initialData = null) {
	const form = document.createElement('form');
	form.id = 'todo-form';

	const titleField = createFormElement('Title', "I've got to do", true);
	const descrField = createFormElement(
		'Description',
		'The task is...',
		false
	);
	const dateField = createFormElement('Due Date', '', false, 'date');
	const priorField = createFormElement('Priority', '', false, 'select');
	const submitBtn = createFormElement(
		initialData ? 'Save changes' : 'Add Todo',
		'',
		false,
		'submit'
	);

	if (initialData) {
		titleField.element.value = initialData.title;
		descrField.element.value = initialData.description;
		dateField.element.value = initialData.dueDate;
		priorField.element.value = initialData.priority;
	}

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const data = {
			title: titleField.element.value,
			description: descrField.element.value,
			dueDate: dateField.element.value,
			priority: priorField.element.value,
		};

		if (data.title.trim() === '') {
			alert('Title required');
			return;
		}

		onSubmit(data);
	});

	form.appendChild(titleField.group);
	form.appendChild(descrField.group);
	form.appendChild(dateField.group);
	form.appendChild(priorField.group);
	form.appendChild(submitBtn.group);

	return form;
}
