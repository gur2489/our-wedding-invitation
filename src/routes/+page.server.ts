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
	// 기존 참석여부 액션
	rsvp: async ({ request }) => {
		if (!env.RESEND_API_KEY) {
			return {
				emailError: true
			};
		}

		const resend = new Resend(env.RESEND_API_KEY);
		const formData = await request.formData();
		const fullname = formData.get('fullname')?.toString();
		const rsvp = formData.get('rsvp')?.toString();

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

		try {
			await resend.emails.send({
				from: env.FROM_EMAIL,
				to: env.TO_EMAIL,
				subject: '결혼식 참석여부 회신',
				text: `성함: ${fullname}\n참석여부: ${rsvp === 'yes' ? '참석' : '불참석'}`
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
	},

	// 새로운 탑승여부 액션
	rsvpBus: async ({ request }) => {
		if (!env.RESEND_API_KEY) {
			return {
				emailErrorB: true
			};
		}

		const resend = new Resend(env.RESEND_API_KEY);
		const formData = await request.formData();
		const fullname = formData.get('fullname_b')?.toString();
		const rsvpBus = formData.get('rsvp_b')?.toString();

		// 유효성 검사
		if (!fullname) {
			return {
				missingNameB: true,
				nameB: fullname
			};
		}

		if (!rsvpBus || (rsvpBus !== 'yes' && rsvpBus !== 'no')) {
			return {
				missingRsvpB: true,
				nameB: fullname
			};
		}

		try {
			await resend.emails.send({
				from: env.FROM_EMAIL,
				to: env.TO_EMAIL,
				subject: '결혼식 버스 탑승여부 회신',
				text: `성함: ${fullname}\n탑승여부: ${rsvpBus === 'yes' ? '탑승' : '미탑승'}`
			});

			return {
				successB: true
			};
		} catch (error) {
			console.error('Bus email sending failed:', error);
			return {
				emailErrorB: true,
				nameB: fullname
			};
		}
	}
} satisfies Actions;
