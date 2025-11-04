<script lang="ts">
	import { browser } from '$app/environment';
	import { weddingConfig } from '$lib/config/wedding-config';
	import type { AccountInfo } from '$lib/types/wedding';
	import { writable } from 'svelte/store';
	import Cheers from '$lib/assets/icons/cheers.png';

	type AccountPerson = 'groom' | 'bride' | 'groomFather' | 'groomMother' | 'brideFather' | 'brideMother';
	type AccountSide = 'groom' | 'bride';

	export let bgColor: 'white' | 'beige' = 'white';

	const copyStatus = writable<Record<AccountPerson, boolean>>({
		groom: false,
		bride: false,
		groomFather: false,
		groomMother: false,
		brideFather: false,
		brideMother: false,
	});

	const urlCopied = writable(false);
	const showModal = writable(false);
	const modalSide = writable<AccountSide | null>(null);

	const openModal = (side: AccountSide) => {
		modalSide.set(side);
		showModal.set(true);
	};

	const closeModal = () => {
		showModal.set(false);
		modalSide.set(null);
	};

	const copyToClipboard = (text: string, person: AccountPerson) => {
		if (!browser) return;
		navigator.clipboard.writeText(text).then(() => {
			copyStatus.update((s) => ({ ...s, [person]: true }));
			setTimeout(() => copyStatus.update((s) => ({ ...s, [person]: false })), 2000);
		});
	};

	const copyWebsiteUrl = () => {
		if (!browser) return;
		const url = window.location.href;
		navigator.clipboard.writeText(url).then(() => {
			urlCopied.set(true);
			setTimeout(() => urlCopied.set(false), 2000);
		});
	};

	const shareWebsite = async () => {
		if (!browser) return;
		const shareData = {
			title: weddingConfig.meta.title,
			text: `${weddingConfig.invitation.groom.name} ♥ ${weddingConfig.invitation.bride.name}의 결혼식에 초대합니다`,
			url: window.location.href,
		};
		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else {
				copyWebsiteUrl();
				alert('이 브라우저는 공유 기능을 지원하지 않습니다. URL이 복사되었습니다.');
			}
		} catch (err) {
			console.error('공유 실패:', err);
		}
	};

	const getPersonName = (person: AccountPerson): string => {
		switch (person) {
			case 'groom': return weddingConfig.invitation.groom.name;
			case 'bride': return weddingConfig.invitation.bride.name;
			case 'groomFather': return weddingConfig.invitation.groom.father;
			case 'groomMother': return weddingConfig.invitation.groom.mother;
			case 'brideFather': return weddingConfig.invitation.bride.father;
			case 'brideMother': return weddingConfig.invitation.bride.mother;
			default: return '';
		}
	};

	const renderAccountRow = (accountInfo: AccountInfo, person: AccountPerson, title: string) => {
		const personName = getPersonName(person);
		if (!personName || personName.trim() === '') return null;
		const copyText = `${accountInfo.bank} ${accountInfo.number} ${accountInfo.holder}`;
		return {
			title,
			bank: accountInfo.bank,
			number: accountInfo.number,     // 계좌번호
			holder: accountInfo.holder,     // 예금주
			person,
			copyText
		};
	};
</script>

<section class="account-section {bgColor}">
	<img src={Cheers} class="icon-img">
	<h2 class="section-title kr">축하의 마음을 전해주실 분들을 위해 안내드립니다.</h2>

	<div class="account-cards">
		<button class="account-card" on:click={() => openModal('groom')}>
			<span class="card-text">신랑 측 계좌번호</span>
		</button>

		<button class="account-card" on:click={() => openModal('bride')}>
			<span class="card-text">신부 측 계좌번호</span>
		</button>
	</div>
