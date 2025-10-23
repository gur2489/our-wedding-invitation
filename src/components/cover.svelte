<script lang="ts">
	import mainimg from '$lib/assets/main2.jpg';
	import { browser } from '$app/environment';
	import { Confetti } from 'svelte-confetti';
	import { _ } from 'svelte-i18n';

	const maxSectionHeight = 900;
	let sectionHeight = $state(maxSectionHeight);

	function setSectionHeight() {
		sectionHeight = window.innerHeight < maxSectionHeight ? window.innerHeight : maxSectionHeight;
	}

	if (browser && window.matchMedia('(max-width: 1024px)')) {
		setSectionHeight();
	}
</script>

<section class="cover">
	<!-- ✅ 이미지 태그로 변경 -->
	<img src={mainimg} alt="cover image" class="cover-image" />

	<!-- ✅ 콘페티는 그대로 유지 -->
	<div class="confetti-area">
		<Confetti
			x={[-5, 5]}
			y={[0, 0.1]}
			colorArray={['#588adb', '#f5e298', '#fff', '#9aa3f5']}
			delay={[500, 2000]}
			infinite
			duration={5000}
			amount={70}
			fallDistance={`${sectionHeight}px`}
		/>
	</div>
</section>

<style lang="scss">
	section.cover {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	/* ✅ 이미지 스타일 */
	.cover-image {
		width: 100%;
		height: 100%;
		object-fit: cover; /* 기본은 꽉 채움 (PC용) */
		object-position: center;
		display: block;

		@media (max-width: 1024px) {
			object-fit: contain; /* 모바일에서는 잘리지 않게 */
			background-color: #f5f5f5; /* 여백 배경색 */
		}
	}

	/* ✅ 콘페티 영역은 그대로 유지 */
	.confetti-area {
		position: absolute;
		top: -50px;
		left: -50px;
		height: 100%;
		width: 100%;
		overflow: hidden;
		pointer-events: none;
		z-index: 10;
	}

	.names-kr-box {
		position: absolute;
		top: 3em;
		left: 4em;

		span.names {
			color: #616161;
			display: block;
			font-size: 1rem;
			letter-spacing: 0.8em;
			line-height: 2;
		}
		
		@media (max-width: 1024px) {
			left: 2em;
			top: 2em;
		}
	}

	.cover-title-container {
		width: 100%;
		position: absolute;
		bottom: 1.5em;
		
		@media (max-width: 1024px) {
			bottom: 2em;
		}
	}

	.names-en-box {
		width: 100%;
		display: flex;
		justify-content: center;

		span.names {
			display: block;
			color: #fff;
			word-spacing: 5px;
			font-size: 2.2rem;
			
			@media (max-width: 1024px) {
				font-size: 1.8rem;
			}
			
			@media (max-width: 480px) {
				font-size: 1.4rem;
			}
		}
	}

	.event-date-and-place-box {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		span.event-date-and-time,
		span.event-place {
			display: block;
			color: #fff;

			&.kr {
				font-size: 1rem;
				
				@media (max-width: 480px) {
					font-size: 0.9rem;
				}
			}

			&.en {
				font-size: 1.4rem;
				
				@media (max-width: 1024px) {
					font-size: 1.2rem;
				}
				
				@media (max-width: 480px) {
					font-size: 1rem;
				}
			}
		}

		span.event-date-and-time.kr {
			margin-bottom: 0.4em;
		}
	}
</style>
