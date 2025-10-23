import type { Actions } from './$types';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';

export async function load() {
	// 함수 안에서 체크
	if (!env.RESEND_API_KEY) {
		console.log('Resend API key not found');
		return {
			// 기본 데이터 반환
			status: 'no-api-key'
		};
	}

	const resend = new Resend(env.RESEND_API_KEY);

	// 나머지 Resend 관련 로직...
	return {
		// 실제 데이터 반환
	};
}

export const actions = {
	// 통합된 참석여부 및 버스 탑승 액션
	rsvp: async ({ request }) => {
		if (!env.RESEND_API_KEY) {
			return {
				emailError: true
			};
		}

		const resend = new Resend(env.RESEND_API_KEY);
		const formData = await request.formData();
		const fullname = formData.get('fullname')?.toString();
		const rsvp = formData.get('rsvp')?.toString(); // 'yes' (신랑측) or 'no' (신부측)
		const meal = formData.get('meal')?.toString(); // 'yes' (예정), 'no' (안함), 'undecided' (미정)
		const bus = formData.get('bus')?.toString(); // 'yes' (탑승) or 'no' (개별이동)
		const busLocation = formData.get('busLocation')?.toString();
		const busPassengers = formData.get('busPassengers')?.toString();

		// 유효성 검사
		if (!fullname) {
			return {
				missingName: true,
				name: fullname
			};
		}

		if (!rsvp || (rsvp !== 'yes' && rsvp !== 'no')) {
			return {
				missingRsvp: true,
				name: fullname
			};
		}

		if (!meal || !['yes', 'no', 'undecided'].includes(meal)) {
			return {
				missingMeal: true,
				name: fullname
			};
		}

		if (!bus || (bus !== 'yes' && bus !== 'no')) {
			return {
				missingBus: true,
				name: fullname
			};
		}

		// 버스 탑승 시 위치와 인원 체크
		if (bus === 'yes' && (!busLocation || !busPassengers)) {
			return {
				missingBusInfo: true,
				name: fullname
			};
		}

		// 이메일 본문 구성
		const side = rsvp === 'yes' ? '신랑측' : '신부측';
		const mealStatus = meal === 'yes' ? '예정' : meal === 'no' ? '안함' : '미정';
		const busStatus = bus === 'yes' ? '탑승' : '개별이동';
		
		let emailText = `성함: ${fullname}\n구분: ${side}\n식사여부: ${mealStatus}\n버스 탑승: ${busStatus}`;
		
		if (bus === 'yes') {
			emailText += `\n탑승위치: ${busLocation}\n탑승인원: ${busPassengers}명`;
		}

		try {
			await resend.emails.send({
				from: env.FROM_EMAIL,
				to: env.TO_EMAIL,
				subject: '결혼식 참석여부 및 버스 탑승 회신',
				text: emailText
			});

			return {
				success: true
			};
		} catch (error) {
			console.error('Email sending failed:', error);
			return {
				emailError: true,
				name: fullname
			};
		}
	}
} satisfies Actions;