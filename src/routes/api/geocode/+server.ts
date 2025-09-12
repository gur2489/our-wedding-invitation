import type { RequestHandler } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('query');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing query parameter' }), {
      status: 400
    });
  }

  const clientId = publicEnv.PUBLIC_NAVER_MAPS_CLIENT_ID;
  const clientSecret = privateEnv.NAVER_MAPS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(JSON.stringify({ error: 'Missing Naver API credentials' }), {
      status: 500
    });
  }

  const response = await fetch(
    `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(query)}`,
    {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret
      }
    }
  );

  const data = await response.json();
  return new Response(JSON.stringify(data), { status: 200 });
};
