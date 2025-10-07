<script lang="ts">
	import '/src/styles/global.scss';
	import '/src/i18n.svelte.ts';
	import { localeStore } from '../i18n.svelte';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	let { children } = $props();

	let localeLoaded = $derived(!localeStore.isLoading && localeStore.locale);
	let title = $state('');
	onMount(() => {
		document.body.classList.add('loaded');
		if (localeLoaded) {
			title = $_('meta.title');
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Noto+Serif+KR:wght@200..900&family=Sacramento&display=swap"
	/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
	/>
	<meta property="og:title" content="Jaehyuk & Seungyeon's Wedding" />
	<meta property="og:description" content="Please join us on our most special day!" />
	<meta property="og:image" content="https://emily-marries-anthony.com/preview.jpg" />
	<meta property="og:url" content="https://ad23ffef.our-wedding-invitation-ee0.pages.dev/" />
	<meta property="og:type" content="website" />
</svelte:head>

{#if localeLoaded}
	{@render children()}
{/if}

<style lang="scss">
</style>
