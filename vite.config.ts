/// <reference types="node" />
import { defineConfig, Plugin } from 'vite';
import path from 'node:path';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import react from '@vitejs/plugin-react';
import virtual from 'vite-plugin-virtual';

var plugin = (): Plugin => {
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
        import { reactWrapper } from 'virtual:neosvelte:react';
        import Component from '${importPath}';
        
        export default reactWrapper(Component);`;
			}
		},
	};
};

function neosvelte(): Plugin[] {
	return [
		plugin(),
		svelte({ preprocess: vitePreprocess() }),
		{
			enforce: 'pre',
			...virtual({
				'virtual:neosvelte:react': `
	import { useEffect, useLayoutEffect, useRef } from 'react';
	import { jsxDEV as _jsx } from 'react/jsx-dev-runtime';
	
	/** @param {string} str */
	const camelToKebabCase = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	
	/** @param {Record<string, any>} props */
	function getPropsAndEvents(props) {
		const propsOnly = {};
		const events = {};
	
		for (const [key, value] of Object.entries(props)) {
			if (key.startsWith('on')) {
				events[camelToKebabCase(key.replace(/^on/, ''))] = value;
			} else {
				propsOnly[key] = value;
			}
		}
	
		return [propsOnly, events];
	}
	
	/**
	 * @param {import('svelte').SvelteComponentTyped} Component
	 * @returns {import('react').FC<Record<string, any>}
	 */
	export const reactWrapper = (Component) => (props) => {
		const ref = useRef();
	
		/** @type {React.MutableRefObject<import('svelte').SvelteComponentTyped>} */
		const instanceRef = useRef();
	
		/** @type {Map<string, () => void>} */
		const eventMap = new Map();
	
		useLayoutEffect(() => {
			const [propsOnly, events] = getPropsAndEvents(props);
	
			instanceRef.current = new Component({
				target: ref.current,
				props: propsOnly,
			});
	
			for (const [key, value] of Object.entries(events)) {
				eventMap.set(key, instanceRef.current.$on(key, value));
			}
	
			return () => {
				instanceRef.current.$destroy();
	
				for (const [, cb] of eventMap) {
					cb();
				}
			};
		}, []);
	
		useEffect(() => instanceRef.current.$set(props), [props]);
	
		return _jsx('div', { style: { display: 'contents' }, ref, children: props.children });
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
