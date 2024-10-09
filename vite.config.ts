/// <reference types="node" />
import { defineConfig, Plugin } from 'vite';
import path from 'node:path';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import react from '@vitejs/plugin-react';
import virtual from 'vite-plugin-virtual';

var svelte_to_react = (): Plugin => {
	return {
		name: 'svelte-react',
		enforce: 'pre',
		resolveId(id, importer) {
			if (id.endsWith('.svelte?react') && importer) {
				const importPath = path.resolve(path.dirname(importer), id.replace('?react', ''));
				console.log({ importPath });
				return { id: `${importPath}.neosvelte-react`, moduleSideEffects: false };
			}
			return null;
		},
		load(id) {
			if (id.endsWith('.neosvelte-react')) {
				const importPath = id.replace('.neosvelte-react', '');
				return `
        import { react_wrapper } from 'virtual:neosvelte:./react.svelte.js';
        import Component from '${importPath}';
        
        export default react_wrapper(Component);`;
			}
		},
	};
};

function neosvelte(): Plugin[] {
	return [
		svelte_to_react(),
		svelte({ preprocess: vitePreprocess() }),
		{
			enforce: 'pre',
			...virtual({
				'virtual:neosvelte:./react.svelte.js': `
	// @ts-check
import { useEffect, useRef, createElement } from 'react';
import { mount, unmount } from 'svelte';

/** @param {Record<string, any>} react_props */
function normalize_props(react_props) {
	const props = {};

	for (const [key, value] of Object.entries(react_props)) {
		if (key.startsWith('on')) {
			props[key.toLowerCase()] = value;
		} else {
			props[key] = value;
		}
	}

	return props;
}

/**
 * @param {import('svelte').Component} Component
 * @returns {import('react').FC<Record<string, any>>}
 */
export const react_wrapper = (Component) => (props) => {
	const target = useRef();

	let reactive_props = $state(normalize_props(props));

	useEffect(() => {
		if (!target.current) return;

		const instance = mount(Component, { target: target.current, props: reactive_props });

		return () => {
			unmount(instance);
		};
	}, []);

	useEffect(() => {
		Object.assign(reactive_props, normalize_props(props));
	}, [props]);

	return createElement('div', {
		style: { display: 'contents' },
		ref: target,
		children: props.children,
	});
};
	`,
			}),
		},
	];
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), neosvelte()],
});
