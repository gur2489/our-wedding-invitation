<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { localeStore } from '../i18n.svelte';
	import { LoaderCircle } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import rsvpDeco from '$lib/assets/rsvp-deco.svg';

	let { form } = $props();

	let showModal = $state(false);
	let showBusModal = $state(false);
	let rsvp = $state<'yes' | 'no' | null>(null);
	let rsvpBus = $state<'yes' | 'no' | null>(null);
	let submitting = $state(false);
	let submittingBus = $state(false);
	let formName = $state('');
	let formNameBus = $state('');

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function openBusModal() {
		showBusModal = true;
	}

	function closeBusModal() {
		showBusModal = false;
	}

	function selectRsvp(option: 'yes' | 'no') {
		rsvp = option;
	}

	function selectRsvpBus(option: 'yes' | 'no') {
		rsvpBus = option;
	}
</script>

<!-- 참석 여부 섹션 -->
<section class="rsvp">
	<div class="header">
		<div class="icon">👰</div>
		<h2 class="title">참석 & 대절 버스 탑승 여부 회신</h2>
		<p class="sub-title">
			오는 부분을 귀하게 모실 수 있도록<br />
			참석 의사를 전달 부탁드립니다.
		</p>
	</div>

	<button class="open-modal-button" onclick={openModal}>
		참석여부 전달하기
	</button>
</section>

