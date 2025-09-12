<script lang="ts">
	import locationTopWave from '$lib/assets/location-top-wave.svg';
	import locationDeco from '$lib/assets/location-deco.svg';
	import { _ } from 'svelte-i18n';
	import { localeStore } from '../i18n.svelte';
	import { Clipboard, Github } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_NAVER_MAPS_CLIENT_ID } from '$env/static/public';

	type NaverMaps = {
		LatLng: new (lat: number, lng: number) => any;
		Map: new (element: HTMLElement, options: any) => any;
		Marker: new (options: any) => any;
		InfoWindow: new (options: any) => any;
		Event: {
			addListener: (target: any, type: string, listener: () => void) => void;
		};
	};

	const getNaverMaps = (): NaverMaps | null => {
		return (window as any).naver?.maps || null;
	};

	let mapContainer: HTMLDivElement;
	const address = '서울특별시 강남구 학동로47길 5';
	const placeName = '라온제나';

	onMount(() => {
		if (typeof window !== 'undefined' && getNaverMaps()) {
			initMap();
		} else {
			loadNaverMapsScript();
		}
	});

	function loadNaverMapsScript() {
		const script = document.createElement('script');
		script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${PUBLIC_NAVER_MAPS_CLIENT_ID}`;
		script.onload = () => initMap();
		document.head.appendChild(script);
	}

	// 서버 API 호출 → 좌표 변환
	async function getCoordinates() {
		const response = await fetch(`/api/geocode?query=${encodeURIComponent(address)}`);
		const data = await response.json();

		if (data.addresses && data.addresses.length > 0) {
			return {
				lat: parseFloat(data.addresses[0].y),
				lng: parseFloat(data.addresses[0].x),
			};
		}
		throw new Error("주소 좌표 변환 실패");
	}

	async function initMap() {
		const naver = getNaverMaps();
		if (!naver) return;

		const { lat, lng } = await getCoordinates();
		const location = new naver.LatLng(lat, lng);

		const map = new naver.Map(mapContainer, {
			center: location,
			zoom: 17,
			mapTypeControl: true
		});

		const marker = new naver.Marker({
			position: location,
			map,
			title: placeName
		});

		const infoWindow = new naver.InfoWindow({
			content: `
				<div style="padding: 10px; min-width: 200px;">
					<h4>${placeName}</h4>
					<p>${address}</p>
				</div>
			`
		});

		naver.Event.addListener(marker, "click", () => {
			infoWindow.open(map, marker);
		});
	}

	function copyAddress() {
		navigator.clipboard
			.writeText(address)
			.then(() => alert($_('location.address_copied')))
			.catch(() => null);
	}

	function openNaverMap() {
		const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;
		window.open(naverMapUrl, '_blank');
	}
</script>

<img src={locationTopWave} class="location-top-wave" alt="" />
<section class="location">
	<h2 class="title {localeStore.locale}">{$_('location.title')}</h2>
	<p class="venue en">{placeName}</p>
	
	<button class="copy-address en" on:click={copyAddress}>
		<span class="clipboard-icon">
			<Clipboard size="1.1em" />
		</span>
		<span class="address">{address}</span>
	</button>

	<div class="map">
		<div bind:this={mapContainer} class="naver-map"></div>
		<button class="map-link-button" on:click={openNaverMap}>
			네이버지도에서 보기
		</button>
	</div>

	<p class="signature en">made with ♡ by Emily & Anthony</p>
	<a class="github-icon" href="https://github.com/anthopark/our-wedding-invitation" target="_blank">
		<Github size="1.1em" strokeWidth={1} />
	</a>
	<img class="location-deco" src={locationDeco} alt="" />
</section>

<style lang="scss">
	img.location-top-wave {
		max-width: $content-max-width;
		margin: auto;
	}

	section.location {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: $bg-color-1;
		padding: 1em 2em 1em 2em;
	}

	h2.title {
		color: $primary-color;
		text-align: center;
		margin-bottom: 1em;

		&.kr {
			@extend .title-font-kr;
			letter-spacing: 1px;
		}

		&.en {
			@extend .title-font-en;
			letter-spacing: 1px;
		}
	}

	p.venue.en {
		font-size: 1.2rem;
		font-weight: 600;
	}

	button.copy-address {
		display: flex;
		align-items: center;
		margin-top: 0.5em;
		background: none;
		border: none;
		cursor: pointer;

		.clipboard-icon {
			height: 1em;
			display: inline-block;
			margin-right: 0.2em;
			color: $font-color-default;
		}

		.address {
			font-size: 1.1rem;
			text-decoration: underline;
		}
	}

	.map {
		margin-top: 2em;
		width: 100%;
		height: 24em; // 지도를 크게
		margin-bottom: 2em;
		position: relative;
	}

	.naver-map {
		width: 100%;
		height: 100%;
		border: none;
		border-radius: 12px;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
	}

	.map-link-button {
		position: absolute;
		bottom: 10px;
		right: 10px;
		background-color: rgba(255, 255, 255, 0.9);
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 5px 10px;
		font-size: 0.8rem;
		cursor: pointer;
		transition: background-color 0.2s;

		&:hover {
			background-color: #fff;
		}
	}

	p.signature {
		font-size: 1rem;
		margin-top: 5em;
	}

	.github-icon {
		margin-top: 0.2em;
		color: $font-color-default;
		cursor: pointer;
	}

	img.location-deco {
		position: absolute;
		bottom: 2.5em;
		right: 1.5em;
	}
</style>
