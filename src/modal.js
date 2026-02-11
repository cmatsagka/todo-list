import { createFormElement, getTodoForm } from './todoForm.js';

export function showModal(contentElement) {
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

	dialog.addEventListener('click', (e) => {
		const dialogDimensions = dialog.getBoundingClientRect();
		if (
			e.clientX < dialogDimensions.left ||
			e.clientX > dialogDimensions.right ||
			e.clientY < dialogDimensions.top ||
			e.clientY > dialogDimensions.bottom
		) {
			dialog.close();
			dialog.remove();
		}
	});

	document.body.appendChild(dialog);
	dialog.showModal();
	return dialog;
}
