/* Glossário: sublinha termos anatômicos nas fichas e mostra uma explicação curta ao tocar, passar o mouse ou focar.
   Só a primeira ocorrência de cada termo em cada área é marcada, para o texto não ficar poluído. */
(function(){
  const T=[
    [["EIAS","espinha ilíaca anterossuperior"],"Espinha ilíaca anterossuperior: a ponta óssea que você sente na frente do quadril, na altura da cintura."],
    [["EIAI","espinha ilíaca anteroinferior"],"Espinha ilíaca anteroinferior: saliência do osso do quadril logo abaixo da EIAS, de onde sai o reto femoral."],
    [["acetábulo"],"Cavidade do osso do quadril onde se encaixa a cabeça do fêmur."],
    [["trocânter maior"],"Saliência óssea na lateral do quadril, no alto do fêmur. Dá para sentir de lado."],
    [["trocânter menor"],"Pequena saliência na parte interna e de trás do alto do fêmur, onde o iliopsoas se prende."],
    [["linha áspera"],"Crista na face de trás do fêmur onde se prendem vários músculos da coxa."],
    [["linha supracondilar"],"Prolongamento da linha áspera, na parte de baixo do fêmur, rumo aos côndilos."],
    [["túber isquiático","tuberosidade isquiática"],"Parte do osso do quadril em que você se senta. Os isquiotibiais saem daqui."],
    [["tuberosidade glútea"],"Rugosidade na parte de trás do alto do fêmur onde o glúteo máximo se insere."],
    [["tuberosidade da tíbia"],"Saliência na frente da tíbia, logo abaixo do joelho, onde chega o ligamento patelar."],
    [["ligamento patelar"],"Tendão que liga a patela à tíbia; é a continuação do tendão do quadríceps."],
    [["patela"],"Osso da frente do joelho (a rótula), dentro do tendão do quadríceps."],
    [["crista ilíaca"],"Borda de cima do osso do quadril, que você sente na cintura."],
    [["sacro"],"Osso triangular na base da coluna, entre os dois ossos do quadril."],
    [["púbis"],"Parte da frente do osso do quadril, onde as duas metades se encontram."],
    [["trato iliotibial"],"Faixa espessa de fáscia na lateral da coxa, do quadril até o joelho."],
    [["pata de ganso"],"Inserção conjunta de sartório, grácil e semitendíneo, na face interna da tíbia logo abaixo do joelho."],
    [["Trendelenburg"],"Queda da pelve do lado sem apoio quando se fica numa perna só, por fraqueza do glúteo médio."],
    [["sacroilíaca"],"Articulação entre o sacro e o osso do quadril."],
    [["poplíteo"],"Da região atrás do joelho."],
    [["fáscia"],"Membrana de tecido conjuntivo que envolve e separa músculos e outras estruturas."],
    [["aponeurose"],"Tendão largo e achatado, em forma de lâmina."],
    [["biarticular"],"Que cruza duas articulações e age sobre as duas."],
    [["acrômio"],"Ponta óssea no topo do ombro, parte da escápula, logo acima da cabeça do úmero."],
    [["processo coracoide"],"Projeção da escápula que sai para a frente, sob a clavícula. Dá para apalpar abaixo da ponta externa da clavícula."],
    [["espinha da escápula"],"Crista óssea na face de trás da escápula, que separa as fossas supraespinal e infraespinal."],
    [["fossa supraespinal"],"Depressão da escápula acima da espinha, de onde nasce o supraespinal."],
    [["fossa infraespinal"],"Depressão da escápula abaixo da espinha, de onde nasce o infraespinal."],
    [["fossa subescapular"],"Face da escápula voltada para as costelas, de onde nasce o subescapular."],
    [["tubérculo maior"],"Saliência do úmero, na lateral da cabeça, onde se prendem supraespinal, infraespinal e redondo menor."],
    [["tubérculo menor"],"Saliência do úmero, na frente, onde se prende o subescapular."],
    [["sulco intertubercular"],"Canal na frente do úmero, entre os dois tubérculos, por onde passa o tendão da cabeça longa do bíceps."],
    [["olécrano"],"Ponta óssea do cotovelo (parte da ulna), onde se prende o tríceps."],
    [["cavidade glenoidal"],"Superfície rasa da escápula onde a cabeça do úmero se encaixa."],
    [["ângulo inferior"],"Ponta de baixo da escápula."],
    [["ângulo superior"],"Canto de cima da escápula."],
    [["margem medial"],"Borda da escápula voltada para a coluna."],
    [["ligamento nucal"],"Faixa elástica na parte de trás do pescoço, da base do crânio até C7."],
    [["processos espinhosos"],"Pontas ósseas na parte de trás das vértebras, que você sente ao longo da coluna."],
    [["processos transversos"],"Projeções laterais das vértebras, onde se prendem músculos e ligamentos."],
    [["manguito rotador","manguito"],"Conjunto de quatro músculos (supraespinal, infraespinal, redondo menor e subescapular) que mantém a cabeça do úmero na cavidade do ombro."],
    [["impacto subacromial"],"Compressão dos tendões do manguito e da bolsa sob o acrômio ao elevar o braço."],
    [["escápula alada"],"Quando a borda da escápula se descola das costas, em geral por fraqueza do serrátil anterior."],
    [["tendinopatia"],"Alteração do tendão por sobrecarga, com dor e menos resistência."],
    [["trombose"],"Coágulo numa veia, que pode causar inchaço, calor e dor e exige atenção médica."],
    [["abdução"],"Afastar o membro da linha do meio do corpo."],
    [["adução"],"Aproximar o membro da linha do meio do corpo."],
    [["flexão"],"Diminuir o ângulo de uma articulação (dobrar). No ombro, é levar o braço à frente."],
    [["extensão"],"Aumentar o ângulo de uma articulação (esticar). No ombro, é levar o braço para trás."],
    [["rotação interna"],"Girar o membro para dentro, em direção à linha do meio do corpo."],
    [["rotação externa"],"Girar o membro para fora, afastando-o da linha do meio."]
  ];
  const AREAS="#panelBody,#gdet,#clroot,#resRoot";
  const mapa=new Map();
  T.forEach(([nomes,def])=>nomes.forEach(n=>mapa.set(n.toLowerCase(),{k:nomes[0].toLowerCase(),def})));
  const alt=[...mapa.keys()].sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));
  const RE=new RegExp("(?<![\\p{L}\\p{N}])("+alt.join("|")+")(?![\\p{L}\\p{N}])","giu");
  const PULA="script,style,button,a,.gl,h1,h2,h3,h4,summary,input,textarea,select,.cl-tag,.tag,.es-tab thead,.es-tab td:first-child,.mname";

  const css=document.createElement("style");
  css.textContent=`
  .gl{border-bottom:1.5px dotted var(--muted,#53657a);cursor:help;text-decoration:none}
  .gl:hover,.gl:focus-visible{border-bottom-style:solid;color:var(--ink)}
  #gl-pop{position:fixed;z-index:400;max-width:min(320px,calc(100vw - 24px));background:var(--ink,#0f1d2b);color:var(--bg,#fff);padding:10px 14px;border-radius:12px;font:500 .88rem/1.4 var(--f-body,system-ui);box-shadow:0 8px 28px rgba(0,0,0,.4);pointer-events:none;opacity:0;transform:translateY(4px);transition:opacity .12s,transform .12s}
  #gl-pop.on{opacity:1;transform:none}
  #gl-pop b{display:block;margin-bottom:2px;font-weight:700}`;
  document.head.appendChild(css);

  function marca(area){
    const vistos=new Set([...area.querySelectorAll(".gl")].map(e=>e.dataset.k));
    const w=document.createTreeWalker(area,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.nodeValue.trim()&&!n.parentElement.closest(PULA)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
    const nos=[];while(w.nextNode())nos.push(w.currentNode);
    nos.forEach(no=>{
      const txt=no.nodeValue;RE.lastIndex=0;
      let m,ult=0,frag=null;
      while((m=RE.exec(txt))){
        const info=mapa.get(m[1].toLowerCase());if(!info||vistos.has(info.k))continue;
        vistos.add(info.k);
        frag=frag||document.createDocumentFragment();
        frag.appendChild(document.createTextNode(txt.slice(ult,m.index)));
        const a=document.createElement("abbr");a.className="gl";a.tabIndex=0;a.dataset.k=info.k;a.dataset.d=info.def;a.textContent=m[1];
        a.setAttribute("role","note");frag.appendChild(a);ult=m.index+m[1].length;
      }
      if(frag){frag.appendChild(document.createTextNode(txt.slice(ult)));no.parentNode.replaceChild(frag,no)}
    });
  }

  /* explicação flutuante */
  let pop,alvo=null,tm=0;
  function mostra(el){
    if(!pop){pop=document.createElement("div");pop.id="gl-pop";pop.setAttribute("role","tooltip");document.body.appendChild(pop)}
    alvo=el;pop.innerHTML="<b></b><span></span>";let d=el.dataset.d;const t=el.textContent;
    if(d.toLowerCase().startsWith(t.toLowerCase()+":"))d=d.slice(t.length+1).trim();
    pop.firstChild.textContent=t;pop.lastChild.textContent=d.charAt(0).toUpperCase()+d.slice(1);
    pop.id="gl-pop";el.setAttribute("aria-describedby","gl-pop");
    const r=el.getBoundingClientRect();pop.classList.add("on");
    const pw=pop.offsetWidth,ph=pop.offsetHeight;
    let x=Math.max(12,Math.min(innerWidth-pw-12,r.left+r.width/2-pw/2)),y=r.bottom+8;
    if(y+ph>innerHeight-8)y=Math.max(8,r.top-ph-8);
    pop.style.left=x+"px";pop.style.top=y+"px";
  }
  function esconde(){clearTimeout(tm);if(pop)pop.classList.remove("on");if(alvo){alvo.removeAttribute("aria-describedby");alvo=null}}
  document.addEventListener("click",e=>{const g=e.target.closest&&e.target.closest(".gl");if(g){e.preventDefault();alvo===g?esconde():mostra(g)}else esconde()});
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape")esconde();
    if((e.key==="Enter"||e.key===" ")&&document.activeElement&&document.activeElement.classList.contains("gl")){e.preventDefault();alvo===document.activeElement?esconde():mostra(document.activeElement)}
  });
  document.addEventListener("focusin",e=>{if(e.target.classList&&e.target.classList.contains("gl"))mostra(e.target)});
  document.addEventListener("focusout",e=>{if(e.target.classList&&e.target.classList.contains("gl"))esconde()});
  document.addEventListener("mouseover",e=>{const g=e.target.closest&&e.target.closest(".gl");if(g&&g!==alvo){clearTimeout(tm);tm=setTimeout(()=>mostra(g),250)}});
  document.addEventListener("mouseout",e=>{const g=e.target.closest&&e.target.closest(".gl");if(g)esconde()});
  addEventListener("scroll",esconde,{passive:true});addEventListener("resize",esconde);

  /* observa as áreas de texto das fichas e marca os termos de novo a cada atualização */
  let fila=new Set(),agendado=0;
  function processa(){agendado=0;const lote=[...fila];fila.clear();lote.forEach(a=>{if(a.isConnected)marca(a)})}
  new MutationObserver(ms=>{
    for(const m of ms)for(const n of m.addedNodes){
      const el=n.nodeType===1?n:n.parentElement;if(!el||el.closest("#gl-pop"))continue;
      const area=el.closest(AREAS);if(area&&!(n.nodeType===1&&n.classList.contains("gl")))fila.add(area);
      else if(n.nodeType===1&&n.querySelector)n.querySelectorAll(AREAS).forEach(a=>fila.add(a));
    }
    if(fila.size&&!agendado)agendado=setTimeout(processa,60);
  }).observe(document.body,{childList:true,subtree:true});
  document.querySelectorAll(AREAS).forEach(a=>fila.add(a));
  agendado=setTimeout(processa,300);
})();
