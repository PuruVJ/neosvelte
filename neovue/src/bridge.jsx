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

		let reactive_props = get_props_and_events(props);

		onMounted(() => {
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
