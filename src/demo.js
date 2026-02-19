import { createTodo } from './todo.js';
import {
	addProject,
	addTodoToProject,
	clearCompletedTasks,
	getActiveProject,
	getAllProjects,
	setActiveProject,
} from './todoManager.js';

export const loadDemoStory = () => {
	const generalProject = getAllProjects().find(
		(p) => p.getName() === 'General'
	);

	if (generalProject) {
		addTodoToProject(
			generalProject,
			createTodo(
				'Welcome to the Workspace',
				'This is your default project. Use it for quick thoughts and miscellaneous tasks.',
				'2026-02-12',
				'medium'
			)
		);
		addTodoToProject(
			generalProject,
			createTodo(
				'Explore the Sidebar',
				'Click on "The Architect" or "The Quarry" to see specialized project workflows.',
				'2026-02-13',
				'low'
			)
		);
	}

	const addDemo = (name, ...tasks) => {
		addProject(name);
		const project = getActiveProject();
		tasks.forEach((t) => addTodoToProject(project, createTodo(...t)));
	};

	addDemo(
		'The Architect',
		[
			'Lay the Ethereal Foundation',
			'Define the core purpose of this digital space.',
			'2026-02-15',
			'high',
		],
		[
			'Polish the Keystone',
			'Ensure the interface reflects clean design.',
			'2026-03-01',
			'low',
		]
	);

	addDemo(
		'The Quarry',
		[
			'Extract Pure Logic',
			'Mine the deepest functions for performance.',
			'2026-02-20',
			'medium',
		],
		[
			'Refine Raw Data',
			'Transform JSON strings into beautiful UI elements.',
			'2026-02-22',
			'high',
		]
	);

	addDemo('The Observatory', [
		'Watch the Horizon',
		'Identify upcoming features and tech debt.',
		'2026-04-10',
		'low',
	]);

	setActiveProject('The Architect');
};
