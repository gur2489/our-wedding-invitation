<script lang="ts">
	import letterBottom from '$lib/assets/letter-bottom.jpg';
	import { _ } from 'svelte-i18n';
	import { localeStore } from '../i18n.svelte';
	import Ring from '$lib/assets/icons/ring.png';

	const nameDivider = `
    <svg width="3" height="3" viewBox="0 0 3 3" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="1.5" cy="1.5" r="1.5" fill="#B99493"/>
    </svg>`;
</script>

<section class="letter">
	<div class="header">
		<img src={Ring} class="icon-img">
		<p class="sub-title {localeStore.locale}">{$_('letter.sub_title')}</p>
	</div>

	<div class="letter-container">
		<p class="letter {localeStore.locale}">{$_('letter.letter_content')}</p>
		<div class="couple-section {localeStore.locale}">
			<div class="welcome-text">welcome to our wedding!</div>
			
			<div class="couple-container">
				<div class="groom">
					<div class="name">임재혁</div>
					<div class="parents">임원섭·윤지영의 아들</div>
				</div>
				
				<div class="heart-divider">❤</div>
				
				<div class="bride">
					<div class="name">서승연</div>
					<div class="parents">서홍교·신영채의 딸</div>
				</div>
			</div>
		</div>
	</div>
</section>
<div class="img-wrapper">
	<img class="letter-bottom" src={letterBottom} alt="letter bottom" />
</div>
<style lang="scss">

	.icon-img{
		width:50px;
		display: inline-block;
		margin: 0rem 0 1rem;
	}

	section.letter {
		padding: 4.5em 3.5em 3em 3.5em;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2em;
	}

	img.header-deco {
		width: 12em;
		margin-bottom: 0.8em;
	}

	.title {
		color: $primary-color;
		letter-spacing: 1px;

		&.kr {
			@extend .title-font-kr;
			margin-bottom: 0.4em;
		}

		&.en {
			@extend .title-font-en;
			margin-bottom: 0.2em;
		}
	}

	.sub-title {
		color: $bk;
		&.kr {
			font-weight: 500;
			font-size: 1rem;
		}

		&.en {
			font-size: 1.3rem;
			font-weight: 600;
		}
	}

	p.letter {
		color: $gr;
		text-align: center;
		white-space: pre-line;
		&.kr {
			line-height: 1.5em;
			font-size: 0.9rem;
		}
		&.en {
			line-height: 1.8em;
			font-size: 1.2rem;
		}
	}

	.letter-signature {
		margin-top: 2em;

		p {
			text-align: right;
			font-size: 1.2rem;
		}
	}

	.letter-bottom {
			width: 100%;
			display: block;
	}

	@media (max-width: 600px) {
		.img-wrapper {
			width:100%;
		}
		
	}

	@media (min-width: 700px) {
		.img-wrapper {
			max-width: 600px;
        	margin: auto;
		}
	}
	

	.couple-section {
		max-width: 600px;
		margin: 0 auto;
		padding: 40px 0 10px;
	}

	@font-face {
		font-family: 'AstonScript';
		src: url('/src/lib/assets/font/AstonScript.ttf') format('truetype');
		font-weight: normal;
		font-style: normal;
	}

	.welcome-text {
		font-family: 'AstonScript', cursive;
		font-size: 1rem;
		text-align: center;
		margin-bottom: 30px;
		color: #333;
	}

	.couple-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
	}

	.groom, .bride {
		flex: 1;
		text-align: center;
	}

	.name {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 5px;
		color: #333;
		letter-spacing: 2px;
	}

	.parents {
		font-size: .7rem;
		color: #666;
		line-height: 1.6;
	}

	.heart-divider {
		flex-shrink: 0;
		font-size: 1rem;
		color: #e74c3c;
		animation: heartbeat 1.5s ease-in-out infinite;
	}
</style>
