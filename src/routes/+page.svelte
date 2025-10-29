<script lang="ts">
	import { onMount } from 'svelte';
	import Letter from '../components/letter.svelte';
	import Rsvp from '../components/rsvp.svelte';
	import DateSection from '../components/DateSection.svelte';
	import Account from '../components/account.svelte';
	import Cover from '../components/cover.svelte';
	import Location from '../components/location.svelte';
	import type { PageProps } from './$types';
	import Gallery from '../components/gallery.svelte';
	import Info from '../components/info.svelte';

	let { form }: PageProps = $props();

	onMount(() => {
		// 🔒 마우스 오른쪽 버튼 방지
		document.addEventListener('contextmenu', (e) => e.preventDefault());

		// 🔒 텍스트 드래그 방지
		document.addEventListener('selectstart', (e) => e.preventDefault());

		// 🔒 복사(Ctrl+C) 방지
		document.addEventListener('copy', (e) => {
			e.preventDefault();
			alert('복사할 수 없습니다.');
		});

		// 🔒 개발자 도구(F12, Ctrl+Shift+I 등) 방지
		document.addEventListener('keydown', (e) => {
			if (e.key === 'F12') e.preventDefault();
			if (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) e.preventDefault();
			if (e.ctrlKey && e.key.toLowerCase() === 'u') e.preventDefault();
		});
	});
</script>

<Cover />
<Letter />
<Rsvp {form} />
<Info />
<Account />
<DateSection />
<Gallery />
<!--<Calendar />-->
<Location />
