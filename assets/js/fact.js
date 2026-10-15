/* 제라진 오프로드 — 사실표(Single Source of Truth)
 * confirmed: true  = 현행 공식 사이트/사업자 정보로 확인된 값
 * confirmed: false = ★업체 확정 전 임시 플레이스홀더 (화면에 점선으로 표시됨)
 * 숫자를 바꿀 때는 이 파일만 수정한다. 페이지 전체가 여기서 값을 읽는다.
 */
window.JERAZIN_FACT = {
  brand: {
    nameKo: { v: '제라진캠프', confirmed: true },
    nameEn: { v: 'JERAZIN OFF-ROAD', confirmed: true },
    tagline: { v: '제대로, 진짜로', confirmed: true },
    ceo: { v: '최한정', confirmed: true },
    bizNo: { v: '138-09-17473', confirmed: true },
    mailOrderNo: { v: '2021-제주조천-0063호', confirmed: true },
    tel: { v: '070-8880-3900', confirmed: true },
    tel2: { v: '0507-1363-3900', confirmed: true },
    email: { v: 'axepress@hanmail.net', confirmed: true },
    addrRoad: { v: '제주특별자치도 제주시 조천읍 선교로 16-7', confirmed: true },
    addrLot: { v: '조천읍 선흘리 626-47', confirmed: true },
    hours: { v: '매일 10:00 – 17:00', confirmed: true },
    hoursNote: { v: '시즌·기상에 따라 18:00까지 연장', confirmed: true }
  },

  scale: {
    area: { v: '13만 평', confirmed: true, label: '사유지 초원·곶자왈' },
    areaM2: { v: '429,752㎡', confirmed: true },
    course: { v: '6.5km', confirmed: true, label: '한초이 마스터 설계 코스' },
    events: { v: '16', confirmed: true, label: '익스트림 이벤트 구간' },
    duration: { v: '50분', confirmed: true, label: '주행 + 포토타임' },
    pond: { v: '선새미못', confirmed: true, label: '코스 안의 연못' },
    wildlife: { v: '한라마 · 노루', confirmed: true, label: '방목·야생 동물' }
  },

  /* ★ 아래 숫자는 GDR 보고서와 현행 사이트가 서로 달라 확정 전이다 */
  price: {
    publicPerPerson: { v: '00,000원', confirmed: false, note: 'GDR 39,000 / 현행 사이트 59,000 — 확정 필요' },
    publicMinPax: { v: '2인', confirmed: false, note: '최소 출발 인원' },
    privateBase: { v: '000,000원', confirmed: false, note: '현행: 1대 300,000원(최대 5인 이상 탑승 시)' },
    privateAddPerson: { v: '00,000원', confirmed: false, note: '추가 1인당' },
    hummerH1: { v: '00,000원', confirmed: false, note: 'GDR: 1인 59,000원' },
    hummerH3: { v: '000,000원', confirmed: false, note: 'GDR: 1대 290,000원' },
    rubicon: { v: '000,000원', confirmed: false, note: 'GDR: 1대 240,000~250,000원' },
    komando: { v: '000,000원', confirmed: false, note: 'GDR: 1대 420,000원' }
  },

  rules: {
    ageMin: { v: '만 3세', confirmed: true, note: '사전 동의서 작성 필수' },
    guardian: { v: '만 13세 미만 보호자 동반', confirmed: false },
    heightMax: { v: '195cm', confirmed: false, note: '초과 시 탑승 제한' },
    weightMax: { v: '000kg', confirmed: false, note: '현행 페이지에 100kg·130kg 동시 표기 — 차량별 확정 필요' },
    paxPerCar: { v: '0~00인', confirmed: false, note: '현행 페이지에 7인·11인 동시 표기' },
    driveSelf: { v: '고객 직접 운전 불가', confirmed: true, note: '전원 전문 드라이버 운행' },
    restroom: { v: '투어 중 화장실 이용 불가', confirmed: true, note: '탑승 전 이용 필수' }
  },

  schedule: {
    slots: { v: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'], confirmed: false,
             note: 'GDR 기준 7회 정시 출발 — 현행 운영 시간표 확정 필요' }
  },

  vehicles: [
    { id: 'suv',     name: '오프로드 SUV',  en: 'TUNED SUV',    img: 'vehicle-suv.jpg', href: 'vehicles-suv.html',
      pax: { v: '최대 0~00인', confirmed: false }, price: 'publicPerPerson', unit: '1인',
      desc: '오프로드 전용 튜닝을 마친 SUV. 당일 차량은 현장에서 배정된다.', tag: '혼승' },
    { id: 'h1',      name: '험머 H1 (험비)', en: 'HUMMER H1 · HMMWV', img: 'vehicle-h1.jpg', href: 'vehicles-h1.html',
      pax: { v: '최소 5~6인 / 최대 12인', confirmed: false }, price: 'hummerH1', unit: '1인',
      desc: 'V8 6,500cc 디젤 205마력. 미 군용 험비를 민수용으로 개발한 오프로드의 골리앗.', tag: 'VIP' },
    { id: 'private', name: '프라이빗 투어',  en: 'PRIVATE OFF-ROAD', img: 'vehicle-private.jpg', href: 'vehicles.html',
      pax: { v: '최대 4~7인 단독', confirmed: false }, price: 'privateBase', unit: '1대',
      desc: '험머 H3 · 지프 루비콘 · 지프 윌리스 · 코만도 중 선택. 일행끼리만 단독 탑승.', tag: '단독' }
  ],

  /* 차량 상세 — 험머 H1 (험비)
     spec 중 confirmed:true 는 GDR 보고서 기재값. 업체 교차확인을 권장한다. */
  h1: {
    maker: { v: 'AM General', confirmed: true },
    origin: { v: '미 군용 다목적 전술차량 HMMWV(험비)의 민수용 모델', confirmed: true },
    engine: { v: 'V8 6,500cc 디젤', confirmed: true, note: 'GDR 보고서 기재값' },
    power: { v: '205마력', confirmed: true, note: 'GDR 보고서 기재값' },
    drive: { v: '4WD', confirmed: false, note: '구동 방식·감속기 사양 확인 필요' },
    size: { v: '0,000 × 0,000 × 0,000mm', confirmed: false, note: '전장 × 전폭 × 전고' },
    tire: { v: '00인치', confirmed: false, note: '장착 타이어 규격' },
    clearance: { v: '000mm', confirmed: false, note: '최저 지상고' },
    pax: { v: '최소 5~6인 / 최대 12인', confirmed: false, note: 'GDR 기준 — 현행 운영 정원 확인 필요' },
    weightMax: { v: '000kg', confirmed: false, note: '험머 등 특수 대형 차량 기준(GDR: 110kg 또는 130kg)' },
    heightMax: { v: '195cm', confirmed: false },
    gallery: [
      { img: 'h1-front.jpg', cap: '그릴과 거대 타이어 — 로우앵글' },
      { img: 'h1-tire.jpg', cap: '성인 허리 높이의 타이어와 휠 허브' },
      { img: 'h1-suspension.jpg', cap: '코일 서스펜션과 하부 구조' },
      { img: 'h1-body.jpg', cap: '진흙이 묻은 사이드 보디' },
      { img: 'h1-side.jpg', cap: '개방형 캐빈과 시트 배치' },
      { img: 'h1-interior.jpg', cap: '탑승석에서 본 시야' }
    ]
  },

  /* ---- 차량별 상세 (vehicles-*.html) ----
     h1 = 험머 H1. 아래 4종은 같은 구조이며, 사진이 없는 차량은 촬영 자리로 표시된다. */
  rubicon: {
    maker: { v: 'Jeep', confirmed: true },
    origin: { v: '군용차 출신의 보디 온 프레임 정통 SUV, 1987년부터 생산', confirmed: true, note: 'GDR 보고서 기재값' },
    engine: { v: '0,000cc', confirmed: false },
    power: { v: '000마력', confirmed: false },
    drive: { v: '파트타임 4WD', confirmed: false },
    size: { v: '0,000 × 0,000 × 0,000mm', confirmed: false },
    tire: { v: '00인치', confirmed: false },
    clearance: { v: '000mm', confirmed: false },
    pax: { v: '최대 4인 단독', confirmed: false, note: 'GDR 기준' },
    weightMax: { v: '000kg', confirmed: false },
    heightMax: { v: '195cm', confirmed: false }
  },
  h3: {
    maker: { v: 'Hummer', confirmed: true },
    origin: { v: '험머 시리즈의 프라이빗 전용 차량, 거대한 차체로 험한 산지 지형을 돌파', confirmed: true, note: 'GDR 보고서 기재값' },
    engine: { v: '0,000cc', confirmed: false },
    power: { v: '000마력', confirmed: false },
    drive: { v: '4WD', confirmed: false },
    size: { v: '0,000 × 0,000 × 0,000mm', confirmed: false },
    tire: { v: '00인치', confirmed: false },
    clearance: { v: '000mm', confirmed: false },
    pax: { v: '최대 4인 단독', confirmed: false, note: 'GDR 기준' },
    weightMax: { v: '000kg', confirmed: false },
    heightMax: { v: '195cm', confirmed: false }
  },
  komando: {
    maker: { v: '제라진캠프 자체 제작', confirmed: true },
    origin: { v: '쌍용 코란도 9인승 바디와 랭글러 YJ 바디를 결합하고 35인치 대형 타이어를 장착한 커스텀 차량', confirmed: true, note: 'GDR 보고서 기재값' },
    engine: { v: '0,000cc', confirmed: false },
    power: { v: '000마력', confirmed: false },
    drive: { v: '4WD', confirmed: false },
    size: { v: '0,000 × 0,000 × 0,000mm', confirmed: false },
    tire: { v: '35인치', confirmed: true, note: 'GDR 보고서 기재값' },
    clearance: { v: '000mm', confirmed: false },
    pax: { v: '최대 7인 단독', confirmed: false, note: 'GDR 기준' },
    weightMax: { v: '000kg', confirmed: false },
    heightMax: { v: '195cm', confirmed: false }
  },
  willys: {
    maker: { v: 'Jeep', confirmed: true },
    origin: { v: '지프의 원형이 된 군용 윌리스 계보의 차량', confirmed: false, note: '현행 사이트 메뉴에 존재 — 사양·운영 여부 확인 필요' },
    engine: { v: '0,000cc', confirmed: false },
    power: { v: '000마력', confirmed: false },
    drive: { v: '4WD', confirmed: false },
    size: { v: '0,000 × 0,000 × 0,000mm', confirmed: false },
    tire: { v: '00인치', confirmed: false },
    clearance: { v: '000mm', confirmed: false },
    pax: { v: '최대 0인', confirmed: false },
    weightMax: { v: '000kg', confirmed: false },
    heightMax: { v: '195cm', confirmed: false }
  },
  suv: {
    maker: { v: '제라진캠프 오프로드 튜닝', confirmed: true },
    origin: { v: '오프로드 전용 튜닝을 마친 SUV. 당일 차량은 현장에서 배정된다', confirmed: true },
    engine: { v: '0,000cc', confirmed: false },
    power: { v: '000마력', confirmed: false },
    drive: { v: '4WD', confirmed: false },
    size: { v: '0,000 × 0,000 × 0,000mm', confirmed: false },
    tire: { v: '00인치', confirmed: false },
    clearance: { v: '000mm', confirmed: false },
    pax: { v: '0~00인', confirmed: false, note: '현행 페이지에 7인·11인 동시 표기' },
    weightMax: { v: '000kg', confirmed: false },
    heightMax: { v: '195cm', confirmed: false }
  },

  media: {
    tv: { v: ["tvN '바퀴 달린 집'", "tvN '더 짠내투어'"], confirmed: true },
    channel: { v: '제라진어드벤쳐TV', confirmed: true }
  },

  reviews: [
    { q: '일반 놀이기구나 롤러코스터는 명함도 못 내밀 수준', src: '방문 리뷰' },
    { q: '기사님이 찍어준 사진이 전부 화보였다', src: '방문 리뷰' },
    { q: '탑승하자마자 돈이 전혀 아깝지 않다는 생각이 들었다', src: '방문 리뷰' }
  ]
};
