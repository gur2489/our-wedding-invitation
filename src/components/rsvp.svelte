<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { localeStore } from '../i18n.svelte';
	import { LoaderCircle } from '@lucide/svelte';
	import Hug from '$lib/assets/icons/hug.png';
	import emailjs from '@emailjs/browser';

	let { form } = $props();

	let showModal = $state(false);
	let rsvp = $state<'yes' | 'no' | null>(null);
	let rsvpBus = $state<'yes' | 'no' | null>(null);
	let mealOption = $state<'yes' | 'no' | 'undecided' | null>(null);
	let submitting = $state(false);
	let formName = $state('');
	let busLocation = $state('');
	let busPassengers = $state('');
	let submitMessage = $state<{type: 'success' | 'error', text: string} | null>(null);

	// EmailJS 설정 (실제 값으로 교체 필요)
	const EMAILJS_SERVICE_ID = 'service_pznskvk';
	const EMAILJS_TEMPLATE_ID = 'template_qlx264m';
	const EMAILJS_PUBLIC_KEY = 'wYQ2uZNRB1EHBmSs8';

	function openModal() {
		showModal = true;
		submitMessage = null;
	}

	function closeModal() {
		showModal = false;
		rsvp = null;
		rsvpBus = null;
		mealOption = null;
		formName = '';
		busLocation = '';
		busPassengers = '';
		submitMessage = null;
	}

	function selectRsvp(option: 'yes' | 'no') {
		rsvp = option;
	}

	function selectRsvpBus(option: 'yes' | 'no') {
		rsvpBus = option;
	}

	function selectMealOption(option: 'yes' | 'no' | 'undecided') {
		mealOption = option;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		
		if (!rsvp || !formName || !mealOption || !rsvpBus) {
			submitMessage = {type: 'error', text: '모든 필수 항목을 입력해주세요.'};
			return;
		}

		submitting = true;
		submitMessage = null;

		const side = rsvp === 'yes' ? '신랑측' : '신부측';
		const mealStatus = mealOption === 'yes' ? '예정' : mealOption === 'no' ? '안함' : '미정';
		const busStatus = rsvpBus === 'yes' ? '탑승' : '개별이동';

		const templateParams = {
			fullname: formName,
			side: side,
			meal: mealStatus,
			bus: busStatus,
			bus_location: rsvpBus === 'yes' ? busLocation : '-',
			bus_passengers: rsvpBus === 'yes' ? busPassengers + '명' : '-'
		};

		try {
			await emailjs.send(
				EMAILJS_SERVICE_ID,
				EMAILJS_TEMPLATE_ID,
				templateParams,
				EMAILJS_PUBLIC_KEY
			);

			submitMessage = {type: 'success', text: '전송이 완료되었습니다.'};
			
			// 3초 후 모달 닫기
			setTimeout(() => {
				closeModal();
			}, 2000);
		} catch (error) {
			console.error('Email sending failed:', error);
			submitMessage = {type: 'error', text: '전송에 실패했습니다. 다시 시도해주세요.'};
		} finally {
			submitting = false;
		}
	}
</script>

<!-- 참석 여부 섹션 -->
<section class="rsvp">
	<div class="header">
		<img src={Hug} class="icon-img" alt="Hug icon">
		<h2 class="title kr">참석 & 대절 버스 탑승 여부 회신</h2>
		<p class="sub-title kr">
			모든 분들을 귀하게 모실 수 있도록<br />
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
				<h3 class="modal-title">참석 & 대절 버스 탑승 여부 의사 전달</h3>
				<button class="modal-close" onclick={closeModal}>×</button>
			</div>

			<form class="rsvp-form" onsubmit={handleSubmit}>
				<!-- 구분 -->
				<div class="form-group">
					<label class="form-label">구분</label>
					<div class="button-group">
						<button
							type="button"
							class="option-button l"
							class:active={rsvp === 'yes'}
							onclick={() => selectRsvp('yes')}
						>
							신랑측
						</button>
						<button
							type="button"
							class="option-button r"
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
						bind:value={formName}
						placeholder="성함을 입력해주세요"
						required
					/>
				</div>

				<!-- 식사여부 -->
				<div class="form-group">
					<label class="form-label">식사여부</label>
					<div class="button-group">
						<button 
							type="button" 
							class="option-button small"
							class:active={mealOption === 'yes'}
							onclick={() => selectMealOption('yes')}
						>
							예정
						</button>
						<button 
							type="button" 
							class="option-button small"
							class:active={mealOption === 'no'}
							onclick={() => selectMealOption('no')}
						>
							안함
						</button>
						<button 
							type="button" 
							class="option-button small"
							class:active={mealOption === 'undecided'}
							onclick={() => selectMealOption('undecided')}
						>
							미정
						</button>
					</div>
				</div>

				<!-- 버스 탑승 여부 -->
				<div class="form-group">
					<label class="form-label">버스 탑승 여부</label>
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

				<!-- 탑승위치 (버스 탑승 시에만 표시) -->
				{#if rsvpBus === 'yes'}
					<div class="form-group">
						<label class="form-label">탑승위치</label>
						<input
							class="form-input"
							type="text"
							bind:value={busLocation}
							placeholder="탑승하실 위치를 입력해주세요"
						/>
					</div>

					<!-- 탑승인원 -->
					<div class="form-group">
						<label class="form-label">탑승인원</label>
						<input
							class="form-input"
							type="number"
							min="1"
							bind:value={busPassengers}
							placeholder="본인 포함 총 탑승인원"
						/>
					</div>
				{/if}

				<button 
					class="submit-button" 
					type="submit" 
					disabled={submitting || !rsvp || !formName || !mealOption || !rsvpBus}
				>
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
				{#if submitMessage}
					<p class={submitMessage.type}>{submitMessage.text}</p>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">

	.icon-img{
		width:50px;
		display: inline-block;
		margin: 3rem 0 1rem;
	}

	section.rsvp {
		padding: 0rem 1.5rem 3rem;
		text-align: center;
		background-color: #fff;
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
		color: #4e4e4e;
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	p.sub-title {
		font-size: 0.9rem;
		color: #666;
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.open-modal-button {
		background: #fdfdf5;
		border: 1.5px solid #ff6666;
		border-radius: 50px;
		padding: .5rem 2rem;
		cursor: pointer;
		transition: all .2s ease;
		width: 65%;
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
		border-color: #999;
		background: white;
		transition: all 0.2s ease;
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
		background: #9B9B9B;
		color: white;
		border-color: #9B9B9B;
	}

	.option-button.l.active {
		background: #8fa9d4;
		color: white;
		border-color: #8fa9d4;
	}

	.option-button.r.active {
		background: #ffc2e5;
		color: white;
		border-color: #ffc2e5;
	}

	.option-button:hover:not(.active) {
		background: #f5f5f5;
	}

	.submit-button {
		width: 100%;
		padding: 1rem;
		background-color: #ffc2e5;
		color: #fff;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		margin-top: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 0.2s ease;
	}

	.submit-button:hover:not([disabled]) {
		transition: all 0.2s ease;
		background-color: #f9d3e9;
	}

	.submit-button[disabled] {
		background-color: #faeef5;
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