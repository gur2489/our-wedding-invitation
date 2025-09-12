<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import { localeStore } from '../i18n.svelte';

	// Props로 텍스트들을 받아서 재사용 가능하게 만들기
	let { 
		rsvp = $bindable(), 
		clearForm,
		selectText = "참석여부 선택",
		yesText = "참석합니다.",
		noText = "참석하지 못합니다."
	} = $props();

	let isOpen = $state(false);

	function selectOption(option: 'yes' | 'no') {
		rsvp = option;
		isOpen = false;
		clearForm();
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}
</script>


<div class="rsvp-select">
	<button
		type="button"
		class="select-button {localeStore.locale}"
		class:selected={rsvp}
		onclick={toggleDropdown}
	>
		<span>
			{rsvp === 'yes' ? yesText : rsvp === 'no' ? noText : selectText}
		</span>
		<ChevronDown class="chevron {isOpen ? 'rotated' : ''}" />
	</button>
	
	{#if isOpen}
		<div class="select-options">
			<button
				type="button"
				class="option {localeStore.locale}"
				onclick={() => selectOption('yes')}
			>
				{yesText}
			</button>
			<button
				type="button"
				class="option {localeStore.locale}"
				onclick={() => selectOption('no')}
			>
				{noText}
			</button>
		</div>
	{/if}
</div>

<style>
	/* 기존 스타일 유지 */
	.rsvp-select {
		position: relative;
		width: 100%;
	}
	
	.select-button {
		width: 100%;
		padding: 1rem;
		border: 1px solid #ddd;
		background: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
	}
	
	.select-button.selected {
		border-color: #007bff;
		background-color: #f8f9fa;
	}
	
	.select-options {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #ddd;
		border-top: none;
		z-index: 10;
	}
	
	.option {
		width: 100%;
		padding: 1rem;
		border: none;
		background: white;
		text-align: left;
		cursor: pointer;
	}
	
	.option:hover {
		background-color: #f8f9fa;
	}
	
	.chevron {
		transition: transform 0.2s;
	}
	
	.chevron.rotated {
		transform: rotate(180deg);
	}
</style>
