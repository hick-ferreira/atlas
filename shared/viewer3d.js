/* Visualizador 3D compartilhado (three.js). Cada página chama mount3D() com os músculos do atlas. */
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/addons/loaders/DRACOLoader.js";

const DRACO="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/";
const CSS=`
.v3{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,1fr);gap:0;overflow:hidden;padding:0}
.v3-stage{position:relative;min-height:460px;background:radial-gradient(120% 90% at 50% 35%,var(--surface),var(--surface2));touch-action:none}
.v3-stage canvas{position:absolute;inset:0;width:100%;height:100%;display:block;outline:none;cursor:grab}
.v3-stage canvas:active{cursor:grabbing}
.v3-views{position:absolute;top:12px;left:12px;display:flex;gap:6px;flex-wrap:wrap;z-index:2}
.v3-views button,.v3-btn{border:1.5px solid var(--line);background:color-mix(in srgb,var(--surface) 90%,transparent);border-radius:999px;padding:6px 12px;font-size:.82rem;font-weight:600;color:var(--ink);backdrop-filter:blur(6px)}
.v3-views button:hover,.v3-btn:hover{border-color:var(--ink)}
.v3-views button[aria-pressed=true],.v3-btn[aria-pressed=true]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.v3-tip{position:absolute;z-index:3;pointer-events:none;background:var(--ink);color:var(--bg);font:600 12px/1.2 var(--f-body);padding:6px 10px;border-radius:8px;white-space:nowrap;transform:translate(12px,-120%);opacity:0;transition:opacity .1s}
.v3-hint{position:absolute;bottom:10px;left:0;right:0;text-align:center;font:500 11px/1.3 var(--f-mono);color:var(--muted);pointer-events:none;padding:0 12px}
.v3-msg{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:24px;color:var(--muted);font-size:.95rem;z-index:2;background:inherit}
.v3-msg[hidden]{display:none}
.v3-side{padding:18px;display:grid;gap:14px;align-content:start;border-left:1px solid var(--line);min-width:0}
.v3-list{display:flex;flex-wrap:wrap;gap:6px}
.v3-list button{display:flex;align-items:center;gap:7px;border:1.5px solid var(--line);background:var(--surface);border-radius:999px;padding:6px 12px 6px 9px;font-size:.86rem;font-weight:600}
.v3-list button::before{content:"";width:11px;height:11px;border-radius:50%;background:var(--c);flex:none}
.v3-list button[aria-pressed=true]{border-color:var(--c);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 28%,transparent)}
.v3-opts{display:grid;gap:8px;font-size:.88rem}
.v3-opts label{display:flex;align-items:center;gap:8px;color:var(--muted)}
.v3-opts input[type=checkbox]{accent-color:var(--ink);width:16px;height:16px;margin:0}
.v3-opts input[type=range]{flex:1;accent-color:var(--ink);height:22px}
.v3-row{display:flex;gap:8px;flex-wrap:wrap}
.v3-info{border-radius:14px;padding:14px;background:color-mix(in srgb,var(--c,var(--ink)) 10%,var(--surface2));border-left:5px solid var(--c,var(--line));display:grid;gap:8px;font-size:.92rem}
.v3-info h3{font:800 1.25rem var(--f-display);margin:0}
.v3-info .lat{font:500 12px var(--f-mono);color:var(--muted)}
.v3-info dl{margin:0;display:grid;gap:6px}
.v3-info dt{font:500 10.5px/1 var(--f-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.v3-info dd{margin:2px 0 0}
.v3-note{font-size:.76rem;color:var(--muted)}
@keyframes v3pop{from{transform:scale(.4);opacity:0}}
.v3-pins{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1}
.v3-pin{position:absolute;left:0;top:0;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;display:grid;place-items:center;font:700 12px/1 var(--f-mono);color:#fff;border:2.5px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.55);pointer-events:auto;cursor:help;transition:opacity .15s}
.v3-pin.oc{opacity:.28}
.v3-pin.in{animation:v3pop .25s ease-out}
.v3-leg{display:flex;gap:14px;flex-wrap:wrap;font-size:.8rem;color:var(--muted)}
.v3-leg i{display:inline-grid;place-items:center;width:18px;height:18px;border-radius:50%;font:700 10px var(--f-mono);color:#fff;font-style:normal;margin-right:5px;vertical-align:middle}
@media (max-width:820px){.v3{grid-template-columns:1fr}.v3-stage{min-height:400px}.v3-side{border-left:0;border-top:1px solid var(--line)}}
`;

