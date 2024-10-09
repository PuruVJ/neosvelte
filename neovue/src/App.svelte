<script>
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import AnotherComp from './AnotherComp.svelte';

	import { flip } from 'svelte/animate';
	import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';
	import {
		backIn,
		backInOut,
		backOut,
		bounceIn,
		bounceInOut,
		bounceOut,
		circIn,
		circInOut,
		circOut,
		cubicIn,
		cubicInOut,
		cubicOut,
		elasticIn,
		elasticInOut,
		elasticOut,
		expoIn,
		expoInOut,
		expoOut,
		linear,
		quadIn,
		quadInOut,
		quadOut,
	} from 'svelte/easing';
	import { spring, tweened } from 'svelte/motion';

	export let duration = 1000;
	export let initialVal = 0.4;

	/** @type {() => void}*/
	export let callback = () => {};

	console.log(callback);

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

<progress value={$progress}></progress>

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
