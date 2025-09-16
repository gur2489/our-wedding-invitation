const uniqueIdentifier = "JWK-WEDDING-TEMPLATE-V1";

export const weddingConfig = {
  venue: {
    name: "웨딩홀 이름",
    address: "서울특별시 강남구 테헤란로 123\n웨딩홀 이름",
    tel: "02-1234-5678",
    naverMapId: "웨딩홀 이름",
    coordinates: { latitude: 37.5665, longitude: 126.9780 },
    placeId: "123456789",
    mapZoom: "17",
    mapNaverCoordinates: "14141300,4507203,15,0,0,0,dh",
    transportation: { subway: "지하철역 1번 출구에서 도보 5분", bus: "간선\n 101, 102, 103\n지선\n 1234, 5678" },
    parking: "건물 지하 주차장 이용 가능 (2시간 무료)",
    groomShuttle: { location: "신랑측 배차 출발지", departureTime: "오전 10시 30분 출발", contact: { name: "담당자명", tel: "010-1234-5678" } },
    brideShuttle: { location: "신부측 배차 출발지", departureTime: "오전 11시 출발", contact: { name: "담당자명", tel: "010-9876-5432" } },
  },
  account: {
    groom: { bank: "은행명", number: "123-456-789012", holder: "임재혁" },
    bride: { bank: "은행명", number: "987-654-321098", holder: "서승연" },
    groomFather: { bank: "은행명", number: "111-222-333444", holder: "임원섭" },
    groomMother: { bank: "은행명", number: "555-666-777888", holder: "윤지영" },
    brideFather: { bank: "은행명", number: "999-000-111222", holder: "서홍교" },
    brideMother: { bank: "은행명", number: "333-444-555666", holder: "신영채" },
  },
  rsvp: { enabled: false, showMealOption: false },
  slack: { webhookUrl: process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL || "", channel: "#wedding-response", compactMessage: true },
};
