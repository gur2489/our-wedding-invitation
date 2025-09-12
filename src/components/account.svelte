<script lang="ts">
	import { browser } from '$app/environment';
	import { weddingConfig } from '$lib/config/wedding-config';
	import type { AccountInfo } from '$lib/types/wedding';
	import { writable } from 'svelte/store';

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
	const expandedSide = writable<AccountSide | null>(null);

	const toggleSide = (side: AccountSide) => {
		expandedSide.update((current) => (current === side ? null : side));
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
		return { title, bank: accountInfo.bank, numberAndHolder: `${accountInfo.number} ${accountInfo.holder}`, person, copyText };
	};
</script>

<section class="account-section {bgColor}">
	<h2 class="section-title">마음 전하실 곳</h2>

	<div class="account-cards">
		<!-- 신랑측 -->
		<div class="account-card" on:click={() => toggleSide('groom')}>
			<div class="account-card-header">
				<h3 class="group-title">신랑 측 계좌번호</h3>
				<span class="expand-icon">{#if $expandedSide === 'groom'}−{:else}+{/if}</span>
			</div>

			{#if $expandedSide === 'groom'}
				<div class="account-rows-container">
					{#each [
						renderAccountRow(weddingConfig.account.groom, 'groom', '신랑'),
						renderAccountRow(weddingConfig.account.groomFather, 'groomFather', '아버지'),
						renderAccountRow(weddingConfig.account.groomMother, 'groomMother', '어머니')
					] as row (row?.person)}
						{#if row}
							<div class="account-row">
								<div class="account-row-title">{row.title}</div>
								<div class="account-row-info">
									<div class="account-bank">{row.bank}</div>
									<div class="account-number">{row.numberAndHolder}</div>
								</div>
								<button class="copy-button" on:click|stopPropagation={() => copyToClipboard(row.copyText, row.person)}>
									{#if $copyStatus[row.person]}복사 완료{:else}복사{/if}
								</button>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>

		<!-- 신부측 -->
		<div class="account-card" on:click={() => toggleSide('bride')}>
			<div class="account-card-header">
				<h3 class="group-title">신부 측 계좌번호</h3>
				<span class="expand-icon">{#if $expandedSide === 'bride'}−{:else}+{/if}</span>
			</div>

			{#if $expandedSide === 'bride'}
				<div class="account-rows-container">
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
									<div class="account-number">{row.numberAndHolder}</div>
								</div>
								<button class="copy-button" on:click|stopPropagation={() => copyToClipboard(row.copyText, row.person)}>
									{#if $copyStatus[row.person]}복사 완료{:else}복사{/if}
								</button>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="share-container">
		<button class="share-button" on:click={copyWebsiteUrl}>
			{#if $urlCopied}복사 완료!{:else}URL 복사하기{/if}
		</button>
		<button class="share-button" on:click={shareWebsite}>
			공유하기
		</button>
	</div>
</section>

<style>
.account-section.white { background-color: white; }
.account-section.beige { background-color: #F8F6F2; }
.account-section { padding: 4rem 1.5rem; text-align: center; }
.section-title { position: relative; display: inline-block; margin-bottom: 2rem; font-weight: 500; font-size: 1.5rem; }
.section-title::after {
	content: '';
	position: absolute;
	bottom: -16px;
	left: 50%;
	transform: translateX(-50%);
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background-color: #c4a986;
}
.account-cards { display: flex; flex-direction: column; gap: 1.5rem; max-width: 40rem; margin: 0 auto; }
.account-card { background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); cursor: pointer; }
.account-card:hover { box-shadow: 0 6px 10px rgba(0,0,0,0.1); }
.account-card-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; border-bottom: 1px solid #eee; }
.group-title { font-weight: 400; font-size: 1rem; color: #333; margin: 0; text-align: left; }
.expand-icon { font-size: 1.5rem; color: #c4a986; }
.account-rows-container { display: flex; flex-direction: column; }
.account-row { display: flex; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid #f5f5f5; }
.account-row:last-child { border-bottom: none; }
.account-row-title { font-weight: 500; font-size: 0.95rem; color: #c4a986; min-width: 100px; text-align: left; }
.account-row-info { display: flex; flex-direction: column; flex: 1; gap: 0.1rem; }
.account-bank { font-size: 0.85rem; color: #666; white-space: nowrap; }
.account-number { font-weight: 500; font-size: 0.95rem; color: #333; word-break: break-all; }
.copy-button { background: transparent; border: 1px solid #c4a986; color: #c4a986; padding: 0.35rem 0.5rem; border-radius: 4px; cursor: pointer; margin-left: 0.5rem; }
.copy-button:hover { background: #c4a986; color: white; }
.share-container { margin-top: 2rem; display: flex; justify-content: center; gap: 1rem; }
.share-button { background-color: #c4a986; color: white; border: none; border-radius: 4px; padding: 0.75rem 1.5rem; cursor: pointer; }
.share-button:hover { background-color: #b39c7a; }
</style>