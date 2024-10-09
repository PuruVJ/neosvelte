// @ts-check
import { useLayoutEffect, useRef, createElement } from 'react';
import { mount, unmount } from 'svelte';

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
 * @returns {import('react').FC<Record<string, any>>}
 */
export const react_wrapper = (Component) => (props) => {
	const target = useRef();

	/** @type {React.MutableRefObject<import('svelte').Component | undefined>} */
	const instance_ref = useRef();

	useLayoutEffect(() => {
		if (!target.current) return;

		const processed_props = get_props_and_events(props);

		instance_ref.current = mount(Component, { target: target.current, props: processed_props });

		return () => {
			instance_ref.current && unmount(instance_ref.current);
		};
	}, []);

	// useEffect(() => instance_ref.current.(props), [props]);

	return createElement('div', {
		style: { display: 'contents' },
		ref: target,
		children: props.children,
	});
};
