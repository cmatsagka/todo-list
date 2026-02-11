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
	} else if (type === 'button') {
		field = document.createElement('button');
		field.textContent = label;
		field.type = 'button';
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
	const formContainer = document.createElement('div');
	formContainer.id = 'form-container';

	const titleField = createFormElement('Title', "I've got to do", true);
	const descrField = createFormElement(
		'Description',
		'The task is...',
		false
	);
	const dateField = createFormElement('Due Date', '', false, 'date');
	const priorField = createFormElement('Priority', '', false, 'select');
	const submitBtn = createFormElement(
		initialData ? 'Save changed' : 'Add Todo',
		'',
		false,
		'button'
	);

	const clearForm = () => {
		titleField.element.value = '';
		descrField.element.value = '';
		dateField.element.value = '';
	};

	if (!initialData) {
		clearForm();
	} else {
		titleField.element.value = initialData.title;
		descrField.element.value = initialData.description;
		dateField.element.value = initialData.dueDate;
		priorField.element.value = initialData.priority;
	}

	submitBtn.element.addEventListener('click', () => {
		const data = {
			title: titleField.element.value,
			description: descrField.element.value,
			dueDate: dateField.element.value,
			priority: priorField.element.value,
		};

		onSubmit(data);
		clearForm();
	});

	formContainer.appendChild(titleField.group);
	formContainer.appendChild(descrField.group);
	formContainer.appendChild(dateField.group);
	formContainer.appendChild(priorField.group);
	formContainer.appendChild(submitBtn.group);

	return {
		formContainer,
		fields: {
			titleField,
			descrField,
			dateField,
			priorField,
			submitBtn,
		},
	};
}
