function createInputField(label, placeholder, required = false, type = 'text') {
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

export function getTodoForm() {
	const formContainer = document.createElement('div');
	formContainer.id = 'form-container';

	const titleField = createInputField('Title', "I've got to do", true);
	const descrField = createInputField('Description', 'The task is...', false);

	const dateField = createInputField('Due Date', '', false, 'date');
	const priorField = createInputField('Priority', '', false, 'select');
	const button = createInputField('button', '', true, 'button');

	formContainer.appendChild(titleField.group);
	formContainer.appendChild(descrField.group);
	formContainer.appendChild(dateField.group);
	formContainer.appendChild(priorField.group);

	return formContainer;
}
