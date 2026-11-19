/* Original Unicode interpretation of the user's black-hole reference.
   Stylized disk/lensing geometry, not a relativistic physics solver. */
(() => {
  const canvas=document.getElementById('work-black-hole');
  const ctx=canvas.getContext('2d');
  const page=document.getElementById('work');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const glyphs=['·',':','∷','+','*','≋','▒','▓'];
  const cells=[];
  const smooth=(a,b,n)=>{const t=Math.max(0,Math.min(1,(n-a)/(b-a)));return t*t*(3-2*t);};
  // Sample the inclined disk and its bent rear image onto a text grid.
  for(let y=-100;y<=100;y+=5.8)for(let x=-180;x<=180;x+=4.4){
    const radius=Math.hypot(x,y);
    const diskRadius=Math.hypot(x,y/.31);
    const disk=smooth(51,59,diskRadius)*(1-smooth(125,176,diskRadius));
    const ringRadius=Math.hypot(x,y*(y<0?.89:1.12));
    const lens=smooth(42,47,ringRadius)*(1-smooth(50,65,ringRadius))*(y<0?1:.48);
    const photon=Math.exp(-(((radius-41.5)/1.7)**2))*.7;
    const shadow=radius<40;
    // The near side of the disk crosses in front of the dark shadow.
    const emission=(shadow&&y<0?0:disk)+(!shadow?lens+photon:0);
    if(emission<.035)continue;
    cells.push({x,y,disk:shadow&&y<0?0:disk,lens:shadow?0:lens,
      photon:shadow?0:photon,r:diskRadius,a:Math.atan2(y/.31,x),
      la:Math.atan2(y,x),speed:(60/Math.max(50,diskRadius))**1.5,
      seed:Math.sin(x*12.98+y*78.23)*43758.5453%1});
  }
  let time=0,previous=0,request=null,dark=false;
  function drawGrid(){
    ctx.strokeStyle=dark?'#776c91':'#a59cb6';ctx.lineWidth=.55;ctx.globalAlpha=.21;
    // Project a grid into a shallow gravitational well below the disk.
    for(let axis=0;axis<2;axis++)for(let line=-7;line<=7;line++){
      ctx.beginPath();let started=false;
      for(let step=-85;step<=85;step+=2){
        const u=axis?step*2:line*23,v=axis?line*23:step*2;
        const r=Math.hypot(u,v);
        if(r<43){started=false;continue;}
        const x=u*.9+v*.31,y=55+v*.29-1300/(r+16);
        if(!started){ctx.moveTo(x,y);started=true;}else ctx.lineTo(x,y);
      }
      ctx.stroke();
    }
  }
  function draw(){
    ctx.setTransform(canvas.width/400,0,0,canvas.height/300,0,0);
    ctx.clearRect(0,0,400,300);ctx.save();ctx.translate(200,145);ctx.rotate(-.10);
    drawGrid();
    ctx.globalAlpha=1;ctx.fillStyle='#08070c';
    ctx.beginPath();ctx.arc(0,0,40.5,0,Math.PI*2);ctx.fill();
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='7px "Consolas", "DejaVu Sans Mono", monospace';
    for(const c of cells){
      const phase=c.a-time*c.speed;
      const gas=.67+.17*Math.sin(phase*5+c.r*.15)+.12*Math.sin(phase*11-c.r*.3)+.06*Math.sin(phase*23+c.seed*9);
      const bent=.78+.18*Math.sin(c.la*8-time*1.4+c.r*.08);
      const light=(c.disk*gas*1.45+c.lens*bent+c.photon)*(.94-.16*c.x/176);
      const level=Math.min(7,Math.max(0,Math.floor(light*6.7)));
      const hot=Math.min(1,light*.68);
      ctx.fillStyle=dark?`rgb(255,${Math.round(137+110*hot)},${Math.round(56+145*hot)})`:
        `rgb(${Math.round(139+57*hot)},${Math.round(71+53*hot)},${Math.round(20+19*hot)})`;
      ctx.globalAlpha=Math.min(1,.32+light*.8);
      ctx.fillText(glyphs[level],c.x,c.y);
    }
    ctx.restore();ctx.globalAlpha=1;
  }
  function running(){return !document.hidden&&!page.hidden&&!reduce.matches&&!document.body.classList.contains('motion-paused');}
  function frame(now){
    request=null;if(!running()){previous=0;return;}
    if(!previous)previous=now;
    if(now-previous>=1000/24){time+=Math.min(now-previous,80)/1000;previous=now;draw();}
    request=requestAnimationFrame(frame);
  }
  function sync(){
    dark=document.documentElement.dataset.theme==='dark';draw();
    if(request!==null)cancelAnimationFrame(request);
    request=null;previous=0;if(running())request=requestAnimationFrame(frame);
  }
  const observer=new MutationObserver(sync);
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  observer.observe(document.body,{attributes:true,attributeFilter:['class']});
  observer.observe(page,{attributes:true,attributeFilter:['hidden']});
  reduce.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  window.addEventListener('pagehide',()=>{if(request!==null)cancelAnimationFrame(request);request=null;});
  window.addEventListener('pageshow',sync);sync();
})();
