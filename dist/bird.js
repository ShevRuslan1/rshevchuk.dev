/* Procedural flight study. All shapes, feathers, and stippling are drawn in code.
   No image files, sprite sheets, generated artwork, or animation dependencies. */
(() => {
  const canvas = document.getElementById('flight-bird');
  const context = canvas.getContext('2d');
  const mask = document.createElement('canvas');
  mask.width = 300;
  mask.height = 200;
  const pen = mask.getContext('2d', { willReadFrequently: true });
  const home = document.getElementById('home');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const TAU = Math.PI * 2;
  let clock = 0;
  let previousTime = 0;
  let request = null;
  let ink;
  let paper;

  // Corresponding feather tips interpolate between the upstroke and downstroke.
  const up = [[158,112],[139,87],[118,60],[80,25],[84,44],[95,63],
    [82,49],[89,69],[106,87],[94,79],[105,98],[119,110],[113,106],[135,122]];
  const down = [[158,112],[143,133],[127,151],[83,177],[89,160],[103,146],
    [88,155],[99,138],[117,128],[104,132],[116,119],[133,111],[125,112],[141,105]];

  function polygon(points, shade) {
    pen.fillStyle = shade;
    pen.beginPath();
    points.forEach(([x, y], i) => i ? pen.lineTo(x, y) : pen.moveTo(x, y));
    pen.closePath();
    pen.fill();
  }

  function wing(amount, far = false) {
    const points = up.map(([x, y], i) => {
      const px = x + (down[i][0] - x) * amount;
      const py = y + (down[i][1] - y) * amount;
      return far ? [158 + (px - 158) * .83 + 13, 109 + (py - 109) * .83 - 10] : [px, py];
    });
    polygon(points, far ? '#999' : '#eee');
    // Fine channels between flight feathers keep the wing readable at every pose.
    pen.strokeStyle = far ? '#777' : '#999';
    pen.lineWidth = .8;
    for (const index of [3, 5, 7, 9, 11]) {
      pen.beginPath();
      pen.moveTo(...points[index]);
      pen.lineTo(points[0][0] - 8, points[0][1]);
      pen.stroke();
    }
  }

  function noise(x, y) {
    let n = Math.imul(x + 37, 374761393) ^ Math.imul(y + 91, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  }

  function draw() {
    // Each 7.2s loop contains four wingbeats followed by a short glide.
    const cycle = clock % 7.2;
    const amount = cycle < 4.8 ? (1 - Math.cos(cycle / 1.2 * TAU)) / 2 : 0;
    pen.clearRect(0, 0, 300, 200);
    wing(Math.min(1, amount + .1), true);
    polygon([[133,112],[108,105],[66,102],[92,114],[68,132],[113,123],[143,121]], '#ccc');
    pen.fillStyle = '#eee';
    pen.beginPath();
    pen.moveTo(114,113);
    pen.bezierCurveTo(131,107,145,97,168,100);
    pen.bezierCurveTo(179,101,182,89,193,88);
    pen.bezierCurveTo(203,87,209,94,207,102);
    pen.bezierCurveTo(200,108,194,114,184,119);
    pen.bezierCurveTo(164,131,138,128,114,113);
    pen.fill();
    polygon([[204,95],[224,100],[204,103]], '#eee');
    // A lighter breast separates the body from the foreground wing.
    pen.fillStyle = '#888';
    pen.beginPath();
    pen.ellipse(177,116,19,5,-.3,0,TAU);
    pen.fill();
    wing(amount);

    const pixels = pen.getImageData(0,0,300,200).data;
    context.setTransform(2,0,0,2,0,0);
    context.clearRect(0,0,300,200);
    context.save();
    context.translate(Math.sin(clock / 7.2 * TAU) * 9, Math.sin(clock / 2.4 * TAU) * 3);
    context.fillStyle = ink;
    // Fixed seeded dots prevent random flicker while the silhouette changes.
    for (let y = 20; y < 185; y += 2) {
      for (let x = 60; x < 228; x += 2) {
        const offset = (y * 300 + x) * 4;
        const shade = pixels[offset] / 255;
        const seed = noise(x, y);
        if (pixels[offset + 3] < 100 || seed > .42 + shade * .52) continue;
        context.globalAlpha = .35 + shade * .55;
        const size = seed < .2 ? 1.65 : 1.15;
        context.fillRect(x + noise(y,x) * .5, y, size, size);
      }
    }
    context.globalAlpha = 1;
    context.fillStyle = paper;
    context.fillRect(198,94,3.5,3.5);
    context.fillStyle = ink;
    context.fillRect(199,95,2,2);
    context.restore();
  }

  function isRunning() {
    return !document.hidden && !home.hidden && !reducedMotion.matches && !document.body.classList.contains('motion-paused');
  }

  function frame(time) {
    request = null;
    if (!isRunning()) { previousTime = 0; return; }
    if (!previousTime) previousTime = time;
    const delta = time - previousTime;
    // Cap rendering at 30fps and avoid jumps after a suspended tab.
    if (delta >= 1000 / 30) {
      clock += Math.min(delta, 80) / 1000;
      previousTime = time;
      draw();
    }
    request = requestAnimationFrame(frame);
  }

  function sync() {
    const style = getComputedStyle(document.documentElement);
    ink = style.getPropertyValue('--ink').trim();
    paper = style.getPropertyValue('--paper').trim();
    draw();
    if (request !== null) cancelAnimationFrame(request);
    request = null;
    previousTime = 0;
    if (isRunning()) request = requestAnimationFrame(frame);
  }
  const observer = new MutationObserver(sync);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  observer.observe(home, { attributes: true, attributeFilter: ['hidden'] });
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  window.addEventListener('pagehide', () => { if (request !== null) cancelAnimationFrame(request); request = null; });
  window.addEventListener('pageshow', sync);
  sync();
})();
