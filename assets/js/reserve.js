/* 예약 3스텝 위저드 + 전자 사전동의서(e-Waiver) — 시안용 프런트 동작
   실제 운영 시 잔여 좌석은 예약 시스템 API로 대체한다. */
(function () {
  var F = window.JERAZIN_FACT;
  var state = { date: null, time: null, type: null, veh: null, step: 1 };

  /* ---------- 달력 (이번 달 + 다음 달 일부, 잔여는 데모) ---------- */
  var cal = document.getElementById('rsvCal');
  var today = new Date();
  var demoFull = [3, 9, 14, 21];              // 데모: 마감일
  function buildCal() {
    var y = today.getFullYear(), m = today.getMonth();
    var first = new Date(y, m, 1), last = new Date(y, m + 1, 0);
    var html = '<div class="cal-head"><b>' + y + '년 ' + (m + 1) + '월</b>' +
               '<span>· 잔여 표기는 임시 데모 값</span></div><div class="cal-grid">';
    ['일', '월', '화', '수', '목', '금', '토'].forEach(function (d) {
      html += '<span class="cal-dow">' + d + '</span>';
    });
    for (var i = 0; i < first.getDay(); i++) html += '<span></span>';
    for (var d = 1; d <= last.getDate(); d++) {
      var past = d < today.getDate();
      var full = demoFull.indexOf(d) > -1;
      var cls = 'cal-d' + (past ? ' past' : '') + (full && !past ? ' full' : '');
      html += '<button class="' + cls + '" data-d="' + d + '"' + (past || full ? ' disabled' : '') + '>' +
              d + (past ? '' : full ? '<i>마감</i>' : '<i>여유</i>') + '</button>';
    }
    cal.innerHTML = html + '</div>';
    cal.querySelectorAll('.cal-d:not([disabled])').forEach(function (b) {
      b.addEventListener('click', function () {
        cal.querySelectorAll('.cal-d').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        state.date = (today.getMonth() + 1) + '월 ' + b.dataset.d + '일';
        sync();
      });
    });
  }

  /* ---------- 출발 시간 ---------- */
  var slotBox = document.getElementById('rsvSlots');
  var demoState = ['여유', '여유', '마감임박', '여유', '여유', '마감', '여유'];
  function buildSlots() {
    F.schedule.slots.v.forEach(function (t, i) {
      var st = demoState[i] || '여유';
      var el = document.createElement('button');
      el.className = 'slot' + (st === '마감' ? ' full' : '');
      el.innerHTML = '<b>' + t + '</b><span>' + st + '</span>';
      if (st === '마감') el.disabled = true;
      else el.addEventListener('click', function () {
        slotBox.querySelectorAll('.slot').forEach(function (x) { x.classList.remove('on'); });
        el.classList.add('on');
        state.time = t;
        sync();
      });
      slotBox.appendChild(el);
    });
    if (F.schedule.slots.confirmed === false) {
      var n = document.createElement('p');
      n.className = 'map-note';
      n.style.cssText = 'width:100%;margin-top:8px';
      n.innerHTML = '<span class="ph" title="' + F.schedule.slots.note + '">출발 시간표 확정 전</span>';
      slotBox.appendChild(n);
    }
  }

  /* ---------- 형태 선택 ---------- */
  document.querySelectorAll('.rsv-card').forEach(function (c) {
    c.addEventListener('click', function () {
      document.querySelectorAll('.rsv-card').forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
      state.type = c.dataset.type;
      state.veh = null;
      buildVehs();
      sync();
    });
  });

  /* ---------- 차량 선택 ---------- */
  var VEHS = {
    public: [
      { id: 'suv', name: '오프로드 SUV', en: 'TUNED SUV', img: 'vehicle-suv.jpg', price: 'publicPerPerson', unit: '1인', pax: 'suv' },
      { id: 'h1', name: '험머 H1 (험비)', en: 'HUMMER H1', img: 'vehicle-h1.jpg', price: 'hummerH1', unit: '1인', pax: 'h1' }
    ],
    private: [
      { id: 'h3', name: '험머 H3', en: 'HUMMER H3', img: null, price: 'hummerH3', unit: '1대', pax: 'h3' },
      { id: 'rubicon', name: '지프 루비콘', en: 'JEEP RUBICON', img: 'vehicle-rubicon.jpg', price: 'rubicon', unit: '1대', pax: 'rubicon' },
      { id: 'komando', name: '코만도', en: 'KOMANDO', img: null, price: 'komando', unit: '1대', pax: 'komando' }
    ]
  };
  var vehBox = document.getElementById('rsvVehs');
  function buildVehs() {
    vehBox.innerHTML = '';
    var list = VEHS[state.type] || [];
    document.getElementById('rsvVehNote').textContent =
      state.type === 'private' ? '프라이빗은 차량을 직접 고릅니다. 요금은 1대 기준입니다.'
                               : '혼승은 당일 운영 상황에 따라 차량이 배정됩니다. 원하는 차종이 있으면 선택해 주세요.';
    list.forEach(function (v) {
      var p = F.price[v.price], pax = F[v.pax].pax;
      var el = document.createElement('button');
      el.className = 'rsv-veh';
      el.innerHTML =
        (v.img ? '<img src="assets/img/' + v.img + '" alt="' + v.name + '">'
               : '<div class="vh-shot-todo"><span class="m-ph">촬영 자리</span></div>') +
        '<div><span class="veh-en">' + v.en + '</span><b>' + v.name + '</b>' +
        '<span class="rsv-veh-pax' + (pax.confirmed === false ? ' ph' : '') + '">' + pax.v + '</span>' +
        '<span class="rsv-veh-price' + (p.confirmed === false ? ' ph' : '') + '">' + p.v + ' / ' + v.unit + '</span></div>';
      el.addEventListener('click', function () {
        vehBox.querySelectorAll('.rsv-veh').forEach(function (x) { x.classList.remove('on'); });
        el.classList.add('on');
        state.veh = v;
        sync();
      });
      vehBox.appendChild(el);
    });
  }

  /* ---------- 단계 이동 ---------- */
  var steps = document.querySelectorAll('.rsv-step');
  var navs = document.querySelectorAll('#rsvNav li');
  var prev = document.getElementById('rsvPrev');
  var next = document.getElementById('rsvNext');
  var pay = document.getElementById('rsvPay');
  var form = document.getElementById('waiverForm');

  function canGo(s) {
    if (s === 1) return !!(state.date && state.time);
    if (s === 2) return !!state.type;
    if (s === 3) return !!state.veh;
    return true;
  }
  function show(s) {
    state.step = s;
    steps.forEach(function (el) { el.classList.toggle('on', +el.dataset.step === s); });
    navs.forEach(function (el, i) {
      el.classList.toggle('on', i + 1 === s);
      el.classList.toggle('done', i + 1 < s);
    });
    prev.disabled = s === 1;
    next.hidden = s === 4;
    pay.hidden = s !== 4;
    if (s === 4) summary();
    sync();
    window.scrollTo({ top: document.querySelector('.rsv').offsetTop - 70, behavior: 'smooth' });
  }
  function sync() {
    next.disabled = !canGo(state.step);
    if (state.step === 4) {
      var all = form.querySelectorAll('input[type=checkbox]');
      var done = form.querySelectorAll('input[type=checkbox]:checked').length === all.length;
      pay.classList.toggle('is-off', !done);
    }
  }
  function summary() {
    var p = state.veh ? F.price[state.veh.price] : null;
    document.getElementById('rsvSum').innerHTML =
      '<h3>예약 내용</h3><dl>' +
      '<dt>일시</dt><dd>' + (state.date || '-') + ' ' + (state.time || '') + '</dd>' +
      '<dt>형태</dt><dd>' + (state.type === 'private' ? '프라이빗 단독' : '혼승') + '</dd>' +
      '<dt>차량</dt><dd>' + (state.veh ? state.veh.name : '-') + '</dd>' +
      '<dt>요금</dt><dd><span class="' + (p && p.confirmed === false ? 'ph' : '') + '">' +
        (p ? p.v + ' / ' + state.veh.unit : '-') + '</span></dd></dl>' +
      '<p class="rsv-sum-n">당일 예약은 결제 후에도 전화 확인이 필요합니다.</p>';
  }

  prev.addEventListener('click', function () { if (state.step > 1) show(state.step - 1); });
  next.addEventListener('click', function () { if (canGo(state.step)) show(state.step + 1); });
  form.addEventListener('change', sync);
  pay.addEventListener('click', function (e) {
    e.preventDefault();
    if (pay.classList.contains('is-off')) { alert('사전 동의 항목을 모두 확인해 주세요.'); return; }
    alert('시안입니다. 실제 사이트에서는 이 버튼이 아임웹·네이버예약 결제 페이지로 연결됩니다.');
  });

  buildCal();
  buildSlots();
  buildVehs();
  show(1);
})();
