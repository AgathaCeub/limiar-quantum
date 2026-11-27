(function(root){
'use strict';
const TAU=2*Math.PI, SQ=Math.SQRT1_2;
function random(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function vacuum(n=6){const v=new Float64Array(2*(1<<n));v[0]=1;return v;}
function norm(v){let s=0;for(const x of v)s+=x*x;return s;}
function gate(v,q,m){const mask=1<<q;for(let i=0;i<v.length/2;i++){if(i&mask)continue;const a=2*i,b=2*(i|mask),ar=v[a],ai=v[a+1],br=v[b],bi=v[b+1];v[a]=m[0]*ar-m[1]*ai+m[2]*br-m[3]*bi;v[a+1]=m[0]*ai+m[1]*ar+m[2]*bi+m[3]*br;v[b]=m[4]*ar-m[5]*ai+m[6]*br-m[7]*bi;v[b+1]=m[4]*ai+m[5]*ar+m[6]*bi+m[7]*br;}return v;}
function pulse(v,kind,q,t=0,theta=Math.PI/2){
 if(!Number.isInteger(q)||q<0||q>=Math.log2(v.length/2))throw Error('Qubit inválido');
 if(['CX','CZ','SWAP'].includes(kind)){if(q===t||t<0||t>=Math.log2(v.length/2))throw Error('Escolha dois qubits diferentes');const a=1<<q,b=1<<t;for(let i=0;i<v.length/2;i++){if(kind==='CZ'){if((i&a)&&(i&b)){v[2*i]*=-1;v[2*i+1]*=-1;}continue;}let j;if(kind==='CX'){if(!(i&a)||(i&b))continue;j=i|b;}else{if(!(i&a)||(i&b))continue;j=(i^a)|b;}for(let k=0;k<2;k++){const tmp=v[2*i+k];v[2*i+k]=v[2*j+k];v[2*j+k]=tmp;}}return v;}
 const c=Math.cos(theta/2),s=Math.sin(theta/2);
 const matrices={H:[SQ,0,SQ,0,SQ,0,-SQ,0],X:[0,0,1,0,1,0,0,0],Y:[0,0,0,-1,0,1,0,0],Z:[1,0,0,0,0,0,-1,0],S:[1,0,0,0,0,0,0,1],'S−':[1,0,0,0,0,0,0,-1],T:[1,0,0,0,0,0,SQ,SQ],RX:[c,0,0,-s,0,-s,c,0],RY:[c,0,-s,0,s,0,c,0],RZ:[c,-s,0,0,0,0,c,s]};
 if(!matrices[kind])throw Error('Pulso desconhecido');return gate(v,q,matrices[kind]);
}
function measure(v,q,strength,rng,forced){
 if(strength<0||strength>1||!Number.isFinite(strength))throw Error('Força inválida');let p0=0;const mask=1<<q;
 for(let i=0;i<v.length/2;i++)p0+=(v[2*i]**2+v[2*i+1]**2)*(1+((i&mask)?-1:1)*strength)/2;
 const result=forced===undefined?(rng()<p0?0:1):forced,prob=result===0?p0:1-p0;if(prob<1e-14)throw Error('Resultado de probabilidade zero');
 for(let i=0;i<v.length/2;i++){const z=(i&mask)?-1:1,f=Math.sqrt((1+(result===0?1:-1)*z*strength)/(2*prob));v[2*i]*=f;v[2*i+1]*=f;}return{result,prob,p0};
}
function reduced(v,sites){const n=Math.log2(v.length/2),other=Array.from({length:n},(_,i)=>i).filter(i=>!sites.includes(i)),d=1<<sites.length,e=1<<other.length,r=new Float64Array(2*d*d);const index=(a,b)=>{let x=0;sites.forEach((q,k)=>x|=((a>>k)&1)<<q);other.forEach((q,k)=>x|=((b>>k)&1)<<q);return x;};for(let a=0;a<d;a++)for(let b=0;b<d;b++)for(let k=0;k<e;k++){const i=2*index(a,k),j=2*index(b,k),p=2*(a*d+b);r[p]+=v[i]*v[j]+v[i+1]*v[j+1];r[p+1]+=v[i+1]*v[j]-v[i]*v[j+1];}return r;}
function purity(r){let p=0;for(const x of r)p+=x*x;return Math.max(0,Math.min(1,p));}
function entropy(v,sites=[0,1,2]){return Math.max(0,-Math.log2(Math.max(1e-15,purity(reduced(v,sites)))));}
function bloch(v,q){const r=reduced(v,[q]);return[2*r[2],-2*r[3],r[0]-r[6]];}
function overlap(v,w){let re=0,im=0;for(let i=0;i<v.length;i+=2){re+=v[i]*w[i]+v[i+1]*w[i+1];im+=v[i]*w[i+1]-v[i+1]*w[i];}return Math.min(1,re*re+im*im);}
function ghz(sites,n=6){const v=vacuum(n);pulse(v,'H',sites[0]);for(let i=1;i<sites.length;i++)pulse(v,'CX',sites[i-1],sites[i]);return v;}
function cluster(){const v=vacuum();for(let q=0;q<6;q++)pulse(v,'H',q);for(let q=0;q<5;q++)pulse(v,'CZ',q,q+1);return v;}
function bellFidelity(v,a,b){const r=reduced(v,[a,b]);return Math.max(0,Math.min(1,(r[0]+r[30]+2*r[6])/2));}
const missions=[
 {name:'A distância não separa',tag:'01 / CORRELAÇÃO',subtitle:'Produza um par de Bell entre q₀ e q₁.',brief:'Duas amplitudes precisam sobreviver com a mesma fase. Distribuição equilibrada, sozinha, não basta.',budget:4,threshold:.999,init:()=>vacuum(),score:v=>overlap(v,ghz([0,1])),hint:'H cria superposição. CX copia a correlação, não um estado quântico desconhecido. Comece em q₀ e use q₁ como alvo.'},
 {name:'O que a câmera não vê',tag:'02 / FASE RELATIVA',subtitle:'Recupere o Bell positivo sem destruir a correlação.',brief:'As probabilidades parecem certas. A fase relativa recebeu π/2. Corrija o estado, sem medir.',budget:3,threshold:.999,init:()=>{const v=ghz([0,1]);pulse(v,'S',0);return v;},score:v=>overlap(v,ghz([0,1])),hint:'S acrescenta π/2 ao ramo |1⟩. S− desfaz essa diferença de fase.'},
 {name:'Uma ponte que desaparece',tag:'03 / ENTANGLEMENT SWAPPING',subtitle:'Emaranhe q₀ e q₃ usando a ponte q₁–q₂.',brief:'Você recebe dois pares de Bell. A ponte deve ser medida, e os resultados precisam orientar a correção nas extremidades.',budget:9,threshold:.999,requireReadout:true,init:()=>{const v=ghz([0,1]);pulse(v,'H',2);pulse(v,'CX',2,3);return v;},score:v=>bellFidelity(v,0,3),hint:'CX q₁→q₂, H em q₁; meça q₁ e q₂ com força 1. Se q₂ der 1, X em q₃. Se q₁ der 1, Z em q₃.'},
 {name:'Seis vozes, um estado',tag:'04 / COERÊNCIA GLOBAL',subtitle:'Prepare GHZ de seis qubits com acoplamentos locais.',brief:'Somente vizinhos podem trocar pulsos de dois qubits. Construa correlações que atravessem a cadeia inteira.',budget:8,threshold:.999,local:true,init:()=>vacuum(),score:v=>overlap(v,ghz([0,1,2,3,4,5])),hint:'Um H numa extremidade, seguido por uma sequência de CX entre vizinhos, espalha o emaranhamento.'},
 {name:'A geometria da fase',tag:'05 / CLUSTER STATE',subtitle:'Construa o estado de grafo de uma cadeia com seis sítios.',brief:'Aqui, a informação está na geometria das fases relativas. O histograma de probabilidades não revela a solução.',budget:13,threshold:.999,local:true,init:()=>vacuum(),score:v=>overlap(v,cluster()),hint:'Prepare |+⟩ nos seis sítios com H. Depois, aplique CZ em cada uma das cinco arestas da cadeia.'},
 {name:'Apagar sem esquecer',tag:'06 / MEDIÇÃO FRACA',subtitle:'Reverta uma medição fraca condicionada ao resultado.',brief:'Um detector de força 0,65 já revelou um pouco de q₀. Uma segunda leitura oposta, na mesma força, pode desfazer a perturbação. Isso é probabilístico, não uma reversão universal.',budget:5,threshold:.999,requireReadout:true,strength:.65,init:()=>{const v=ghz([0,1]);measure(v,0,.65,()=>0,0);return v;},score:v=>overlap(v,ghz([0,1])),hint:'Selecione q₀, força 0,65 e meça. O resultado 1 desfaz o primeiro filtro. Se o resultado for 0, a tentativa pode falhar; uma nova semente muda a trajetória.'}
];
// Two unravelings of E(rho) = (1-p/2)rho + (p/2)Z rho Z.
function unravelings(p, samples=256, steps=20, seed=731){
 if(p<0||p>1||!Number.isFinite(p)||!Number.isInteger(samples)||samples<1||!Number.isInteger(steps)||steps<1)throw Error('Parâmetros inválidos');
 const rng=random(seed), ensembles=[0,1].map(()=>Array.from({length:samples},()=>ghz([0,1],2))), points=[];
 for(let t=0;t<=steps;t++){
  const ent=ensembles.map(vs=>vs.reduce((sum,v)=>sum+entropy(v,[0]),0)/samples);
  const densities=ensembles.map(vs=>{const r=new Float64Array(32);for(const v of vs){const one=reduced(v,[0,1]);for(let k=0;k<32;k++)r[k]+=one[k]/samples;}return r;});
  points.push({cycle:t,measurement:ent[0],kick:ent[1],expected:Math.pow(1-p,t),distance:Math.sqrt(densities[0].reduce((sum,x,k)=>sum+(x-densities[1][k])**2,0))});
  if(t===steps)break;
  ensembles.forEach((vs,mode)=>vs.forEach(v=>{pulse(v,'RY',0,0,.31);if(mode===0){if(rng()<p)measure(v,0,1,rng);}else if(rng()<p/2)pulse(v,'Z',0);}));
 }
 return points;
}
const api={unravelings,vacuum,norm,pulse,measure,reduced,purity,entropy,bloch,overlap,ghz,cluster,bellFidelity,random,missions,TAU};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Quantum=api;
})(typeof window!=='undefined'?window:globalThis);
