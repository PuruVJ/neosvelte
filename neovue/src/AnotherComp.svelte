<script>
	import { createEventDispatcher } from 'svelte';
	import { readable } from 'svelte/store';
	import { blur } from 'svelte/transition';

	export let duration = 1000;

	const dispatch = createEventDispatcher();

	const createTimerStore = (ms) =>
		readable(new Date(), (set) => {
			const interval = setInterval(() => set(new Date()), ms);

			return () => clearInterval(interval);
		});

	const timer = createTimerStore(duration);

	$: {
		$timer;

		dispatch('tick');
	}
</script>

<div transition:blur={{ duration: 2000 }}>HOLAAAAAAAA</div>
