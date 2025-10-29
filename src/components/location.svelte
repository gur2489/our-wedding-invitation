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
	const placeName = '라온제나 강남';

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
			mapTypeControl: true,
		});

		const marker = new naver.Marker({
			position: location,
			map,
			title: placeName,
		});

		// ✅ 네이버지도 링크 URL
		const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(placeName + ' ' + address)}`;

		// ✅ 예쁜 스타일의 말풍선
		const infoWindow = new naver.InfoWindow({
			content: `
				<div 
					style="
						padding: 12px 14px;
						min-width: 230px;
						border-radius: 10px;
						box-shadow: 0 4px 12px rgba(0,0,0,0.15);
						background-color: #fff;
						cursor: pointer;
						border: 1px solid #e5e7eb;
						font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
					"
					onclick="window.open('${naverMapUrl}', '_blank')"
				>
					<h4 style="margin: 0; font-size: 15px; color: #111; font-weight: 600;">${placeName}</h4>
					<p style="margin: 6px 0 0; font-size: 13px; color: #555;">${address}</p>
					<p style="margin: 6px 0 0; font-size: 12px; color: #1ec800; font-weight: 500;">▶ 네이버지도에서 보기</p>
				</div>
			`,
		});

		// 마커 클릭 시 말풍선 열기
		naver.Event.addListener(marker, "click", () => {
			infoWindow.open(map, marker);
		});

		// 초기에도 열린 상태로 표시
		infoWindow.open(map, marker);
	}


	function copyAddress() {
		navigator.clipboard
			.writeText(address)
			.then(() => alert($_('location.address_copied')))
			.catch(() => null);
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
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		if (!isMobile) {
			// PC에서는 네이버 지도 웹사이트로 이동
			const webUrl = `https://map.naver.com/v5/search/${encodeURIComponent(placeName + ' ' + address)}`;
			window.open(webUrl, '_blank');
			return;
		}

		const appUrl = `nmap://search?query=${encodeURIComponent(placeName + ' ' + address)}&appname=myweb.page`;
		const iosStoreUrl = 'https://apps.apple.com/app/id311867728';
		const androidStoreUrl = 'https://play.google.com/store/apps/details?id=com.nhn.android.nmap';

		const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
		const storeUrl = isIOS ? iosStoreUrl : androidStoreUrl;

		// 페이지가 백그라운드로 갔는지 확인
		let appOpened = false;

		const visibilityChange = () => {
			if (document.hidden) {
				appOpened = true;
			}
		};

		document.addEventListener('visibilitychange', visibilityChange);

		// 앱 열기 시도
		window.location.href = appUrl;

		// 2.5초 후에 앱이 열리지 않았으면 스토어로 이동
		setTimeout(() => {
		document.removeEventListener('visibilitychange', visibilityChange);
			if (!appOpened && !document.hidden) {
				window.location.href = storeUrl;
			}
		}, 3000);
	}

	function openTmap() {
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		if (!isMobile) {
			alert('티맵은 모바일 앱 전용 서비스입니다.\n모바일 기기에서 이용해주세요.');
			return;
		}

		const appUrl = `tmap://search?name=${encodeURIComponent(placeName)}`;
		const iosStoreUrl = 'https://apps.apple.com/app/id431589174';
		const androidStoreUrl = 'https://play.google.com/store/apps/details?id=com.skt.tmap.ku';

		const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
		const storeUrl = isIOS ? iosStoreUrl : androidStoreUrl;

		let appOpened = false;

		const visibilityChange = () => {
			if (document.hidden) {
				appOpened = true;
			}
		};

		document.addEventListener('visibilitychange', visibilityChange);
		window.location.href = appUrl;

		setTimeout(() => {
		document.removeEventListener('visibilitychange', visibilityChange);
			if (!appOpened && !document.hidden) {
				window.location.href = storeUrl;
			}
		}, 3000);
	}

	function openKakaoNavi() {
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		if (!isMobile) {
			// PC에서는 카카오맵 웹사이트로 이동
			const webUrl = `https://map.kakao.com/link/search/${encodeURIComponent(placeName)}`;
			window.open(webUrl, '_blank');
			return;
		}
		// 좌표를 알고 있는 경우
		//const appUrl = `kakaomap://look?p=${lat},${lng}`;

		// 또는 장소명으로 검색
		const appUrl = `kakaomap://search?q=${encodeURIComponent(placeName)}`;

		const iosStoreUrl = 'https://apps.apple.com/app/id304608425'; // 카카오맵
		const androidStoreUrl = 'https://play.google.com/store/apps/details?id=net.daum.android.map';

		const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
		const storeUrl = isIOS ? iosStoreUrl : androidStoreUrl;

		let appOpened = false;

		const visibilityChange = () => {
			if (document.hidden) {
				appOpened = true;
			}
		};

		document.addEventListener('visibilitychange', visibilityChange);
		window.location.href = appUrl;

		setTimeout(() => {
		document.removeEventListener('visibilitychange', visibilityChange);
			if (!appOpened && !document.hidden) {
				window.location.href = storeUrl;
			}
		}, 3000);
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
