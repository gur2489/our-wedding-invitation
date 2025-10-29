<script lang="ts">
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

	document.addEventListener('contextmenu', function (e) {
		e.preventDefault();
	});

	// 텍스트 드래그 방지
	document.addEventListener('selectstart', function (e) {
		e.preventDefault();
	});

	// 복사(Ctrl+C) 방지
	document.addEventListener('copy', function (e) {
		e.preventDefault();
	});

	// 개발자 도구(F12, Ctrl+Shift+I 등) 방지
	document.addEventListener('keydown', function (e) {
		// F12
		if (e.key === 'F12') {
			e.preventDefault();
		}
		// Ctrl + Shift + I (개발자 도구)
		if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') {
			e.preventDefault();
		}
		// Ctrl + Shift + J (콘솔)
		if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'j') {
			e.preventDefault();
		}
		// Ctrl + U (소스보기)
		if (e.ctrlKey && e.key.toLowerCase() === 'u') {
			e.preventDefault();
		}
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
