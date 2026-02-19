export function createGhostCard(onCreateClick) {
	const ghostCard = document.createElement('div');
	ghostCard.classList.add('project-card', 'ghost-card');

	const ghostTitle = document.createElement('h3');
	ghostTitle.textContent = 'No Projects Yet';

	const ghostText = document.createElement('p');
	ghostText.textContent =
		'Organize your tasks by creating your first project';

	const ghostBtn = document.createElement('button');
	ghostBtn.textContent = '+ Create Project';
	ghostBtn.classList.add('ghost-cta-btn');

	ghostBtn.onclick = onCreateClick;

	ghostCard.appendChild(ghostTitle);
	ghostCard.appendChild(ghostText);
	ghostCard.appendChild(ghostBtn);

	return ghostCard;
}

export function createSidebarItem(
	project,
	onSelect,
	onEdit,
	onDelete,
	isActive
) {
	const item = document.createElement('p');
	item.classList.add('project-item');
	item.textContent = project.getName();

	item.classList.toggle('active-project', isActive);

	const btnGroup = document.createElement('div');
	btnGroup.classList.add('btn-group');

	const editBtn = document.createElement('button');
	editBtn.classList.add('edit-btn');
	editBtn.textContent = '✎';

	const deleteBtn = document.createElement('button');
	deleteBtn.classList.add('delete-btn');
	deleteBtn.textContent = 'X';

	editBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		onEdit(project);
	});

	deleteBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		onDelete(project);
	});

	item.addEventListener('click', () => {
		onSelect(project);
	});

	btnGroup.appendChild(editBtn);
	btnGroup.appendChild(deleteBtn);
	item.appendChild(btnGroup);

	return item;
}