<!--
	<div class="share-container">
		<button class="share-button" on:click={copyWebsiteUrl}>
			{#if $urlCopied}복사 완료!{:else}URL 복사하기{/if}
		</button>
		<button class="share-button" on:click={shareWebsite}>
			공유하기
		</button>
	</div>
-->
</section>

{#if $showModal}
	<div class="modal-overlay" on:click={closeModal}>
		<div class="modal-content {$modalSide}" on:click|stopPropagation>
			<button class="modal-close" on:click={closeModal}>×</button>
			
			<h3 class="modal-title">{$modalSide === 'groom' ? '신랑' : '신부'} 측 계좌번호</h3>

			<div class="modal-accounts">
				{#if $modalSide === 'groom'}
					{#each [
						renderAccountRow(weddingConfig.account.groom, 'groom', '신랑'),
						renderAccountRow(weddingConfig.account.groomFather, 'groomFather', '형'),
						renderAccountRow(weddingConfig.account.groomMother, 'groomMother', '어머니')
					] as row (row?.person)}
						{#if row}
							<div class="account-row">
								<div class="account-row-title">{row.title}</div>
								<div class="account-row-info">
									<div class="account-bank">{row.bank}</div>
									<div class="account-number">{row.number}</div>
									<div class="account-holder">{row.holder}</div>
								</div>
								<button class="copy-button" on:click={() => copyToClipboard(row.copyText, row.person)}>
									{#if $copyStatus[row.person]}복사완료{:else}복사{/if}
								</button>
							</div>
						{/if}
					{/each}
				{:else}
					{#each [
						renderAccountRow(weddingConfig.account.bride, 'bride', '신부'),
						renderAccountRow(weddingConfig.account.brideFather, 'brideFather', '아버지'),
						renderAccountRow(weddingConfig.account.brideMother, 'brideMother', '어머니')
					] as row (row?.person)}
						{#if row}
							<div class="account-row">
								<div class="account-row-title">{row.title}</div>
								<div class="account-row-info">
									<div class="account-bank">{row.bank}</div>
									<div class="account-number">{row.number}</div>
									<div class="account-holder">{row.holder}</div>
								</div>
								<button class="copy-button" on:click={() => copyToClipboard(row.copyText, row.person)}>
									{#if $copyStatus[row.person]}복사완료{:else}복사{/if}
								</button>
							</div>
						{/if}
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
.account-section.white { background-color: white; }
.account-section.beige { background-color: #F8F6F2; }
.account-section { padding: 0rem 1.5rem 4rem; text-align: center;max-width: 600px;
    margin: auto; }

.icon-img{
	width:50px;
	display: inline-block;
	margin: 3rem 0 1rem;
}

.section-title {
	font-weight: 500;
	font-size: 0.9rem;
	margin-bottom: 1rem;
	line-height: 1.6;
}

.account-cards {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	max-width: 26rem;
	margin: 0 auto;
	align-items: center;
}

.account-card {
	background: #fdfdf5;
	border: 1.5px solid #ff6666;
	border-radius: 50px;
	padding: 0.5rem 2rem;
	cursor: pointer;
	transition: all 0.2s ease;
	width: 70%;
}

.account-card:hover {
	background: #fdfcfb;
	transform: translateY(-2px);
}

.card-text {
	font-size: 1rem;
	color: #333;
	font-weight: 400;
}

.share-container {
	margin-top: 2.5rem;
	display: flex;
	justify-content: center;
	gap: 1rem;
}

.share-button {
	background-color: #c4a986;
	color: white;
	border: none;
	border-radius: 4px;
	padding: 0.75rem 1.5rem;
	cursor: pointer;
	font-size: 0.95rem;
}

.share-button:hover {
	background-color: #b39c7a;
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
	padding: 2rem 1.5rem;
	max-width: 28rem;
	width: 100%;
	max-height: 80vh;
	overflow-y: auto;
	position: relative;
}

.modal-close {
	position: absolute;
	top: 1rem;
	right: 1rem;
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

.modal-title {
	font-size: 1.25rem;
	font-weight: 500;
	color: #333;
	margin-bottom: 1.5rem;
	text-align: center;
}

.modal-accounts {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.account-row {
	display: flex;
	align-items: center;
	padding: 1rem;
	border-bottom: 1px solid #f5f5f5;
	gap: 1rem;
}

.account-row:last-child {
	border-bottom: none;
}

.account-row-title {
	font-weight: 500;
	font-size: 0.95rem;
	min-width: 70px;
	text-align: left;
}

.account-row-info {
	display: flex;
	flex-direction: column;
	flex: 1;
	gap: 0.1rem;
	text-align: left;
}

.account-bank {
	font-size: 0.85rem;
	color: #666;
	white-space: nowrap;
}

.account-number {
	font-weight: 500;
	font-size: 0.85rem;
	color: #333;
	word-break: break-all;
}

.account-holder {
	font-weight: 500;
	font-size: 0.8rem;
	color: #3e3e3e;
	word-break: break-all;
}

.copy-button {
	background: transparent;
	border: 1px solid;
	padding: 0.4rem 0.8rem;
	border-radius: 4px;
	cursor: pointer;
	font-size: 0.85rem;
	white-space: nowrap;
	transition: all 0.2s ease;
}

.modal-content.groom .copy-button {
	border-color: #5FBDFF;
	color: #5FBDFF;
}
.modal-content.groom .copy-button:hover {
	background: #5FBDFF;
	color: white;
}
.modal-content.groom .account-row-title {
	color: #5FBDFF;
}


.modal-content.bride .copy-button {
	border-color: #ff6666;
	color: #ff6666;
}
.modal-content.bride .copy-button:hover {
	background: #ff6666;
	color: white;
}
.modal-content.bride .account-row-title {
	color: #ff6666;
}
</style>