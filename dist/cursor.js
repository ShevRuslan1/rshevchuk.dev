/* A small, fading trail of ink pixels. The normal system cursor stays intact. */
(() => {
  const canvas = document.getElementById('cursor-trail');
  const pen = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mouse = matchMedia('(hover: hover) and (pointer: fine)');
  let particles = [];
  let request = null;
  let previous = null;
  let sequence = 0;
  let color;
  let scale = 1;

  function enabled() {
    return mouse.matches && !reduce.matches && !document.hidden && !document.body.classList.contains('motion-paused');
  }
  function clear() {
    particles = [];
    previous = null;
    if (request !== null) cancelAnimationFrame(request);
    request = null;
    pen.clearRect(0,0,innerWidth,innerHeight);
  }
  function resize() {
    scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * scale);
    canvas.height = Math.round(innerHeight * scale);
    pen.setTransform(scale,0,0,scale,0,0);
    clear();
  }
  function draw(time) {
    request = null;
    if (!enabled()) { clear(); return; }
    pen.clearRect(0,0,innerWidth,innerHeight);
    particles = particles.filter(p => time - p.born < 650);
    pen.fillStyle = color;
    for (const p of particles) {
      const age = Math.max(0, (time - p.born) / 650);
      const x = Math.round(p.x + p.drift * age);
      const y = Math.round(p.y + 13 * age * age);
      pen.globalAlpha = .58 * (1 - age) ** 2;
      const size = p.star ? 2 : p.size;
      pen.fillRect(x,y,size,size);
      if (p.star) {
        pen.fillRect(x - 3,y + .5,8,1);
        pen.fillRect(x + .5,y - 3,1,8);
      }
    }
    pen.globalAlpha = 1;
    if (particles.length) request = requestAnimationFrame(draw);
  }
  function move(event) {
    if (event.pointerType !== 'mouse' || !enabled()) return;
    const now = performance.now();
    if (previous && (now - previous.time < 18 || Math.hypot(event.clientX-previous.x,event.clientY-previous.y)<4)) return;
    previous = { x:event.clientX, y:event.clientY, time:now };
    for (let i=0; i<2; i++) {
      sequence++;
      particles.push({ x:event.clientX + (i ? 5 : -5), y:event.clientY + 7 + i*3,
        born:now, size:sequence%3===0 ? 2 : 1.5, drift:(sequence%7)-3,
        star:sequence%13===0 });
    }
    particles = particles.slice(-48);
    if (request === null) request = requestAnimationFrame(draw);
  }
  function sync() {
    color = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
    if (!enabled()) clear();
  }
  const observer = new MutationObserver(sync);
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  observer.observe(document.body,{attributes:true,attributeFilter:['class']});
  document.addEventListener('pointermove',move,{passive:true});
  document.addEventListener('pointerleave',clear);
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('resize',resize,{passive:true});
  window.addEventListener('pagehide',clear);
  reduce.addEventListener('change',sync);
  mouse.addEventListener('change',sync);
  resize();
  sync();
})();
