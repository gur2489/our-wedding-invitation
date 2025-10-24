<script lang="ts">
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

	let lat: number;
	let lng: number;

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

		const coords = await getCoordinates();
		lat = coords.lat;
		lng = coords.lng;
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

	async function shareLocation() {
		const shareData = {
			title: `${placeName}`,
			text: `${address}`,
			url: window.location.href,
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch (err) {
				console.error('공유 취소 또는 오류:', err);
			}
		} else {
			alert('현재 브라우저에서는 공유 기능을 지원하지 않습니다.');
		}
	}

	function openNaverMapApp() {
		const appUrl = `nmap://search?query=${encodeURIComponent(placeName)}&appname=myweb.page`;
		const webUrl = `https://map.naver.com/v5/search/${encodeURIComponent(placeName)}`;
		window.location.href = appUrl;
		setTimeout(() => (window.location.href = webUrl), 1000);
	}

	function openTmap() {
		if (!lat || !lng) {
			alert('지도가 아직 로드되지 않았습니다.');
			return;
		}
		const appUrl = `tmap://search?name=${encodeURIComponent(placeName)}&lon=${lng}&lat=${lat}`;
		const storeUrl = 'https://play.google.com/store/apps/details?id=com.skt.tmap.ku';
		window.location.href = appUrl;
		setTimeout(() => (window.location.href = storeUrl), 1000);
	}

	function openKakaoNavi() {
		if (!lat || !lng) {
			alert('지도가 아직 로드되지 않았습니다.');
			return;
		}
		const appUrl = `kakaonavi://navigate?name=${encodeURIComponent(placeName)}&x=${lng}&y=${lat}&coord_type=wgs84`;
		const storeUrl = 'https://play.google.com/store/apps/details?id=com.locnall.KimGiSa';
		window.location.href = appUrl;
		setTimeout(() => (window.location.href = storeUrl), 1000);
	}
</script>

<section class="location">
	<h2 class="title {localeStore.locale}">라온제나 강남</h2>
	
	<button class="copy-address kr" on:click={copyAddress}>
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

	<div class="map-app-buttons">
		<button on:click={openNaverMapApp} style="background-color: #2DB400;color:#fff">네이버지도</button>
		<button on:click={openTmap} style="background-color: orange;color:#fff">티맵</button>
		<button on:click={openKakaoNavi} style="background-color: #FEE500;color:#1E1E1E">카카오내비</button>
	</div>

	<button class="share-button" on:click={shareLocation}>
		공유하기
	</button>
</section>

<style lang="scss">

	.map-app-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		width:100%;
	}
	.map-app-buttons button {
		padding: 0.7rem 1rem;
		border: none;
		border-radius: 50px;
		background-color: #fdfdf5;
		color: #ff6666;
		font-size: 0.7rem;
		cursor: pointer;
		transition: background 0.25s;
		max-width: 110px;
		width: 33%;
	}
	.map-app-buttons button:hover {
		background-color: #4aa5e8;
	}

	.share-button {
		margin: 3rem auto 0;
    	font-size: 1rem;
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	section.location {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #faeef2;
		padding: 3em 2em;
	}

	h2.title {
		color: #444;
		text-align: center;
		color: #444;
		font-size: 1rem;
		font-weight: 500;
	}

	p.venue.en {
		font-size: 1rem;
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
			font-size: 1rem;
		}
	}

	.map {
		margin-top: 2em;
		width: 100%;
		height: 24em; // 지도를 크게
		margin-bottom: 1em;
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
