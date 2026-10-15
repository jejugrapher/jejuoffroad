/* 제라진 오프로드 HOME 프로토타입 — 렌더 스크립트
   모든 수치는 fact.js에서 주입된다. confirmed:false 는 .ph 로 표시한다. */
(function () {
  var F = window.JERAZIN_FACT;
  var phCount = 0;

  function get(path) {
    return path.split('.').reduce(function (o, k) { return o && o[k]; }, F);
  }
  function render(node) {
    var item = get(node.dataset.fact);
    if (!item) { node.textContent = '—'; return; }
    var v = Array.isArray(item.v) ? item.v.join(' · ') : item.v;
    node.textContent = v;
    if (item.confirmed === false) {
      node.classList.add('ph');
      node.title = item.note ? '확정 전 임시값 — ' + item.note : '업체 확정 전 임시값';
      phCount++;
    }
  }
  document.querySelectorAll('[data-fact]').forEach(render);

  /* ---- 오늘 출발 시간표 ---- */
  var slotBox = document.getElementById('slots');
  var sc = F.schedule.slots;
  var demoState = ['여유', '여유', '마감임박', '여유', '여유', '마감', '여유'];
  if (slotBox) sc.v.forEach(function (t, i) {
    var st = demoState[i] || '여유';
    var el = document.createElement('div');
    el.className = 'slot' + (st === '마감' ? ' full' : '');
    el.innerHTML = '<b>' + t + '</b><span>' + st + '</span>';
    slotBox.appendChild(el);
  });
  if (slotBox && sc.confirmed === false) {
    var n = document.createElement('p');
    n.className = 'map-note';
    n.style.width = '100%';
    n.style.textAlign = 'center';
    n.innerHTML = '<span class="ph" title="' + sc.note + '">출발 시간표 · 잔여 표기는 임시 데모 값</span>';
    slotBox.appendChild(n);
    phCount++;
  }

  /* ---- 차량 카드 ---- */
  var vg = document.getElementById('vehGrid');
  if (vg) F.vehicles.forEach(function (v) {
    var p = F.price[v.price];
    var paxPh = v.pax.confirmed === false ? ' class="ph"' : '';
    var pricePh = p.confirmed === false ? ' class="ph"' : '';
    if (v.pax.confirmed === false) phCount++;
    if (p.confirmed === false) phCount++;
    var el = document.createElement(v.href ? 'a' : 'article');
    el.className = 'veh';
    if (v.href) el.href = v.href;
    el.innerHTML =
      '<div class="veh-img"><span class="veh-tag">' + v.tag + '</span>' +
      '<img src="assets/img/' + v.img + '" alt="' + v.name + '" loading="lazy"></div>' +
      '<div class="veh-body">' +
      '<span class="veh-en">' + v.en + '</span>' +
      '<h3>' + v.name + (v.href ? ' <span class="veh-more">상세 →</span>' : '') + '</h3>' +
      '<p class="veh-desc">' + v.desc + '</p>' +
      '<div class="veh-meta"><span class="veh-pax"><span' + paxPh + '>' + v.pax.v + '</span></span>' +
      '<span class="veh-price"><span' + pricePh + '>' + p.v + '</span><i>/ ' + v.unit + '</i></span></div>' +
      '</div>';
    vg.appendChild(el);
  });

  /* ---- 리뷰 인용 ---- */
  var qb = document.getElementById('quotes');
  if (qb) F.reviews.forEach(function (r) {
    var el = document.createElement('blockquote');
    el.className = 'quote';
    el.innerHTML = '<p>“' + r.q + '”</p><span>' + r.src + '</span>';
    qb.appendChild(el);
  });

  /* ---- 차량 디테일 갤러리(상세 페이지) ---- */
  var gal = document.getElementById('h1Gal');
  if (gal) {
    F.h1.gallery.forEach(function (g) {
      var fig = document.createElement('figure');
      fig.innerHTML = '<img src="assets/img/' + g.img + '" alt="' + g.cap + '" loading="lazy">' +
                      '<figcaption>' + g.cap + '</figcaption>';
      gal.appendChild(fig);
    });
  }


  /* ---- 유튜브 라이트 임베드 (클릭해야 iframe 로드 — 초기 로딩 부담 없음) ---- */
  function ytCard(v, kind) {
    var el = document.createElement('article');
    el.className = 'yt' + (kind === 'tv' ? ' yt-tv' : '');
    el.innerHTML =
      '<button class="yt-thumb" data-id="' + v.id + '" aria-label="' + v.title + ' 재생">' +
      '<img src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt="" decoding="async" width="480" height="360">' +
      '<span class="yt-play" aria-hidden="true"></span></button>' +
      '<div class="yt-meta">' +
      (v.show ? '<span class="yt-show">' + v.show + '</span>' : '') +
      (v.tag ? '<span class="yt-show">' + v.tag + '</span>' : '') +
      '<h3>' + v.title + '</h3>' +
      (v.date ? '<span class="yt-date">' + v.date + '</span>' : '') +
      '</div>';
    el.querySelector('.yt-thumb').addEventListener('click', function (e) {
      var b = e.currentTarget;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.id + '?autoplay=1&rel=0';
      f.title = v.title;
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      f.loading = 'lazy';
      b.replaceWith(f);
    });
    return el;
  }
  ['ytBroadcast', 'ytOwn'].forEach(function (id) {
    var box = document.getElementById(id);
    if (!box) return;
    var list = id === 'ytBroadcast' ? F.videos.broadcast : F.videos.own;
    var limit = +box.dataset.limit || list.length;
    list.slice(0, limit).forEach(function (v) {
      box.appendChild(ytCard(v, id === 'ytBroadcast' ? 'tv' : 'own'));
    });
  });

  var refBox = document.getElementById('ytRefGrid');
  if (refBox && F.refVideos && F.refVideos[refBox.dataset.key]) {
    var r = F.refVideos[refBox.dataset.key];
    var card = ytCard({ id: r.id, title: r.title, show: '외부 영상 · ' + r.channel }, 'tv');
    card.classList.add('yt-ref-card');
    refBox.appendChild(card);
    var n = document.createElement('p');
    n.className = 'img-note';
    n.style.gridColumn = '1 / -1';
    n.textContent = '※ ' + r.channel + ' 채널의 영상입니다. 제라진캠프 제작물이 아닙니다.';
    refBox.appendChild(n);
  }

  var chBtn = document.getElementById('ytChannel');
  if (chBtn) { chBtn.href = F.media.channelUrl.v; chBtn.textContent = F.media.channel.v + ' 채널 전체 보기 →'; }

  /* ---- FAQ ---- */
  var faqs = [
    ['제가 직접 운전할 수 있나요?', '불가능합니다. 험지 주파는 고도의 기술이 필요해 모든 투어는 베테랑 전문 드라이버가 운행합니다.'],
    ['비가 오면 어떻게 되나요?', '비 오는 날은 진흙을 튀기며 달리는 오프로드 본연의 재미가 커집니다. 우비를 준비해 주세요. 다만 기상 악화로 현장 통제가 필요한 경우에는 당일 아침 안내 후 전액 환불됩니다.'],
    ['투어 중 화장실을 쓸 수 있나요?', '광활한 사유지를 쉬지 않고 도는 코스라 투어 시작 후에는 이용이 어렵습니다. 반드시 탑승 전에 다녀와 주세요.'],
    ['아이와 함께 탈 수 있나요?', '만 3세 이상부터 탑승 가능하며 사전 동의서 작성이 필요합니다. 만 13세 미만은 성인 보호자가 동행해야 합니다.'],
    ['키·몸무게 제한이 있나요?', '안전벨트와 안전바 체결이 필요해 신장·체중 제한이 있습니다. 차량별 기준은 예약 단계에서 안내됩니다.'],
    ['많이 무섭나요?', '초반 엔진음과 바운스에 놀라는 분이 많지만, 대부분 투어가 끝나면 한 번 더 타고 싶다고 하십니다. 멀미가 심한 분, 척추·관절 질환이 있는 분은 권장하지 않습니다.'],
    ['사진을 찍어주나요?', '네. 코스 중간 포토스팟에서 드라이버가 직접 사진과 영상을 찍어 드립니다.'],
    ['당일 예약도 되나요?', '가능하지만 웹 결제만으로 확정되지 않습니다. 전화로 실시간 스케줄과 잔여 좌석을 확인한 뒤 진행해 주세요.']
  ];
  var h1Faqs = [
    ['험비는 일반 차량과 뭐가 다른가요?', '원래 군용 전술차량이라 차체가 넓고 지상고가 높습니다. 같은 코스를 달려도 통과하는 방식이 달라 진동과 소리가 훨씬 큽니다.'],
    ['정원이 다 차야 출발하나요?', '혼승으로 운영되는 날에는 다른 팀과 함께 타게 될 수 있습니다. 일행끼리만 타고 싶다면 프라이빗 차량을 권합니다.'],
    ['아이도 험비를 탈 수 있나요?', '연령 기준은 다른 차량과 같지만 차체가 높고 진동이 큰 편입니다. 어린 자녀와 함께라면 예약 전 전화로 상담해 주세요.'],
    ['승하차가 힘들지 않나요?', '차체가 높아 발판을 밟고 올라야 합니다. 스태프가 보조하며, 거동이 불편하신 분은 미리 알려주시면 좌석을 배려합니다.'],
    ['비 오는 날에도 운행하나요?', '운행합니다. 개방형 캐빈이라 비가 들이칠 수 있어 우비를 준비해 주세요. 기상 악화로 통제될 경우 전액 환불됩니다.']
  ];
  var fb = document.getElementById('faq');
  if (document.body.dataset.page === 'visit') {
    ld({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(function (f) {
        return { '@type': 'Question', name: f[0],
                 acceptedAnswer: { '@type': 'Answer', text: f[1] } };
      })
    });
  }
  if (window.PAGE_FAQ && window.PAGE_FAQ.length) faqs = window.PAGE_FAQ;
  void h1Faqs;
  if (fb) faqs.forEach(function (f, i) {
    var d = document.createElement('details');
    if (i === 0) d.open = true;
    d.innerHTML = '<summary>' + f[0] + '</summary><p>' + f[1] + '</p>';
    fb.appendChild(d);
  });

  /* ---- 구조화 데이터(JSON-LD) — 값은 모두 fact.js 에서 가져온다 ----
     confirmed:false 인 요금은 검색엔진에 노출하지 않는다(오표시 방지). */
  function ld(obj) {
    var el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(obj);
    document.head.appendChild(el);
  }
  var BASE = 'https://jejugrapher.github.io/jejuoffroad/';
  var page = document.body.dataset.page || '';
  var B = F.brand;

  var biz = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TouristAttraction'],
    name: B.nameKo.v,
    alternateName: B.nameEn.v,
    description: '제주 조천 13만 평 사유지 곶자왈과 초원을 달리는 오프로드 투어.',
    url: BASE,
    telephone: B.tel.v,
    email: B.email.v,
    image: BASE + 'assets/img/og-image.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: B.addrRoad.v.replace('제주특별자치도 제주시 ', ''),
      addressLocality: '제주시',
      addressRegion: '제주특별자치도',
      addressCountry: 'KR'
    },
    openingHours: 'Mo-Su 10:00-17:00',
    founder: { '@type': 'Person', name: B.ceo.v }
  };
  if (page === 'home') ld(biz);

  if (page === 'vehicle') {
    var k = document.body.dataset.vehicle;
    var v = F[k];
    var card = (F.vehicles.filter(function (x) { return x.id === k; })[0]) || null;
    var prod = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: document.querySelector('.vh-title') ? document.querySelector('.vh-title').childNodes[0].nodeValue.trim() : k,
      description: v && v.origin ? v.origin.v : '',
      brand: { '@type': 'Brand', name: v && v.maker ? v.maker.v : B.nameKo.v },
      image: BASE + (document.querySelector('.vh-hero-media img') ? document.querySelector('.vh-hero-media img').getAttribute('src') : 'assets/img/og-image.jpg')
    };
    ld(prod);
  }

  if (page === 'media' && F.videos) {
    F.videos.broadcast.concat(F.videos.own).forEach(function (v) {
      ld({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: v.title,
        description: (v.show || v.tag || '') + ' · 제라진 오프로드',
        thumbnailUrl: 'https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/' + v.id,
        uploadDate: '2019-01-01'
      });
    });
  }

  /* ---- 코스 이벤트 핀 16개 ---- */
  var track = document.getElementById('track');
  var pins = document.getElementById('pins');
  if (track && pins) {
    var L = track.getTotalLength();
    for (var i = 0; i < 16; i++) {
      var pt = track.getPointAtLength((L / 16) * i + L / 32);
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.setAttribute('r', 9);
      var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', pt.x); t.setAttribute('y', pt.y + 3.2);
      t.textContent = i + 1;
      g.appendChild(c); g.appendChild(t); pins.appendChild(g);
    }
  }

  /* ---- 헤더 스크롤 ---- */
  var hdr = document.getElementById('hdr');
  var onScroll = function () { hdr.classList.toggle('solid', window.scrollY > 60); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- 시안 패널 ---- */
  document.body.classList.add('ph-on');
  var cnt = document.getElementById('phCount');
  cnt.textContent = '미확정 수치 ' + phCount + '곳';
  document.getElementById('phToggle').addEventListener('change', function (e) {
    document.body.classList.toggle('ph-on', e.target.checked);
  });
  var proto = document.getElementById('proto');
  if (window.matchMedia('(max-width:720px)').matches) proto.classList.add('closed');
  document.getElementById('protoT').addEventListener('click', function () {
    proto.classList.toggle('closed');
  });
})();
