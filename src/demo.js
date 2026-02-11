import { createTodo } from './todo.js';
import {
	addProject,
	addTodoToProject,
	getAllProjects,
	setActiveProject,
} from './todoManager.js';

export const loadDemoStory = () => {
	addProject('The Architect');
	const projects = getAllProjects();
	const storyProject = projects.find((p) => p.getName() === 'The Architect');

	if (storyProject) {
		addTodoToProject(
			storyProject,
			createTodo(
				'Lay the Ethereal Foundation',
				'Every structure begins in the void. Define the core purpose of this digital space.',
				'2026-02-20',
				'high'
			)
		);

		addTodoToProject(
			storyProject,
			createTodo(
				'Carve the Logic Gates',
				'Draft the blueprints of flow. Map how users move through your creation.',
				'2026-02-25',
				'medium'
			)
		);

		addTodoToProject(
			storyProject,
			createTodo(
				'Polish the Keystone',
				'The final touch. Ensure the interface reflects the light of clean design.',
				'2026-03-01',
				'low'
			)
		);
	}

	setActiveProject('The Architect');
};
