const uniqueIdentifier = "JWK-WEDDING-TEMPLATE-V1";

export const weddingConfig = {
  meta: {
    title: "임재혁 ❤️ 서승연의 결혼식에 초대합니다",
    description: "결혼식 초대장",
    ogImage: "/images/ha0h-1fsi-bqt3.jpg",
    noIndex: true,
    _jwk_watermark_id: uniqueIdentifier,
  },
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
  invitation: {
    message: `한 줄기 별빛이 되어 만난 인연
평생을 함께 걸어가려 합니다.

소중한 분들의 축복 속에
저희 두 사람이 첫 걸음을 내딛습니다.

귀한 시간 내어 함께해 주신다면
그 어떤 축복보다 값진 선물이 될 것입니다.`,
    groom: { name: "신랑이름", label: "아들", father: "신랑아버지", mother: "신랑어머니" },
    bride: { name: "신부이름", label: "딸", father: "신부아버지", mother: "신부어머니" },
  },
  account: {
    groom: { bank: "카카오뱅크", number: "3333-12-2287600", holder: "임재혁" },
    bride: { bank: "신한은행", number: "110-400-897640", holder: "서승연" },
    groomFather: { bank: "-", number: "-", holder: "임원섭" },
    groomMother: { bank: "경남은행", number: "207-0033-1312-08", holder: "윤지영" },
    brideFather: { bank: "우리은행", number: "115-154432-02-201", holder: "서홍교" },
    brideMother: { bank: "우리은행", number: "247-184597-02-001", holder: "신영채" },
  },
  rsvp: { enabled: false, showMealOption: false },
};
