
const stage=document.getElementById('stage');
const wheel=document.getElementById('wheel');
const counter=document.getElementById('counter');
const panel=document.getElementById('panel');
const criteriaBox=document.getElementById('criteria');
const people={
1:{desc:'Formadora: Liderança e Porta Voz da formação continuada.',title:'Desempenho da Formadora',items:[
'Participação ativa no Papo Formativo [P1]',
'Planejamento e estudo das reuniões; garantindo fidelidade ao roteiro [P2]',
'Compreender os diferentes níveis de aprendizagem [P16]']},
2:{desc:'Prática compartilhada: Supervisão pedagógica.',title:'Apoio à autonomia do professor',items:[
'Comentou a necessidade de sistematizar o senso comum à luz da filosofia.',
'Apresentou a diferença entre: acúmulo de informações VS. compreender o conteúdo.',
'Compartilhou possibilidades de aperfeiçoamento da prática docente.']},
3:{desc:'Prática compartilhada: experimento com ovo em conserva.',title:'Experiência sensível',items:[
'Mobilização a partir de uma experiência sensível.',
'Apresentou o conteúdo a partir de uma experiência sentida.',
'Promoveu o engajamento dos estudantes.']},
4:{desc:'Prática compartilhada: relação entre biologia e bioética.',title:'Prática interdisciplinar',items:[
'Articulou áreas do conhecimento.',
'Engajamento dos alunos',
'Aprofundamento na formação continuada']},
5:{desc:'Prática compartilhada: uso de microdados do ENEM.',title:'Recomposição a partir das evidências',items:[
'Microdados do ENEM: ferramenta de análise da aprendizagem.',
'Analisou evidências ou indicadores para orientar decisões pedagógicas.',
'Possibilidades de recomposição das aprendizagens contextualizadas.']},
6:{desc:'Prática compartilhada: conteúdo apresentado a partir de questões objetivas.',title:'Análise do erro e construção de conceitos',items:[
'Apresentou o conteúdo a partir de questões objetivas.',
'Explorou erros ou alternativas como oportunidades de reflexão.',
'Identificou possibilidades para a construção de conceitos.']}
};
const order=[1,4,5,3,6,2];
let currentIndex=0, selected=null, busy=false, currentDegrees=0;
const key=n=>'roda_conversa_organica_feedback_II_pessoa_'+n;
function angleToPerson(n){
 const target=document.querySelector('.p'+n).getBoundingClientRect();
 const center=wheel.getBoundingClientRect();
 const dx=(target.left+target.width/2)-(center.left+center.width/2);
 const dy=(target.top+target.height/2)-(center.top+center.height/2);
 return (Math.atan2(dx,-dy)*180/Math.PI+360)%360;
}
function spin(){
 if(busy)return;
 if(currentIndex>=order.length){counter.textContent='Todos participaram · Reinicie para uma nova rodada';return;}
 const n=order[currentIndex];
 const target=angleToPerson(n);
 const normalized=((currentDegrees%360)+360)%360;
 const remaining=(target-normalized+360)%360;
 currentDegrees+=1440+remaining;
 busy=true;
 counter.textContent='A roda está girando…';
 wheel.style.transform=`rotate(${currentDegrees}deg)`;
 window.setTimeout(()=>{
   selected=n; currentIndex++;
   busy=false;
   counter.textContent=currentIndex===order.length?'Rodada concluída · Todos tiveram sua vez':'Pessoa selecionada para compartilhar';
   document.getElementById('record').disabled=false;
   if(currentIndex===order.length)document.getElementById('rotate').disabled=true;
 },1750);
}
function reset(){
 if(busy)return;
 currentIndex=0;selected=null;currentDegrees=0;
 wheel.style.transition='none';wheel.style.transform='rotate(0deg)';
 void wheel.offsetWidth;
 wheel.style.transition='transform 1.7s cubic-bezier(.12,.77,.17,1)';
 counter.textContent='Nova rodada pronta';
 document.getElementById('rotate').disabled=false;
 document.getElementById('record').disabled=true;
 panel.classList.remove('open');
}
function openNote(){
 if(busy || selected===null)return;
 const person=people[selected];
 document.getElementById('title').textContent='Registro da fala';
 document.getElementById('desc').textContent=person.desc;
 document.getElementById('criteriaTitle').textContent=person.title;
 let saved=[];try{saved=JSON.parse(localStorage.getItem(key(selected))||'[]')}catch(e){}
 criteriaBox.replaceChildren();
 person.items.forEach((text,i)=>{
   const label=document.createElement('label');label.className='criterion';
   const check=document.createElement('input');check.type='checkbox';check.value=String(i);check.checked=Array.isArray(saved)&&saved.includes(i);
   const span=document.createElement('span');span.textContent=text;
   label.append(check,span);criteriaBox.append(label);
 });
 document.getElementById('saved').textContent='';
 panel.classList.add('open');
}
document.getElementById('rotate').addEventListener('click',spin);
document.getElementById('reset').addEventListener('click',reset);
document.getElementById('record').addEventListener('click',openNote);
document.getElementById('record').disabled=true;
document.getElementById('close').onclick=()=>panel.classList.remove('open');
document.getElementById('save').onclick=()=>{if(selected===null)return;const checked=[...criteriaBox.querySelectorAll('input:checked')].map(el=>Number(el.value));localStorage.setItem(key(selected),JSON.stringify(checked));document.getElementById('saved').textContent='Avaliação salva neste dispositivo.';};
panel.addEventListener('click',e=>{if(e.target===panel)panel.classList.remove('open')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')panel.classList.remove('open')});

/* Exportação DOCX offline, sem bibliotecas externas; mesma identidade visual do painel da ponte */
function xmlEscape(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
function paragraph(value,type='body'){
 const text=xmlEscape(value), size=type==='cover'?40:type==='section'?30:type==='sub'?25:type==='comment'?22:23;
 const white=type==='cover'||type==='section';
 const navy=type==='cover'||type==='section';
 const bg=navy?'<w:shd w:val="clear" w:color="auto" w:fill="102A3B"/>':'';
 const psp=type==='cover'?'260':type==='section'?'230':type==='sub'?'170':'95';
 const padding=navy?'<w:ind w:left="180" w:right="160"/>':'';
 const bold=type==='body'?'':'<w:b/>';
 const before=type==='section'?'260':type==='sub'?'160':'60';
 return '<w:p><w:pPr><w:spacing w:before="'+before+'" w:after="'+psp+'" w:line="315" w:lineRule="auto"/>'+bg+padding+'</w:pPr><w:r><w:rPr>'+bold+'<w:color w:val="'+(white?'FFFFFF':type==='sub'?'17364B':type==='comment'?'225970':'283A48')+'"/><w:sz w:val="'+size+'"/><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/></w:rPr><w:t xml:space="preserve">'+text+'</w:t></w:r></w:p>';
}


/* Metas da Formadora: edição e armazenamento independentes dos critérios */
const goalsPanel=document.getElementById('goalsPanel');
const goalsInputs=[document.getElementById('goalPreserve'),document.getElementById('goalImprove'),document.getElementById('goalObserve')];
const goalsKey='roda_organica_metas_formadora_v1';
function loadGoals(){try{const data=JSON.parse(localStorage.getItem(goalsKey)||'[]');goalsInputs.forEach((input,i)=>input.value=String(data[i]||''));}catch(e){goalsInputs.forEach(input=>input.value='');}}
function saveGoals(){localStorage.setItem(goalsKey,JSON.stringify(goalsInputs.map(input=>input.value.trim())));document.getElementById('goalsSaved').textContent='Metas salvas neste navegador.';}
document.getElementById('goals').addEventListener('click',()=>{loadGoals();document.getElementById('goalsSaved').textContent='';goalsPanel.classList.add('open');});
document.getElementById('goalsClose').addEventListener('click',()=>goalsPanel.classList.remove('open'));
document.getElementById('goalsSave').addEventListener('click',saveGoals);
goalsPanel.addEventListener('click',e=>{if(e.target===goalsPanel)goalsPanel.classList.remove('open');});
document.addEventListener('keydown',e=>{if(e.key==='Escape')goalsPanel.classList.remove('open');});

function wordXml(){
 let body=paragraph('EXPERIÊNCIA ORGÂNICA DA FORMAÇÃO CONTINUADA','cover');
 body+=paragraph('Roda de conversa — Relatório de práticas e avaliações','sub');
 body+=paragraph('Critérios assinalados e registrados durante a formação.','body');
 let total=0;
 order.forEach((n,idx)=>{
   const p=people[n];
   let checks=[];
   try {checks=JSON.parse(localStorage.getItem(key(n))||'[]')}catch(e){}
   if(!Array.isArray(checks))checks=[];
   body+=paragraph(p.title.toUpperCase(),'section');
   body+=paragraph(p.desc,'sub');
   const entries=p.items.map((label,i)=>({label,i})).filter(({i})=>checks.includes(i));
   if(entries.length){
     entries.forEach(({label},i)=>{body+=paragraph('✓  '+label,'body');total++;});
   } else body+=paragraph('Nenhum critério assinalado para este participante.','body');
 });
 body+=paragraph('METAS ATÉ O PRÓXIMO FEEDBACK E CONCLUSÃO DA JORNADA.','section');
 let goals=[];try{goals=JSON.parse(localStorage.getItem(goalsKey)||'[]');}catch(e){}
 if(!Array.isArray(goals))goals=[];
 body+=paragraph('Pretendo preservar: '+(goals[0]||'Não preenchido.'),'body');
 body+=paragraph('Aperfeiçoar: '+(goals[1]||'Não preenchido.'),'body');
 body+=paragraph('E observar: '+(goals[2]||'Não preenchido.'),'body');
 body+=paragraph('Um bom registro na agenda ou portfólio potencializa o planejamento e o êxito na prática Docente','sub');
 return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
 '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+
 '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1100" w:right="1100" w:bottom="1100" w:left="1100" w:header="700" w:footer="700" w:gutter="0"/></w:sectPr></w:body></w:document>';
}
const crcTable=(()=>{const a=[];for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=(c&1)?0xEDB88320^(c>>>1):c>>>1;a[i]=c>>>0;}return a;})();
function crc32(bytes){let c=0xFFFFFFFF;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
function zipDocx(entries){
 const enc=new TextEncoder();let cursor=0;const chunks=[],centers=[];
 function u16(n){return [n&255,(n>>>8)&255];}function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];}
 for(const [name,content] of entries){
  const n=enc.encode(name),d=enc.encode(content),crc=crc32(d),off=cursor;
  const header=new Uint8Array([80,75,3,4,...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(d.length),...u32(d.length),...u16(n.length),...u16(0)]);
  chunks.push(header,n,d);cursor+=header.length+n.length+d.length;
  const central=new Uint8Array([80,75,1,2,...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(d.length),...u32(d.length),...u16(n.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(off)]);
  centers.push(central,n);
 }
 const start=cursor;for(const x of centers){chunks.push(x);cursor+=x.length;}
 chunks.push(new Uint8Array([80,75,5,6,...u16(0),...u16(0),...u16(entries.length),...u16(entries.length),...u32(cursor-start),...u32(start),...u16(0)]));
 return new Blob(chunks,{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
}

function exportDocx(){
 if(goalsPanel.classList.contains('open'))saveGoals();
 // Se o formador tiver caixas abertas ainda não salvas, incorporá-las também.
 if(panel.classList.contains('open') && selected!==null){
  const checked=[...criteriaBox.querySelectorAll('input:checked')].map(el=>Number(el.value));
  localStorage.setItem(key(selected),JSON.stringify(checked));
 }
 const ct='<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
 const rel='<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
 const blob=zipDocx([['[Content_Types].xml',ct],['_rels/.rels',rel],['word/document.xml',wordXml()]]);
 const a=document.createElement('a'),u=URL.createObjectURL(blob);
 a.href=u;a.download='ATA_da_Conversa_Experiencia_Organica.docx';
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000);
}
document.getElementById('export').addEventListener('click',exportDocx);


/* Tela cheia nativa: tecla Esc encerra; fallback oferece expansão no navegador. */
const fullscreenButton=document.getElementById('fullscreen');
const fullscreenStage=document.getElementById('stage');
fullscreenButton.addEventListener('click',async()=>{
 try{
  if(document.fullscreenElement){await document.exitFullscreen();}
  else if(fullscreenStage.requestFullscreen){await fullscreenStage.requestFullscreen();}
  else {fullscreenStage.classList.toggle('fullscreen-fallback');}
 }catch(e){fullscreenStage.classList.toggle('fullscreen-fallback');}
 const active=!!document.fullscreenElement||fullscreenStage.classList.contains('fullscreen-fallback');
 fullscreenButton.setAttribute('aria-label',active?'Sair da tela cheia':'Entrar em tela cheia');
 fullscreenButton.title=active?'Sair da tela cheia':'Entrar em tela cheia';
 fullscreenButton.setAttribute('aria-pressed',String(active));
});
document.addEventListener('fullscreenchange',()=>{
 const active=!!document.fullscreenElement;
 fullscreenButton.setAttribute('aria-label',active?'Sair da tela cheia':'Entrar em tela cheia');
 fullscreenButton.title=active?'Sair da tela cheia':'Entrar em tela cheia';
 fullscreenButton.setAttribute('aria-pressed',String(active));
});
