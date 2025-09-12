<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { localeStore } from '../i18n.svelte';
	import { LoaderCircle } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import RsvpSelect from './rsvp-select.svelte';
	import rsvpDeco from '$lib/assets/rsvp-deco.svg';
	import RsvpAccordion from './rsvp-accordion.svelte';

	let { form } = $props();

	let rsvp = $state<'yes' | 'no' | null>(null);
	let rsvpBus = $state<'yes' | 'no' | null>(null);
	let submitting = $state(false);
	let submittingBus = $state(false);

	function clearValidationMessage(formInput: 'name' | 'rsvp' | 'name_b' | 'rsvp_b') {
		if (formInput === 'name' && form?.missingName) {
			form = null;
		}

		if (formInput === 'rsvp' && form?.missingRsvp) {
			form = null;
		}

		if (formInput === 'name_b' && form?.missingNameB) {
			form = null;
		}

		if (formInput === 'rsvp_b' && form?.missingRsvpB) {
			form = null;
		}
	}
</script>

<section class="rsvp">
	<div class="header">
		<img class="header-deco" src={rsvpDeco} alt="rsvp header deco" />
		<h2 class="title {localeStore.locale}">{$_('rsvp.title')}</h2>
		<p class="sub-title {localeStore.locale}">
			{$_('rsvp.reply_by')}
		</p>
	</div>

	<form
		class="rsvp-form"
		method="POST"
		action="?/rsvp"
		use:enhance={({ formData }) => {
			submitting = true;
			formData.append('rsvp', rsvp ?? '');
			return ({ update, result }) => {
				update({}).finally(() => {
					submitting = false;
					if (result.status === 200) {
						rsvp = null;
					}
				});
			};
		}}
	>
		<input
			class="fullname {localeStore.locale}"
			name="fullname"
			value={form?.name ?? ''}
			placeholder={$_('rsvp.fullname_placeholder')}
			onfocus={() => clearValidationMessage('name')}
		/>
		<div class="select-container">
			<RsvpSelect bind:rsvp clearForm={() => clearValidationMessage('rsvp')} />
		</div>
		<button class="send {localeStore.locale}" type="submit" disabled={submitting}>
			{#if submitting}
				<div class="spinning">
					<LoaderCircle />
				</div>
			{:else}
				{$_('rsvp.send')}
			{/if}
		</button>
	</form>
	<div class="submit-message">
		{#if form?.success}
			<p class="success {localeStore.locale}">
				{$_('rsvp.email_success')}
			</p>
		{/if}
		{#if form?.emailError}
			<p class="error {localeStore.locale}">
				{$_('rsvp.email_error')}
			</p>
		{/if}
		{#if form?.missingName}
			<p class="error {localeStore.locale}">
				{$_('rsvp.missing_name_error')}
			</p>
		{/if}
		{#if form?.missingRsvp}
			<p class="error {localeStore.locale}">
				{$_('rsvp.missing_rsvp_error')}
			</p>
		{/if}
	</div>

	<!--<div class="accordion-container">
		<RsvpAccordion />
	</div>-->
</section>

<!-- 탑승여부 섹션 -->
<section class="rsvp rsvp-bus">
	<div class="header">
		<img class="header-deco" src={rsvpDeco} alt="rsvp header deco" />
		<h2 class="title {localeStore.locale}">{$_('rsvp.title_b')}</h2>
		<p class="sub-title {localeStore.locale}">
			{$_('rsvp.reply_by_b')}
		</p>
	</div>

	<form
		class="rsvp-form"
		method="POST"
		action="?/rsvpBus"
		use:enhance={({ formData }) => {
			submittingBus = true;
			formData.append('rsvp_b', rsvpBus ?? '');
			return ({ update, result }) => {
				update({}).finally(() => {
					submittingBus = false;
					if (result.status === 200) {
						rsvpBus = null;
					}
				});
			};
		}}
	>
		<input
			class="fullname {localeStore.locale}"
			name="fullname_b"
			value={form?.nameB ?? ''}
			placeholder={$_('rsvp.fullname_placeholder_b')}
			onfocus={() => clearValidationMessage('name_b')}
		/>
		<div class="select-container">
			<RsvpSelect 
				bind:rsvp={rsvpBus} 
				clearForm={() => clearValidationMessage('rsvp_b')}
				selectText={$_('rsvp.select_b.select_attendance_b')}
				yesText={$_('rsvp.select_b.yes_b')}
				noText={$_('rsvp.select_b.no_b')}
			/>
		</div>
		<button class="send {localeStore.locale}" type="submit" disabled={submittingBus}>
			{#if submittingBus}
				<div class="spinning">
					<LoaderCircle />
				</div>
			{:else}
				{$_('rsvp.send_b')}
			{/if}
		</button>
	</form>
	
	<div class="submit-message">
		{#if form?.successB}
			<p class="success {localeStore.locale}">
				{$_('rsvp.email_success_b')}
			</p>
		{/if}
		{#if form?.emailErrorB}
			<p class="error {localeStore.locale}">
				{$_('rsvp.email_error_b')}
			</p>
		{/if}
		{#if form?.missingNameB}
			<p class="error {localeStore.locale}">
				{$_('rsvp.missing_name_error_b')}
			</p>
		{/if}
		{#if form?.missingRsvpB}
			<p class="error {localeStore.locale}">
				{$_('rsvp.missing_rsvp_error_b')}
			</p>
		{/if}
	</div>
</section>

<style lang="scss">
	section.rsvp {
		padding: 4.5em 3.5em;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	img.header-deco {
		width: 4.5em;
		margin-bottom: 0.8em;
	}

	h2.title {
		color: $primary-color;

		&.kr {
			@extend .title-font-kr;
			letter-spacing: 1px;
		}

		&.en {
			@extend .title-font-en;
			letter-spacing: 3px;
		}
	}

	p.sub-title {
		&.kr {
			margin-top: 0.9em;
			font-size: 0.9rem;
		}

		&.en {
			margin-top: 0.5em;
			font-size: 1.2rem;
		}
	}

	form.rsvp-form {
		margin-top: 3em;
	}

	input.fullname {
		padding: 0.4em 0.8em;
		width: 100%;
		border: 1px solid $white-2;
		border-radius: 4px;
		letter-spacing: 0.02em;

		&:active,
		&:focus {
			@extend .input-focused;
		}
		&::placeholder {
			color: $font-color-light;
		}
		&.kr::placeholder {
			font-size: 0.9rem;
		}
	}

	.select-container {
		margin-top: 1em;
	}

	button.send {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 3em;
		height: 2.5em;
		width: 100%;
		background-color: $primary-color;
		border-radius: 4px;
		color: $white;
		letter-spacing: 0.05em;

		&[disabled] {
			background-color: $primary-color-light;
			cursor: not-allowed;
		}

		&:active {
			background-color: $primary-color-dark;
		}

		&.kr {
			font-weight: 600;
		}

		&.en {
			font-weight: 700;
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(359deg);
		}
	}

	.spinning {
		display: flex;
		justify-content: center;
		align-items: center;
		animation: spin 1s linear infinite;
	}

	.submit-message {
		margin-top: 0.5em;
		height: 1.5em;

		.kr {
			font-size: 0.9rem;
		}

		.en {
			font-size: 1.1rem;
		}

		p.success {
			color: $green-1;
		}

		p.error {
			color: $red-1;
		}
	}

	.accordion-container {
		margin-top: 2em;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
