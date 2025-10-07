<script lang="ts">
	import photo2 from '$lib/assets/gallery/gallery1.jpg';
	import photo3 from '$lib/assets/gallery/gallery2.jpg';
	import photo4 from '$lib/assets/gallery/gallery3.jpg';
	import photo5 from '$lib/assets/gallery/gallery4.jpg';
	import photo6 from '$lib/assets/gallery/gallery5.jpg';
	import photo7 from '$lib/assets/gallery/gallery6.jpg';
	import photo8 from '$lib/assets/gallery/gallery7.jpg';
	import photo9 from '$lib/assets/gallery/gallery8.jpg';
	import photo10 from '$lib/assets/gallery/gallery9.jpg';
	import photo11 from '$lib/assets/gallery/gallery10.jpg';

	import PhotoSwipeLightBox from 'photoswipe/lightbox';
	import PhotoSwipe from 'photoswipe';
	import 'photoswipe/style.css';
	import { onMount } from 'svelte';
	import { localeStore } from '../i18n.svelte';
	import { _ } from 'svelte-i18n';

	onMount(() => {
		const lightbox = new PhotoSwipeLightBox({
			gallery: '#gallery',
			children: 'a',
			showHideAnimationType: 'fade',
			pswpModule: PhotoSwipe
		});

		lightbox.init();
	});

	const photos = [
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
			src: photo3,
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
			src: photo9,
			width: 1200,
			height: 1790
		},
		{
			src: photo11,
			width: 1200,
			height: 1790
		}
	];
</script>

<section class="gallery">
	<div class="header">
		<h2 class="title {localeStore.locale}">{$_('gallery.title')}</h2>
		<p class="sub-title {localeStore.locale}">{$_('gallery.sub_title')}</p>
	</div>
	<div id="gallery">
		{#each photos as photo}
			<a
				href={photo.src}
				class="slide"
				data-pswp-width={photo.width}
				data-pswp-height={photo.height}
				target="_blank"
			>
				<img class="thumbnail" src={photo.src} alt="" />
			</a>
		{/each}
	</div>
</section>

<style lang="scss">
	section.gallery {
		padding: 4.5em 2em 2em 2em;
		background-color: $white;
	}

	.header {
		margin-bottom: 2em;
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

	.slide:nth-child(1),
	.slide:nth-child(2),
	.slide:nth-child(3),
	.slide:nth-child(5),
	.slide:nth-child(7),
	.slide:nth-child(8),
	.slide:nth-child(9),
	.slide:nth-child(10) {
		grid-row: span 2;
	}
</style>