const esc=s=>String(s??"").replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const limpa=n=>n.replace(/\s*\((direito|esquerdo)\)\s*$/,"").replace(/^\(|\)$/g,"");

export function mount3D(o){
  const side=o.side||".r",order=o.order,base=o.base;
  const root=o.root;
  if(!document.getElementById("v3-css")){const s=document.createElement("style");s.id="v3-css";s.textContent=CSS;document.head.appendChild(s)}
  root.classList.add("v3");
  root.innerHTML=`
  <div class="v3-stage">
    <canvas tabindex="0" aria-label="Modelo 3D. Arraste para girar, role para aproximar."></canvas>
    <div class="v3-views" role="group" aria-label="Vista"></div>
    <div class="v3-pins"></div>
    <div class="v3-tip"></div>
    <div class="v3-hint">arraste para girar · role ou pince para aproximar · toque num músculo</div>
    <div class="v3-msg">Carregando o modelo 3D…</div>
  </div>
  <div class="v3-side">
    <div class="v3-list" role="group" aria-label="Músculos do atlas"></div>
    <div class="v3-info" hidden></div>
    <div class="v3-opts">
      <label><input type="checkbox" data-o="bones" checked> Ossos</label>
      <label><input type="checkbox" data-o="ctx" checked> Outros músculos da região</label>
      <label><input type="checkbox" data-o="pins" checked> Origem e inserção do músculo escolhido</label>
      <label>Transparência <input type="range" data-o="op" min="0" max="85" value="0" aria-label="Transparência dos músculos"></label>
      <div class="v3-row"><button class="v3-btn" data-a="contract" aria-pressed="false">▶ Contrair</button><button class="v3-btn" data-a="spin" aria-pressed="false">Girar sozinho</button><button class="v3-btn" data-a="iso" aria-pressed="false">Isolar</button></div>
    </div>
    <div class="v3-leg"><span><i style="background:#4a5a70">O</i>origem</span><span><i style="background:#1d2733">I</i>inserção</span><span>posição aproximada: calculada a partir da forma do músculo e do osso mais próximo</span></div>
    <div class="v3-note">Modelo Z-Anatomy (CC BY-SA 4.0). A contração é ilustrativa e exagerada, não mede a deformação real.</div>
  </div>`;
  const $=s=>root.querySelector(s);
  const stage=$(".v3-stage"),canvas=$("canvas"),tip=$(".v3-tip"),msg=$(".v3-msg"),info=$(".v3-info");

  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true})}
  catch(e){msg.textContent="Seu navegador não conseguiu abrir o 3D (WebGL indisponível).";return{highlight(){},error:e}}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(32,1,0.01,20);
  scene.add(cam);
  scene.add(new THREE.HemisphereLight(0xffffff,0x7d8a99,1.0));
  const key=new THREE.DirectionalLight(0xffffff,1.6);key.position.set(0.5,0.8,1);cam.add(key);
  const fill=new THREE.DirectionalLight(0xffffff,0.5);fill.position.set(-1,-0.2,-0.6);cam.add(fill);
  const ctl=new OrbitControls(cam,canvas);
  ctl.enableDamping=true;ctl.dampingFactor=.12;ctl.autoRotateSpeed=1.6;ctl.screenSpacePanning=true;

  const css=k=>getComputedStyle(document.documentElement).getPropertyValue("--"+k).trim()||"#888";
  const BONE=0xe6dfcf,CTX=0xb8a597;
  const S={sel:null,bones:true,ctx:true,pins:true,op:0,iso:false,contract:false};
  const entries=[];           // {obj, kind, key, label, meshes:[]}
  const groups={};            // key -> {pivot, entries, axis}
  const pins={};              // key -> [{t:"O"|"I", p:Vector3}]
  let target=new THREE.Vector3(),dist=1,loaded=false,dirty=true,anim=null;

  /* ---- botões de vista e lista de músculos ---- */
  const VIEWS={frente:[0,0,1],costas:[0,0,-1],lateral:[-1,0,0],medial:[1,0,0]};
  const vb=$(".v3-views");
  Object.keys(VIEWS).forEach(v=>{const b=document.createElement("button");b.type="button";b.textContent=v[0].toUpperCase()+v.slice(1);b.dataset.v=v;b.setAttribute("aria-pressed",v==="frente");vb.appendChild(b)});
  const list=$(".v3-list");
  order.forEach(k=>{const b=document.createElement("button");b.type="button";b.dataset.k=k;b.textContent=o.info(k).nome;b.setAttribute("aria-pressed","false");list.appendChild(b)});
  function paintList(){list.querySelectorAll("button").forEach(b=>{b.style.setProperty("--c",css(b.dataset.k));b.setAttribute("aria-pressed",b.dataset.k===S.sel)})}

  function goView(v,instant){
    const d=VIEWS[v]||VIEWS.frente;
    const to=target.clone().add(new THREE.Vector3(...d).multiplyScalar(dist));
    vb.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===v));
    if(instant){cam.position.copy(to);ctl.target.copy(target);ctl.update();dirty=true;return}
    anim={t0:performance.now(),dur:650,from:cam.position.clone(),to,tf:ctl.target.clone(),tt:target.clone()};
  }

  /* ---- materiais e estado ---- */
  function aplica(){
    const sel=S.sel,opScale=1-S.op/100;
    entries.forEach(e=>{
      let vis=true,op=1,col,em=0;
      if(e.kind==="bone"){vis=S.bones;col=BONE;op=sel?0.55:1}
      else if(e.kind==="ctx"){vis=S.ctx&&!(S.iso&&sel);col=CTX;op=(sel?0.16:0.4)*opScale}
      else{
        col=new THREE.Color(css(e.key));
        const on=!sel||e.key===sel;
        vis=!(S.iso&&sel&&!on);
        op=(on?1:0.22)*opScale;
        if(sel&&on)em=.22;
      }
      e.obj.visible=vis;
      e.meshes.forEach(m=>{
        const mt=m.material;mt.color.set(col);mt.opacity=op;mt.transparent=op<0.99;mt.depthWrite=op>=0.5;
        mt.emissive.set(em?col:0x000000);mt.emissiveIntensity=em;
      });
    });
    dirty=true;
  }
  function select(k,silent){
    S.sel=k;
    paintList();aplica();showInfo();montaPins();
    if(!silent&&o.onSelect)o.onSelect(k);
    if(S.contract)startPulse();
  }
  function showInfo(){
    const k=S.sel;
    if(!k){info.hidden=true;return}
    const x=o.info(k);info.hidden=false;info.style.setProperty("--c",css(k));
    info.innerHTML=`<div><h3>${esc(x.nome)}</h3><div class="lat">${esc(x.latin)}</div></div><p style="margin:0">${x.resumo}</p>
    <dl><div><dt>Origem</dt><dd>${x.origem}</dd></div><div><dt>Inserção</dt><dd>${x.insercao}</dd></div><div><dt>Ação</dt><dd>${x.acao}</dd></div></dl>
    <button class="v3-btn" data-a="ficha" style="justify-self:start">Abrir a ficha completa</button>`;
  }

  /* ---- carregamento ---- */
  const draco=new DRACOLoader().setDecoderPath(DRACO);
  const gltf=new GLTFLoader().setDRACOLoader(draco);
  const nomeGrupo={};         // nome do nó -> chave do grupo
  order.forEach(k=>o.groups[k].forEach(n=>nomeGrupo[n+side]=k));
  const ossos=new Set(o.bones.map(n=>n+side));

  function achaNos(raiz,quer){
    raiz.updateMatrixWorld(true);
    const out=[];
    raiz.traverse(n=>{const nm=n.userData&&n.userData.name;if(nm&&quer(nm,n))out.push(n)});
    return out;
  }
  function registra(nodes,kindOf){
    nodes.forEach(n=>{
      const nm=n.userData.name,k=kindOf(nm);
      const meshes=[];
      n.traverse(m=>{if(m.isMesh){m.material=new THREE.MeshStandardMaterial({roughness:k.kind==="bone"?.5:.62,metalness:0,side:THREE.DoubleSide});m.userData.entry=null;meshes.push(m)}});
      if(!meshes.length)return;
      const e={obj:n,kind:k.kind,key:k.key,raw:nm,meshes};
      meshes.forEach(m=>m.userData.entry=e);
      entries.push(e);
    });
  }

  async function carregar(){
    try{
      const arq=[gltf.loadAsync(base+"esqueleto.glb")];
      o.regions.forEach(r=>arq.push(gltf.loadAsync(base+"regioes/musculos_"+r+".glb")));
      const nomes=o.regions.map(r=>fetch(base+"regioes/musculos_"+r+".json").then(x=>x.json()));
      const [esq,...musc]=await Promise.all(arq);
      const nomesPt=Object.assign({},...await Promise.all(nomes));
      const holder=new THREE.Group();scene.add(holder);

      const bn=achaNos(esq.scene,nm=>ossos.has(nm));
      bn.forEach(n=>holder.attach(n));
      registra(bn,()=>({kind:"bone"}));

      musc.forEach(g=>{
        // nós do lado escolhido que têm malha (os grupos "xxx.g" ficam de fora)
        const folhas=achaNos(g.scene,nm=>nm.endsWith(side)).filter(n=>{let m=false;n.traverse(c=>{if(c.isMesh)m=true});return m});
        folhas.forEach(n=>holder.attach(n));
        registra(folhas,nm=>nomeGrupo[nm]?{kind:"group",key:nomeGrupo[nm]}:{kind:"ctx"});
      });
      entries.forEach(e=>{e.label=e.kind==="group"?(limpa(nomesPt[e.raw]?.nome||"")||o.info(e.key).nome):e.kind==="bone"?"":limpa(nomesPt[e.raw]?.nome||e.raw)});
      const ossoPt=await fetch(base+"esqueleto.json").then(x=>x.json());
      entries.filter(e=>e.kind==="bone").forEach(e=>e.label=limpa(ossoPt[e.raw]?.nome||e.raw));

      /* origem e inserção: extremos do músculo ao longo do eixo origem→inserção, encostados no osso mais próximo */
      holder.updateMatrixWorld(true);
      const boneV=[],boneBy={};
      entries.forEach(e=>{if(e.kind!=="bone")return;const mine=boneBy[e.raw.replace(side,"")]=[];e.meshes.forEach(m=>{const a=m.geometry.attributes.position,v=new THREE.Vector3();for(let i=0;i<a.count;i+=2){v.fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld);boneV.push(v.x,v.y,v.z);mine.push(v.clone())}})});
      const snap=p=>{let b=1e9,bi=-1;for(let i=0;i<boneV.length;i+=3){const d=(boneV[i]-p.x)**2+(boneV[i+1]-p.y)**2+(boneV[i+2]-p.z)**2;if(d<b){b=d;bi=i}}return bi>=0&&b<0.04*0.04?new THREE.Vector3(boneV[bi],boneV[bi+1],boneV[bi+2]):p};
      const juntar=(pts,r)=>{const out=[];pts.forEach(p=>{const q=out.find(o=>o.p.distanceTo(p)<r);if(q){q.p.lerp(p,1/(++q.n))}else out.push({p:p.clone(),n:1})});return out.map(o=>o.p)};
      order.forEach(k=>{
        const cfg=(o.attach&&o.attach[k])||{},base=new THREE.Vector3(...(cfg.dir||[0,-1,0])).normalize();
        const ori=[],ins=[];
        entries.filter(e=>e.key===k).forEach(e=>{
          const d=new THREE.Vector3(...((cfg.parts&&cfg.parts[e.raw.replace(side,"")])||cfg.dir||[0,-1,0])).normalize();
          const pts=[],v=new THREE.Vector3();
          e.meshes.forEach(m=>{const a=m.geometry.attributes.position;for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld);pts.push({p:v.clone(),t:v.dot(d)})}});
          let lo=1e9,hi=-1e9;pts.forEach(q=>{lo=Math.min(lo,q.t);hi=Math.max(hi,q.t)});
          const c1=new THREE.Vector3(),c2=new THREE.Vector3();let n1=0,n2=0;
          pts.forEach(q=>{if(q.t<=lo+(hi-lo)*.08){c1.add(q.p);n1++}if(q.t>=hi-(hi-lo)*.08){c2.add(q.p);n2++}});
          if(n1)ori.push(snap(c1.divideScalar(n1)));if(n2)ins.push(snap(c2.divideScalar(n2)));
        });
        const I=juntar(ins,.025).map(p=>({t:"I",p}));
        if(cfg.insNear&&boneBy[cfg.insNear]&&I.length){
          // inserção encostada no osso indicado (ex.: tuberosidade do rádio), a partir do extremo do músculo
          const m=I.reduce((a,q)=>a.add(q.p),new THREE.Vector3()).divideScalar(I.length);
          let b=1e9,bp=m;boneBy[cfg.insNear].forEach(v=>{const d=v.distanceToSquared(m);if(d<b){b=d;bp=v}});
          I.length=0;I.push({t:"I",p:bp.clone(),title:cfg.insTitle});
        }
        else if(cfg.insBone&&boneBy[cfg.insBone]){
          // inserção no osso indicado (ex.: base da patela); o extremo do músculo vira um segundo ponto
          const vs=boneBy[cfg.insBone].slice().sort((a,b)=>b.y-a.y),top=vs.slice(0,Math.max(3,vs.length*.1|0));
          const c=top.reduce((a,v)=>a.add(v),new THREE.Vector3()).divideScalar(top.length);
          I.forEach(q=>q.title=cfg.extraTitle);I.unshift({t:"I",p:c,title:cfg.insTitle});
        }
        pins[k]=[...juntar(ori,.03).map(p=>({t:"O",p})),...I];
      });

      /* pivôs para a contração: um por músculo do atlas, centrado no volume */
      holder.updateMatrixWorld(true);
      order.forEach(k=>{
        const es=entries.filter(e=>e.key===k);if(!es.length)return;
        const box=new THREE.Box3();es.forEach(e=>box.expandByObject(e.obj));
        const c=box.getCenter(new THREE.Vector3()),sz=box.getSize(new THREE.Vector3());
        const pv=new THREE.Group();pv.position.copy(c);holder.add(pv);pv.updateMatrixWorld(true);
        es.forEach(e=>pv.attach(e.obj));
        groups[k]={pivot:pv,axis:sz.x>sz.y&&sz.x>sz.z?0:sz.z>sz.y&&sz.z>sz.x?2:1};
      });

      holder.updateMatrixWorld(true);
      // enquadra os músculos do atlas; ossos e o resto da região ficam alcançáveis com o zoom
      const all=new THREE.Box3();
      entries.forEach(e=>{if(e.kind==="group")all.expandByObject(e.obj)});
      if(all.isEmpty())all.setFromObject(holder);
      target=all.getCenter(new THREE.Vector3());
      const h=all.getSize(new THREE.Vector3());
      dist=Math.max(h.y,h.x*1.4)*.5/Math.tan(THREE.MathUtils.degToRad(cam.fov/2))*1.6;
      ctl.minDistance=dist*.25;ctl.maxDistance=dist*2.6;
      loaded=true;msg.hidden=true;
      resize();goView("frente",true);paintList();aplica();
      if(o.initial)select(o.initial,true);
    }catch(err){
      console.error(err);
      msg.textContent="Não consegui carregar o modelo 3D. Rode o site por um servidor HTTP e confira a conexão.";
    }
  }

  /* ---- contração ilustrativa ---- */
  let pulseT0=0;
  function startPulse(){pulseT0=performance.now()}
  function pulseStep(){
    const now=performance.now();
    order.forEach(k=>{
      const g=groups[k];if(!g)return;
      let a=0;
      if(S.contract&&k===S.sel)a=(1-Math.cos(((now-pulseT0)/1400)*Math.PI*2))/2;
      const long=1-0.08*a,per=1+0.12*a;
      g.pivot.scale.set(per,per,per);g.pivot.scale.setComponent(g.axis,long);
    });
    dirty=true;
  }

  /* ---- pinos de origem e inserção (rótulos HTML sobre o 3D) ---- */
  const pinBox=$(".v3-pins"),pinEls=[];
  const ray2=new THREE.Raycaster(),pv=new THREE.Vector3();
  let pinKey=null,occT=0;
  function montaPins(){
    pinBox.innerHTML="";pinEls.length=0;pinKey=null;
    const k=S.sel;if(!k||!S.pins||!pins[k])return;
    pinKey=k;const x=o.info(k);
    pins[k].forEach(q=>{
      const d=document.createElement("div");d.className="v3-pin in";d.textContent=q.t;
      d.style.background=q.t==="O"?css(k):"#1d2733";
      d.title=q.title||((q.t==="O"?"Origem: ":"Inserção: ")+String(q.t==="O"?x.origem:x.insercao).replace(/<[^>]+>/g,""));
      pinBox.appendChild(d);pinEls.push({d,p:q.p});
    });
  }
  function posPins(){
    if(!pinEls.length)return;
    const w=stage.clientWidth,h=stage.clientHeight,now=performance.now(),testa=now-occT>120;
    if(testa)occT=now;
    const occ=testa?[]:null;
    if(testa)entries.forEach(e=>{if(e.kind==="bone"&&e.obj.visible)occ.push(...e.meshes)});
    pinEls.forEach(it=>{
      pv.copy(it.p).project(cam);
      const vis=pv.z<1&&Math.abs(pv.x)<1.1&&Math.abs(pv.y)<1.1;
      it.d.style.display=vis?"":"none";
      it.d.style.transform=`translate(${(pv.x+1)/2*w}px,${(1-pv.y)/2*h}px)`;
      if(testa&&vis){
        const dir=it.p.clone().sub(cam.position),dd=dir.length();
        ray2.set(cam.position,dir.normalize());ray2.far=dd;
        const hit=ray2.intersectObjects(occ,false)[0];
        it.d.classList.toggle("oc",!!hit&&hit.distance<dd-0.02);
      }
    });
  }

  /* ---- interação ---- */
  const ray=new THREE.Raycaster(),ptr=new THREE.Vector2();
  function pick(ev){
    const r=canvas.getBoundingClientRect();
    ptr.set(((ev.clientX-r.left)/r.width)*2-1,-((ev.clientY-r.top)/r.height)*2+1);
    ray.setFromCamera(ptr,cam);
    const ms=[];entries.forEach(e=>{if(e.obj.visible)ms.push(...e.meshes)});
    const hit=ray.intersectObjects(ms,false)[0];
    return hit?hit.object.userData.entry:null;
  }
  let down=null;
  canvas.addEventListener("pointerdown",e=>{down={x:e.clientX,y:e.clientY};anim=null});
  canvas.addEventListener("pointerup",e=>{
    if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5){down=null;return}
    down=null;const hit=pick(e);
    if(hit&&hit.kind==="group")select(hit.key);
    else if(hit&&e.pointerType==="touch"){tip.textContent=hit.label;tip.style.left=(e.clientX-stage.getBoundingClientRect().left)+"px";tip.style.top=(e.clientY-stage.getBoundingClientRect().top)+"px";tip.style.opacity=1;setTimeout(()=>tip.style.opacity=0,1500)}
    else if(!hit&&S.sel){S.sel=null;paintList();aplica();showInfo();montaPins();if(S.contract)startPulse()}
  });
  let hov=0;
  canvas.addEventListener("pointermove",e=>{
    if(e.pointerType==="touch"||e.buttons||!loaded)return;
    const t=performance.now();if(t-hov<60)return;hov=t;
    const hit=pick(e);
    if(hit&&hit.label){const r=stage.getBoundingClientRect();tip.textContent=hit.label;tip.style.left=(e.clientX-r.left)+"px";tip.style.top=(e.clientY-r.top)+"px";tip.style.opacity=1;canvas.style.cursor=hit.kind==="group"?"pointer":"grab"}
    else{tip.style.opacity=0;canvas.style.cursor=""}
  });
  canvas.addEventListener("pointerleave",()=>tip.style.opacity=0);

  root.addEventListener("click",e=>{
    const v=e.target.closest("[data-v]");if(v){goView(v.dataset.v);return}
    const k=e.target.closest("[data-k]");if(k){select(k.dataset.k);return}
    const a=e.target.closest("[data-a]");if(!a)return;
    if(a.dataset.a==="ficha"){if(o.onOpen)o.onOpen(S.sel);return}
    const on=a.getAttribute("aria-pressed")!=="true";a.setAttribute("aria-pressed",on);
    if(a.dataset.a==="spin")ctl.autoRotate=on;
    if(a.dataset.a==="iso"){S.iso=on;aplica()}
    if(a.dataset.a==="contract"){
      S.contract=on;a.textContent=on?"■ Parar":"▶ Contrair";
      if(on){if(!S.sel)select(order[0]);startPulse()}
    }
  });
  root.addEventListener("input",e=>{
    const t=e.target.dataset.o;if(!t)return;
    if(t==="op")S.op=+e.target.value;else S[t]=e.target.checked;
    aplica();if(t==="pins")montaPins();
  });
  ctl.addEventListener("change",()=>dirty=true);

  function resize(){
    const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;
    renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();dirty=true;
  }
  new ResizeObserver(resize).observe(stage);
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{paintList();aplica()});

  let nf=0;
  function frame(){
    requestAnimationFrame(frame);nf++;
    if(!loaded||document.hidden)return;
    if(anim){
      let t=Math.min(1,(performance.now()-anim.t0)/anim.dur);t=t*t*(3-2*t);
      cam.position.lerpVectors(anim.from,anim.to,t);ctl.target.lerpVectors(anim.tf,anim.tt,t);
      if(t>=1)anim=null;dirty=true;
    }
    if(S.contract)pulseStep();
    if(ctl.update())dirty=true;
    if(ctl.autoRotate)dirty=true;
    if(dirty){renderer.render(scene,cam);dirty=false;posPins()}
    else if(pinEls.length&&performance.now()-occT>400)posPins();
  }
  frame();
  function renderNow(){resize();ctl.update();renderer.render(scene,cam);dirty=false;posPins()}

  /* carrega só quando a seção chega perto da tela */
  let iniciou=false;
  const io=new IntersectionObserver(es=>{if(!iniciou&&es[0].isIntersecting){iniciou=true;io.disconnect();carregar().then(()=>renderNow())}},{rootMargin:"500px"});
  io.observe(root);
  // reserva caso o IntersectionObserver demore: confere a posição ao rolar
  const perto=()=>{if(iniciou){removeEventListener("scroll",perto);return}const r=root.getBoundingClientRect();if(r.top<innerHeight+500){iniciou=true;io.disconnect();removeEventListener("scroll",perto);carregar().then(()=>renderNow())}};
  addEventListener("scroll",perto,{passive:true});setTimeout(perto,1200);

  const api={
    highlight(k){if(loaded&&k&&k!==S.sel)select(k,true);else if(!loaded)o.initial=k},
    renderNow,start(){if(!iniciou){iniciou=true;io.disconnect();return carregar().then(renderNow)}},
    state:S,view:goView,pins:()=>pins,frames:()=>nf,
    debug:()=>({cam:cam.position.toArray(),target:target.toArray(),dist,box:new THREE.Box3().setFromObject(scene).min.toArray().concat(new THREE.Box3().setFromObject(scene).max.toArray())})
  };
  return api;
}
