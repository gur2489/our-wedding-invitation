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
	import { _ } from 'svelte-i18n';
	import Camera from '$lib/assets/icons/camera.png';

	let showAll = $state(false);
	let photos = $state<Array<{ src: string; width: number; height: number }>>([]);

	const photoSources = [
		photo18, photo11, photo15, photo13, photo4, photo16,
		photo9, photo17, photo19, photo2, photo8, photo10,
		photo7, photo14, photo5, photo6
	];

	// 이미지의 원본 크기를 자동으로 감지
	async function loadPhotoDimensions() {
		const loadedPhotos = await Promise.all(
			photoSources.map((src) => {
				return new Promise<{ src: string; width: number; height: number }>((resolve) => {
					const img = new Image();
					img.onload = () => {
						resolve({
							src,
							width: img.naturalWidth,
							height: img.naturalHeight
						});
					};
					img.onerror = () => {
						// 오류 시 기본값 설정
						resolve({
							src,
							width: 1080,
							height: 1440
						});
					};
					img.src = src;
				});
			})
		);
		photos = loadedPhotos;
	}

	onMount(() => {
		// 이미지 크기 로드 후 PhotoSwipe 초기화
		loadPhotoDimensions().then(() => {
			const lightbox = new PhotoSwipeLightBox({
				gallery: '#gallery',
				children: 'a',
				showHideAnimationType: 'fade',
				pswpModule: PhotoSwipe
			});

			lightbox.init();

			return () => {
				lightbox.destroy();
			};
		});
	});
</script>

<section class="gallery">
	<div class="header">
		<img src={Camera} class="icon-img" alt="camera icon" />
	</div>
	<div id="gallery">
		{#each photos as photo, idx (photo.src)}
			<a
				href={photo.src}
				class="slide"
				data-pswp-width={photo.width}
				data-pswp-height={photo.height}
				style={idx >= 10 && !showAll ? 'display:none' : ''}
			>
				{#if idx < 10 || showAll}
					<img class="thumbnail" src={photo.src} alt="" />
				{/if}
			</a>
		{/each}
	</div>

	{#if !showAll}
		<div class="more-button-wrapper">
			<button class="more-button" onclick={() => (showAll = true)}>
				더보기
			</button>
		</div>
	{/if}
</section>

<style lang="scss">
	.icon-img {
		width: 50px;
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
		padding: 0.5rem 2rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}
</style>