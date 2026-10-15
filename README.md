# 제라진 오프로드 웹사이트 시안 (2026-10-16 · 14페이지)

기획서 `../제라진오프로드_홈페이지제작기획_20261015_v1.md` 의 **B안(하이브리드)** 기준 시안.
정적 HTML/CSS/JS만 사용하며 빌드 도구·프레임워크가 없다.

## 보는 방법

```bash
cd "/Volumes/T5 EVO/261004_Jerajin/site" && python3 -m http.server 8917
```

→ http://localhost:8917/ 접속. PC 1440px, 모바일 390px 기준으로 확인했다.
전체 페이지 캡처는 `_시안캡처/` 에 있다.

## 페이지 (14)

| 파일 | 내용 |
|---|---|
| `index.html` | HOME — 히어로 영상, 3초 요약, 오늘 출발, 코스, 차량, 인생샷, 미디어, ESG, 크루, 예약, 오시는 길 (11섹션) |
| `about.html` | 브랜드 — 이름의 뜻, 13만 평 안의 것들, 자연과의 공존 |
| `course.html` | 코스 — 6.5km 개념도(이벤트 핀 16), 6단계 흐름, 코스 갤러리, 360 미리보기 |
| `vehicles.html` | 차량 목록 — 카드 6종 + 비교표 |
| `vehicles-h1.html` | 험머 H1 (험비) — 실제 촬영분 |
| `vehicles-rubicon.html` | 지프 루비콘 — 360 영상에서 추출한 실제 컷 |
| `vehicles-h3.html` | 험머 H3 — 촬영 자리 |
| `vehicles-komando.html` | 코만도 — 촬영 자리 |
| `vehicles-suv.html` | 오프로드 SUV — 타이어 컷 + 촬영 자리 |
| `vehicles-willys.html` | 지프 윌리스 — ★운영 여부 확인 전, 틀만 |
| `reserve.html` | 예약 — 3스텝 위저드 + 전자 사전동의서(e-Waiver) |
| `crew.html` | 크루와 안전 — 드라이버, 탑승 제한, 차량·보험, 사진 서비스 |
| `media.html` | 미디어 — 방송 출연, 유튜브, 360 체험, 고객 갤러리 |
| `visit.html` | 오시는 길 — 지도 자리, 준비물 6종, FAQ 8문항 |

## 구조

```
site/
├ *.html                  페이지 14개
├ assets/css/style.css    디자인 시스템 + 전 페이지 스타일
├ assets/js/fact.js       ★사실표 — 모든 수치의 단일 출처
├ assets/js/main.js       공통 렌더(차량 카드·FAQ·코스 핀·플레이스홀더 표시)
├ assets/js/reserve.js    예약 위저드 + e-Waiver 동작
├ assets/img/             시안용 이미지(드론·FPV·360 원본에서 추출)
├ assets/video/hero-pc.mp4  히어로 루프(임시 인코딩, 5.8MB)
└ _시안캡처/              전체 페이지 캡처
```

## ★수치 수정 방법

가격·정원·체중·시간표·제원 등 **모든 숫자는 `assets/js/fact.js` 한 파일에만 있다.**
`confirmed: false` 인 항목은 화면에 점선 + "미확정" 배지로 표시된다.
업체 확정값을 받으면 `v` 를 바꾸고 `confirmed: true` 로 고치면 전 페이지에 동시 반영된다.

우측 하단 **시안 패널**(실제 사이트에서는 삭제)에서 강조를 끄고 볼 수 있고,
그 페이지의 미확정 개수도 표시된다.

## 페이지 생성기

차량 상세와 일반 페이지는 손으로 복제하지 않고 생성기로 만든다. 헤더·푸터·비교표가 한 곳에서 관리된다.

```bash
python3 tools/build_vehicles.py   # vehicles-*.html 6개
python3 tools/build_pages.py      # vehicles/reserve/about/course/crew/media/visit
```

- 차량 추가·문구 수정 → `tools/build_vehicles.py` 의 `VEHICLES` 수정 후 재실행
- 제원 숫자 → `assets/js/fact.js` (생성기는 숫자를 넣지 않는다)
- `index.html` 은 손으로 쓴 파일이라 생성기가 건드리지 않는다

## 시안 단계의 한계 (실제 구축 시 교체)

| 항목 | 현재 | 실제 |
|---|---|---|
| 히어로 영상 | Mavic 3 Cine 원본 6초 발췌, 720p 5.8MB | ffmpeg 재인코딩 1080p ≤3MB + WebM, 모바일 세로 버전 |
| 차량 사진 | 험비·루비콘만 실촬, 나머지는 촬영 자리 | 차량 5종 전용 디테일 촬영 |
| 드라이버·방송 클립 | 자리 표시 | 인물 촬영 / 방송 클립 사용 협의 |
| 지도 | 자리 표시 | 카카오맵·네이버지도 API + 주차 진입로 핀 |
| 360 체험 | 정지 파노라마 | 8K 360 영상 + SRT GPS로 코스맵 구간 연동 |
| 예약 결제 | 위저드까지만, 결제 버튼은 안내 문구 | 아임웹·네이버예약 딥링크(B안) |
| 달력 잔여 | 임시 데모 값 | 예약 시스템 API 연동 |
| 보험 정보 | "확인 필요" 표시 | 업체 증빙 확인 후 보장 내용 기재 |
| 갤러리 인물 | 드론 원본 프레임(임시) | 초상권 동의 받은 고객 사진만 |

## 사용한 도구 (이 Mac에 ffmpeg이 없어 직접 만든 것)

- `../tools/grabframes` — AVFoundation 프레임 추출 (`grabframes <영상> <출력폴더> <최대폭> [시각,…]`)
- `../tools/cliptrim` — AVFoundation 구간 추출·리사이즈 (`cliptrim <입력> <출력.mp4> <시작> <길이> [720|1080]`)
- `../tools/equirect_crop.py` — 360 equirect에서 일반 사진 잘라내기
  (`equirect_crop.py <equirect.jpg> <출력폴더> <yaw들> [pitch] [hfov] [width] [usign]`)
  ★좌우 미러 규약은 소스마다 다르다. **DJI Avata360 OSV 스티칭본은 usign=+1**(차량 데칼 글자로 검증).
  지프 루비콘 사진은 이 도구로 8K 360 프레임에서 뽑았다.

웹 배포용 최종 인코딩(용량·2패스·WebM)은 ffmpeg 설치 후 진행해야 한다.
