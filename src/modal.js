import { createFormElement, getTodoForm } from './todoForm';

export function showModal(contentElement, content, action) {
	const dialog = document.createElement('dialog');
	dialog.id = 'dialog';
	dialog.textContent = '';

	const closeBtn = document.createElement('button');
	closeBtn.classList.add('close-dialog-btn');
	closeBtn.textContent = 'Close';
	closeBtn.addEventListener('click', () => {
		dialog.close();
		dialog.remove();
	});

	dialog.appendChild(closeBtn);
	dialog.appendChild(contentElement);

	document.body.appendChild(dialog);
	dialog.showModal();

	return dialog;
}
