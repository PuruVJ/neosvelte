import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
/// <reference types="node" />
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'node:path';
import { Plugin } from 'vite';
import virtual from 'vite-plugin-virtual';

var vue_to_react = (): Plugin => {
	return {
		name: 'vue-react',
		enforce: 'pre',
		resolveId(id, importer) {
			if (id.endsWith('.svelte?vue') && importer) {
				const importPath = path.resolve(path.dirname(importer), id.replace('?vue', ''));
				console.log({ importPath });
				return { id: `${importPath}.neosvelte-vue`, moduleSideEffects: false };
			}
			return null;
		},
		load(id) {
			if (id.endsWith('.neosvelte-vue')) {
				const importPath = id.replace('.neosvelte-vue', '');
				return `
        import { vue_wrapper } from 'virtual:neosvelte:./vue.svelte.js';
        import Component from '${importPath}';
        
        export default vue_wrapper(Component);`;
			}
		},
	};
};

function neosvelte(): Plugin[] {
	return [
		vue_to_react(),
		{
			enforce: 'pre',
			...virtual({
				'virtual:neosvelte:./vue.svelte.js': `
	// @ts-check
import { mount, unmount } from 'svelte';
import { defineComponent, h, onMounted, ref, watch } from 'vue';

/** @param {Record<string, any>} react_props */
function get_props_and_events(react_props) {
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
 * @returns {import('vue').Component}
 */
export const vue_wrapper = (Component) =>
	defineComponent((props) => {
		const target = ref();

		/** @type {import('vue').Ref<import('svelte').Component | undefined>} */
		const instance_ref = ref();

		let reactive_props = $state(get_props_and_events(props));

		onMounted(() => {
    console.log($state.snapshot(reactive_props))
			instance_ref.value = mount(Component, { target: target.value, props: reactive_props });

			return () => {
				instance_ref.value && unmount(instance_ref.value);
			};
		});

		watch(props, () => {
			if (instance_ref.value) {
				reactive_props = get_props_and_events(props);
			}
		});

		return () =>
			h('div', { style: { display: 'contents' }, ref: target, children: props.children });
	});
	`,
			}),
		},
		// @ts-ignore
		svelte({ preprocess: vitePreprocess() }),
	];
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), neosvelte()],
});
