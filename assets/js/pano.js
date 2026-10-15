/* 360° 코스 미리보기 — equirect 파노라마 뷰어
   · three.js 는 "둘러보기"를 누를 때만 내려받는다(초기 로딩 부담 0)
   · 소스: Avata360 8K 스티칭본에서 추출한 equirect 스틸 */
(function () {
  var box = document.getElementById('pano');
  if (!box) return;

  var THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  var scene, camera, renderer, mesh, raf;
  var lon = 0, lat = 0, drag = false, px = 0, py = 0, fov = 78, loaded = false;

  function loadThree() {
    return new Promise(function (res, rej) {
      if (window.THREE) return res();
      var s = document.createElement('script');
      s.src = THREE_URL;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  function texture(src) {
    return new THREE.TextureLoader().load(src, function () { box.classList.remove('is-loading'); });
  }

  function start(src) {
    box.classList.add('is-loading');
    loadThree().then(function () {
      var w = box.clientWidth, h = box.clientHeight;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(fov, w / h, 1, 1100);
      var geo = new THREE.SphereGeometry(500, 60, 40);
      geo.scale(-1, 1, 1);                       // 안쪽에서 보도록 뒤집기
      mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: texture(src) }));
      scene.add(mesh);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      box.innerHTML = '';
      box.appendChild(renderer.domElement);
      box.classList.add('is-on');
      bind();
      animate();
      loaded = true;
    }).catch(function () {
      box.classList.remove('is-loading');
      box.innerHTML = '<p class="pano-err">360 뷰어를 불러오지 못했습니다. 네트워크를 확인해 주세요.</p>';
    });
  }

  function bind() {
    var el = renderer.domElement;
    el.addEventListener('pointerdown', function (e) { drag = true; px = e.clientX; py = e.clientY; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', function (e) {
      if (!drag) return;
      lon -= (e.clientX - px) * 0.12;
      lat += (e.clientY - py) * 0.12;
      lat = Math.max(-80, Math.min(80, lat));
      px = e.clientX; py = e.clientY;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) {
      el.addEventListener(t, function () { drag = false; });
    });
    el.addEventListener('wheel', function (e) {
      e.preventDefault();
      fov = Math.max(35, Math.min(95, fov + e.deltaY * 0.05));
      camera.fov = fov; camera.updateProjectionMatrix();
    }, { passive: false });
    window.addEventListener('resize', function () {
      if (!renderer) return;
      var w = box.clientWidth, h = box.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    });
  }

  function animate() {
    raf = requestAnimationFrame(animate);
    if (!drag) lon += 0.02;                      // 손을 떼면 천천히 자동 회전
    var phi = THREE.MathUtils.degToRad(90 - lat);
    var theta = THREE.MathUtils.degToRad(lon);
    camera.lookAt(
      500 * Math.sin(phi) * Math.cos(theta),
      500 * Math.cos(phi),
      500 * Math.sin(phi) * Math.sin(theta)
    );
    renderer.render(scene, camera);
  }

  /* 시작 버튼 */
  box.querySelector('.pano-start').addEventListener('click', function () {
    start(box.dataset.src);
  });

  /* 지점 전환 탭 */
  document.querySelectorAll('.pano-tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.pano-tab').forEach(function (x) { x.classList.remove('on'); });
      t.classList.add('on');
      box.dataset.src = t.dataset.src;
      if (!loaded) { start(t.dataset.src); return; }
      box.classList.add('is-loading');
      mesh.material.map = texture(t.dataset.src);
      mesh.material.needsUpdate = true;
    });
  });
})();
