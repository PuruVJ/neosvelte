<script>
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import AnotherComp from './AnotherComp.svelte';

	export let duration;
	export let initialVal;

	/** @type {() => void}*/
	export let callback;

	let isRendered = false;

	const progress = tweened(initialVal, {
		duration,
		easing: cubicOut,
	});

	onMount(() => {
		setTimeout(() => {
			callback();
			isRendered = true;
		}, duration);
	});
</script>

<progress value={$progress} />

<button on:click={() => progress.set(0)}> 0% </button>

<button on:click={() => progress.set(0.25)}> 25% </button>

<button on:click={() => progress.set(0.5)}> 50% </button>

<button on:click={() => progress.set(0.75)}> 75% </button>

<button on:click={() => progress.set(1)}> 100% </button>

<br /><br /><br />

<slot />

{#if isRendered}
	<AnotherComp duration={2000} />
{/if}

<style>
	progress {
		display: block;
		width: 100%;
	}
</style>
