<script lang="ts">
	import photo2 from '$lib/assets/gallery/gallery1.jpg';
	import photo4 from '$lib/assets/gallery/gallery3.jpg';
	import photo5 from '$lib/assets/gallery/gallery4.jpg';
	import photo6 from '$lib/assets/gallery/gallery5.jpg';
	import photo7 from '$lib/assets/gallery/gallery6.jpg';
	import photo8 from '$lib/assets/gallery/gallery7.jpg';
	import photo9 from '$lib/assets/gallery/gallery8.jpg';
	import photo10 from '$lib/assets/gallery/gallery9.jpg';
	import photo11 from '$lib/assets/gallery/gallery10.jpg';
	import photo12 from '$lib/assets/gallery/gallery11.jpg';
	import photo13 from '$lib/assets/gallery/gallery12.jpg';
	import photo14 from '$lib/assets/gallery/gallery13.jpg';
	import photo15 from '$lib/assets/gallery/gallery14.jpg';
	import photo16 from '$lib/assets/gallery/gallery15.jpg';
	import photo17 from '$lib/assets/gallery/gallery16.jpg';
	import photo18 from '$lib/assets/gallery/gallery17.jpg';
	import photo19 from '$lib/assets/gallery/gallery18.jpg';

	import PhotoSwipeLightBox from 'photoswipe/lightbox';
	import PhotoSwipe from 'photoswipe';
	import 'photoswipe/style.css';
	import { onMount } from 'svelte';
	import { localeStore } from '../i18n.svelte';
	import { _ } from 'svelte-i18n';
	import Camera from '$lib/assets/icons/camera.png';

	let showAll = $state(false);

	const photos = [
		{
			src: photo18,
			width: 1200,
			height: 1790
		},
		{
			src: photo11,
			width: 1200,
			height: 1790
		},
		{
			src: photo15,
			width: 2000,
			height: 1333
		},
		{
			src: photo13,
			width: 1200,
			height: 1790
		},
		{
			src: photo14,
			width: 1200,
			height: 1790
		},
		{
			src: photo16,
			width: 2259,
			height: 3456
		},
		{
			src: photo9,
			width: 1200,
			height: 1790
		},
		{
			src: photo17,
			width: 1200,
			height: 1790
		},
		{
			src: photo19,
			width: 1200,
			height: 1790
		},
		{
			src: photo7,
			width: 1200,
			height: 1800
		},
		{
			src: photo8,
			width: 1200,
			height: 1800
		},
		{
			src: photo10,
			width: 1200,
			height: 1800
		},
		{
			src: photo2,
			width: 1200,
			height: 1800
		},
		{
			src: photo4,
			width: 2000,
			height: 1333
		},
		{
			src: photo5,
			width: 1200,
			height: 1800
		},
		{
			src: photo6,
			width: 2000,
			height: 1333
		}
	];

	onMount(() => {
		const lightbox = new PhotoSwipeLightBox({
			gallery: '#gallery',
			children: 'a',
			showHideAnimationType: 'fade',
			pswpModule: PhotoSwipe
		});

		lightbox.init();

		// showAll 변경 시 재초기화는 보통 필요 없지만,
		// (숨김/표시만 바뀌므로) 안전을 위해 재초기화하려면 아래처럼 가능
		$effect(() => {
			// showAll이 바뀔 때 기존 인스턴스 재초기화 (선택적)
			lightbox.destroy();
			lightbox.init();
		});
		});

	const displayedPhotos = $derived(showAll ? photos : photos.slice(0, 10));
</script>

<section class="gallery">
	<div class="header">
		<img src={Camera} class="icon-img" alt="camera icon">
	</div>
	<div id="gallery">
		{#each photos as photo, idx}
			<a
			href={photo.src}
			class="slide"
			data-pswp-width={photo.width}
			data-pswp-height={photo.height}
			target="_blank"
			style={idx >= 10 && !showAll ? 'display:none' : ''}
			>
			{#if idx < 10 || showAll}
				<!-- 썸네일 이미지는 처음엔 10장만 보이고,
					showAll이 true면 숨겨둔 것들도 보이게 함 -->
				<img class="thumbnail" src={photo.src} alt="" />
			{/if}
			</a>
		{/each}
		</div>
	
	{#if !showAll}
		<div class="more-button-wrapper">
			<button class="more-button" onclick={() => showAll = true}>
				더보기
			</button>
		</div>
	{/if}
</section>

<style lang="scss">

	.icon-img{
		width:50px;
		display: inline-block;
		margin: 0rem 0 1rem;
	}

	section.gallery {
		padding: 3em 2em 2em 2em;
		background-color: $white;
	}

	.header {
		text-align: center;
	}

	h2.title {
		text-align: center;
		&.en {
			@extend .title-font-en;
			letter-spacing: 1px;
		}

		&.kr {
			@extend .title-font-kr;
			letter-spacing: 1px;
		}
	}

	p.sub-title {
		text-align: center;
		&.kr {
			margin-top: 0.9em;
			font-size: 0.9rem;
		}

		&.en {
			margin-top: 0.5em;
			font-size: 1.2rem;
		}
	}

	#gallery {
		display: grid;
		gap: 1em;
		grid-template-columns: repeat(2, 1fr);
		grid-auto-rows: 6.5em;
	}

	img.thumbnail {
		border-radius: 4px;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}


	.slide {
		grid-row: span 2;
	}

	.more-button-wrapper {
		text-align: center;
		margin-top: 2em;
	}

	.more-button {
		background: #fdfdf5;
		border: 1.5px solid #ff6666;
		border-radius: 50px;
		padding: .5rem 2rem;
		cursor: pointer;
		transition: all .2s ease;
	}
</style>