<!-- 참석 여부 모달 -->
{#if showModal}
	<div class="modal-overlay" onclick={closeModal}>
		<div class="modal-content" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h3 class="modal-title">참석 의사 전달</h3>
				<button class="modal-close" onclick={closeModal}>×</button>
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
								formName = '';
								closeModal();
							}
						});
					};
				}}
			>
				<!-- 구분 -->
				<div class="form-group">
					<label class="form-label">구분</label>
					<div class="button-group">
						<button
							type="button"
							class="option-button"
							class:active={rsvp === 'yes'}
							onclick={() => selectRsvp('yes')}
						>
							신랑측
						</button>
						<button
							type="button"
							class="option-button"
							class:active={rsvp === 'no'}
							onclick={() => selectRsvp('no')}
						>
							신부측
						</button>
					</div>
				</div>

				<!-- 성함 -->
				<div class="form-group">
					<label class="form-label">성함</label>
					<input
						class="form-input"
						name="fullname"
						bind:value={formName}
						placeholder=""
					/>
				</div>

				<!-- 참석인원 -->
				<div class="form-group">
					<label class="form-label">참석인원</label>
					<input
						class="form-input"
						type="text"
						placeholder="본인 포함 총 참석인원"
					/>
				</div>

				<!-- 동행인 -->
				<div class="form-group">
					<label class="form-label">동행인</label>
					<input
						class="form-input"
						type="text"
						placeholder="함께 오시는 분 성함"
					/>
				</div>

				<!-- 식사여부 -->
				<div class="form-group">
					<label class="form-label">식사여부</label>
					<div class="button-group">
						<button type="button" class="option-button small">
							예정
						</button>
						<button type="button" class="option-button small">
							안함
						</button>
						<button type="button" class="option-button small">
							미정
						</button>
					</div>
				</div>

				<button class="submit-button" type="submit" disabled={submitting}>
					{#if submitting}
						<div class="spinning">
							<LoaderCircle />
						</div>
					{:else}
						참석 의사 전달하기
					{/if}
				</button>
			</form>

			<div class="submit-message">
				{#if form?.success}
					<p class="success">전송이 완료되었습니다.</p>
				{/if}
				{#if form?.emailError}
					<p class="error">전송에 실패했습니다.</p>
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- 대절버스 탑승 여부 섹션 -->
<section class="rsvp rsvp-bus">
	<div class="header">
		<div class="icon">🚌</div>
		<h2 class="title">대절 버스 탑승 여부</h2>
		<p class="sub-title">
			편안한 이동을 위해 대절 버스를<br />
			준비했습니다. 탑승 의사를 전달해주세요.
		</p>
	</div>

	<button class="open-modal-button" onclick={openBusModal}>
		탑승여부 전달하기
	</button>
</section>

<!-- 대절버스 모달 -->
{#if showBusModal}
	<div class="modal-overlay" onclick={closeBusModal}>
		<div class="modal-content" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h3 class="modal-title">대절 버스 탑승 여부</h3>
				<button class="modal-close" onclick={closeBusModal}>×</button>
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
								formNameBus = '';
								closeBusModal();
							}
						});
					};
				}}
			>
				<!-- 구분 -->
				<div class="form-group">
					<label class="form-label">구분</label>
					<div class="button-group">
						<button
							type="button"
							class="option-button"
							class:active={rsvpBus === 'yes'}
							onclick={() => selectRsvpBus('yes')}
						>
							탑승
						</button>
						<button
							type="button"
							class="option-button"
							class:active={rsvpBus === 'no'}
							onclick={() => selectRsvpBus('no')}
						>
							개별이동
						</button>
					</div>
				</div>

				<!-- 성함 -->
				<div class="form-group">
					<label class="form-label">성함</label>
					<input
						class="form-input"
						name="fullname_b"
						bind:value={formNameBus}
						placeholder=""
					/>
				</div>

				<!-- 탑승인원 -->
				<div class="form-group">
					<label class="form-label">탑승인원</label>
					<input
						class="form-input"
						type="text"
						placeholder="본인 포함 총 탑승인원"
					/>
				</div>

				<!-- 탑승위치 -->
				<div class="form-group">
					<label class="form-label">탑승위치</label>
					<input
						class="form-input"
						type="text"
						placeholder="탑승하실 위치를 입력해주세요"
					/>
				</div>

				<button class="submit-button" type="submit" disabled={submittingBus}>
					{#if submittingBus}
						<div class="spinning">
							<LoaderCircle />
						</div>
					{:else}
						탑승 의사 전달하기
					{/if}
				</button>
			</form>

			<div class="submit-message">
				{#if form?.successB}
					<p class="success">전송이 완료되었습니다.</p>
				{/if}
				{#if form?.emailErrorB}
					<p class="error">전송에 실패했습니다.</p>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	section.rsvp {
		padding: 1.5em 3.5em;
		text-align: center;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.icon {
		font-size: 3rem;
		margin-bottom: 1.5rem;
	}

	h2.title {
		color: #333;
		font-size: 1.1rem;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	p.sub-title {
		font-size: 0.9rem;
		color: #666;
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.open-modal-button {
		background: white;
		border: 1.5px solid #d4b896;
		border-radius: 50px;
		padding: 1rem 2rem;
		cursor: pointer;
		font-size: 1rem;
		color: #333;
		max-width: 26rem;
		width: 100%;
		margin: 0 auto;
		transition: all 0.2s ease;
	}

	.open-modal-button:hover {
		background: #fdfcfb;
		transform: translateY(-2px);
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal-content {
		background: white;
		border-radius: 12px;
		padding: 0;
		max-width: 28rem;
		width: 100%;
		max-height: 85vh;
		overflow-y: auto;
		position: relative;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 1.5rem 1rem;
		border-bottom: 1px solid #f0f0f0;
	}

	.modal-title {
		font-size: 1.1rem;
		font-weight: 500;
		color: #333;
		margin: 0;
	}

	.modal-close {
		background: none;
		border: none;
		font-size: 2rem;
		color: #999;
		cursor: pointer;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	.modal-close:hover {
		color: #333;
	}

	.rsvp-form {
		padding: 1.5rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-label {
		display: block;
		font-size: 0.9rem;
		color: #333;
		margin-bottom: 0.75rem;
		font-weight: 500;
		text-align: left;
	}

	.form-input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		font-size: 0.95rem;
		background: #fafafa;
	}

	.form-input:focus {
		outline: none;
		border-color: #b8a789;
		background: white;
	}

	.form-input::placeholder {
		color: #999;
	}

	.button-group {
		display: flex;
		gap: 0.5rem;
	}

	.option-button {
		flex: 1;
		padding: 0.75rem;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		background: white;
		color: #666;
		cursor: pointer;
		font-size: 0.95rem;
		transition: all 0.2s ease;
	}

	.option-button.small {
		flex: 1;
	}

	.option-button.active {
		background: #8fa9d4;
		color: white;
		border-color: #8fa9d4;
	}

	.option-button:hover:not(.active) {
		background: #f5f5f5;
	}

	.submit-button {
		width: 100%;
		padding: 1rem;
		background-color: #d4b896;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		margin-top: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.submit-button:hover:not([disabled]) {
		background-color: #c4a886;
	}

	.submit-button[disabled] {
		background-color: #e5d5c0;
		cursor: not-allowed;
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
		padding: 0 1.5rem 1.5rem;
		min-height: 1.5rem;
		text-align: center;

		p.success {
			color: #4caf50;
			font-size: 0.9rem;
		}

		p.error {
			color: #f44336;
			font-size: 0.9rem;
		}
	}
</style>