<script setup lang="ts">
import AnotherComp from './AnotherComp.svelte?vue';
import App from './App.svelte?vue';
</script>

<template>
	<App :duration="1000" :initialVal="0.4" :callback="() => console.log('Hello world')" />
	<AnotherComp />
</template>
