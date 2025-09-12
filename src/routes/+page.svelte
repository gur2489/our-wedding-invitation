<script lang="ts">
	import Calendar from '../components/calendar.svelte';
	import Letter from '../components/letter.svelte';
	import Rsvp from '../components/rsvp.svelte';
	import DateSection from '../components/DateSection.svelte';
	import Account from '../components/account.svelte';
	import Cover from '../components/cover.svelte';
	import Location from '../components/location.svelte';
	import type { PageProps } from './$types';
	import Gallery from '../components/gallery.svelte';

	let { form }: PageProps = $props();
</script>

<Cover />
<Letter />
<Rsvp {form} />
<DateSection />
<Account bgColor="beige" />
<Gallery />
<Calendar />
<Location />
