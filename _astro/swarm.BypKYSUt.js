import{_ as e,b as t,c as n,d as r,g as i,i as a,l as o,o as s,u as c}from"./app.CeaB3lnz.js";import{BLUR as l,sharedContext as u,uniforms as d,uploadDrone as f}from"./stage.BCc449a6.js";var p={count:9,narrowCount:6,narrowBelow:768,seed:7},m=1/120,h=8,g={distance:3},_={frequency:.9,drift:.045,detail:.35,lacunarity:2.03,speed:.11,gain:.7},v={inner:.6,k:1.6},y={reach:2,k:2.4,floor:.5,look:.6,hard:.95,settle:18,brake:14},b={rate:.5,maxSpeed:.24},x={every:3,offset:1,speed:2.4},S={radius:.26,push:3.2,sweep:2.2,depth:.6},C={omega:3.1,zeta:.55};function w(e,t){e.ms+=Math.min(t,200);let n=Math.floor(e.ms/(m*1e3));return e.ms-=n*m*1e3,Math.min(n,h)}function T(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function E(e,t,n=p.seed){let r=new Float32Array(e*16),i=T(n),[a,o,s]=t.centre,[c,l,u]=t.half;for(let t=0;t<e;t++){let n=t*16,d=t%3,f=1.15+.35*(t/Math.max(1,e-1))+i()*.15,p=(i()*2-1)*.7,m=d===0?a-c*f:d===2?a+c*f:a+c*p,h=d===1?o+l*(f+.2):o+l*(.2+p*.5),g=s+u*(i()*2-1)*.8;r[n]=m,r[n+1]=h,r[n+2]=g,r[n+3]=i()*64;let _=a-m,v=o-h,y=Math.hypot(_,v)||1;r[n+4]=_/y*b.maxSpeed*.9,r[n+5]=v/y*b.maxSpeed*.9,r[n+6]=0}for(let n=0;n<60;n++)z(r,e,t.radius,0);return r}function D(e,t){let n=new Float32Array(e*16),[r,i,a]=t.centre,[o,s,c]=t.half,l=[.35,-.25,.55,-.05,.2,-.4],u=[-.5,.45,-.1,.7,-.75,.2];for(let t=0;t<e;t++){let d=t*16;n[d]=r+o*((e>1?t/(e-1):.5)*2-1)*.78,n[d+1]=i+s*l[t%l.length],n[d+2]=a+c*u[t%u.length],n[d+4]=(t%2?-1:1)*.05,n[d+6]=.04}for(let r=0;r<60;r++)z(n,e,t.radius,0);return n}var O=e=>{let t=String(e);return t.includes(`.`)||t.includes(`e`)?t:`${t}.0`},k=`
struct Agent { p: vec4f, v: vec4f, o: vec4f, w: vec4f };
struct Params {
  // step index of the batch's first step, steps, agents, unused
  info: vec4u,
  centre: vec4f,
  half: vec4f,
  // pointer x, y (reference-plane units), strength, unused
  pointer: vec4f,
  // pointer velocity (units/s)
  pointerVel: vec4f,
};

@group(0) @binding(0) var<storage, read_write> agents: array<Agent>;
@group(0) @binding(1) var<uniform> params: Params;

var<workgroup> shared_pos: array<vec3f, 64>;
var<workgroup> shared_vel: array<vec3f, 64>;

fn pcg(v: u32) -> u32 {
  let s = v * 747796405u + 2891336453u;
  let w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u;
  return (w >> 22u) ^ w;
}

fn grad(ix: i32, iy: i32, iz: i32, channel: u32) -> vec3f {
  let h = pcg(bitcast<u32>(ix) + pcg(bitcast<u32>(iy) + pcg(bitcast<u32>(iz) + channel)));
  return vec3f(f32(h & 1023u), f32((h >> 10u) & 1023u), f32((h >> 20u) & 1023u)) / 511.5 - 1.0;
}

fn fade(t: f32) -> f32 {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

// 3D gradient noise (quintic fade).
fn noise(p: vec3f, channel: u32) -> f32 {
  let c = floor(p);
  let d = p - c;
  let ix = i32(c.x);
  let iy = i32(c.y);
  let iz = i32(c.z);
  var n: array<f32, 8>;
  for (var k = 0; k < 8; k++) {
    let o = vec3i(k & 1, (k >> 1) & 1, (k >> 2) & 1);
    n[k] = dot(grad(ix + o.x, iy + o.y, iz + o.z, channel), d - vec3f(o));
  }
  let u = fade(d.x);
  let v = fade(d.y);
  let w = fade(d.z);
  let x00 = mix(n[0], n[1], u);
  let x10 = mix(n[2], n[3], u);
  let x01 = mix(n[4], n[5], u);
  let x11 = mix(n[6], n[7], u);
  return mix(mix(x00, x10, v), mix(x01, x11, v), w);
}

// The potential's three components: two octaves each, a channel of their own.
fn potential(p: vec3f) -> vec3f {
  let q = p * ${O(_.lacunarity)};
  return vec3f(
    noise(p, 11u) + ${O(_.detail)} * noise(q, 17u),
    noise(p + vec3f(31.4, 0.0, 0.0), 23u) + ${O(_.detail)} * noise(q, 29u),
    noise(p + vec3f(0.0, 47.7, 0.0), 37u) + ${O(_.detail)} * noise(q, 41u),
  );
}

// Curl of the potential at a world point and time (central differences).
fn curl(world: vec3f, t: f32) -> vec3f {
  let p = world * ${O(_.frequency)} + vec3f(t * ${O(_.drift)}, t * ${O(_.drift*.7)}, t * ${O(-_.drift*.55)});
  let e = 0.01;
  let dx = potential(p + vec3f(e, 0.0, 0.0)) - potential(p - vec3f(e, 0.0, 0.0));
  let dy = potential(p + vec3f(0.0, e, 0.0)) - potential(p - vec3f(0.0, e, 0.0));
  let dz = potential(p + vec3f(0.0, 0.0, e)) - potential(p - vec3f(0.0, 0.0, e));
  return vec3f(dy.z - dz.y, dz.x - dx.z, dx.y - dy.x) / (2.0 * e);
}

fn home(p: vec3f) -> vec3f {
  let q = (p - params.centre.xyz) / params.half.xyz;
  let past = max(abs(q) - vec3f(${O(v.inner)}), vec3f(0.0));
  return -sign(q) * past * params.half.xyz * ${O(v.k)};
}

fn separate(agent: Agent, i: u32, count: u32, h: f32) -> Agent {
  var a = agent;
  let D = ${O(g.distance)};
  let me = shared_pos[i];
  let ahead = me + shared_vel[i] * ${O(y.look)};
  let pi = D / max(D - me.z, 0.1);
  let si = me.xy * pi;
  let ai = ahead.xy * (D / max(D - ahead.z, 0.1));
  let ri = params.half.w * pi;
  let settle = min(${O(y.settle)} * h, 1.0);
  let brake = 1.0 - exp(-${O(y.brake)} * h);
  var push = vec2f(0.0);
  var shift = vec2f(0.0);
  for (var j = 0u; j < count; j++) {
    if (j == i) { continue; }
    let q = shared_pos[j];
    let qa = q + shared_vel[j] * ${O(y.look)};
    let pj = D / max(D - q.z, 0.1);
    let sum = ri + params.half.w * pj;
    var d = si - q.xy * pj;
    var dist = length(d);
    // Ahead: how near the two paths come.
    let near = min(dist, length(ai - qa.xy * (D / max(D - qa.z, 0.1))));
    // Exactly on top: apart by index, deterministically.
    if (dist < 1e-5) {
      d = vec2f(f32(i) - f32(j), 0.5);
      dist = length(d);
    }
    let n = d / dist;
    let x = max(1.0 - near / (${O(y.reach)} * sum), 0.0);
    let close = max(near / sum, ${O(y.floor)});
    push += n * (${O(y.k)} * x * x / (close * close));
    let hard = ${O(y.hard)} * sum;
    if (dist < hard) {
      shift += n * ((hard - dist) * 0.5 * settle);
      let cv = dot(a.v.xy, n);
      if (cv < 0.0) { a.v = vec4f(a.v.xy - n * cv * brake, a.v.zw); }
      let cw = dot(a.w.xy, n);
      if (cw < 0.0) { a.w = vec4f(a.w.xy - n * cw * brake, a.w.zw); }
    }
  }
  // Screen units to world at this depth.
  a.v = vec4f(a.v.xy + push / pi * h, a.v.zw);
  a.p = vec4f(a.p.xy + shift / pi, a.p.zw);
  return a;
}

@compute @workgroup_size(64)
fn main(@builtin(local_invocation_index) i: u32) {
  let count = params.info.z;
  let live = i < count;
  var a = Agent(vec4f(0.0), vec4f(0.0), vec4f(0.0), vec4f(0.0));
  if (live) { a = agents[i]; }
  let h = ${O(m)};
  let decay = exp(-${O(b.rate)} * h);
  let omega = ${O(C.omega)};
  let zeta = ${O(C.zeta)};
  for (var s = 0u; s < params.info.y; s++) {
    let t = f32(params.info.x + s) * h;
    shared_pos[i] = a.p.xyz + a.o.xyz;
    workgroupBarrier();
    if (live) {
      let me = a.p.xyz + a.o.xyz;
      let lively = select(1.0, ${O(x.speed)}, i % ${x.every}u == ${x.offset}u);
      // Flight: towards the flow, home.
      let acc = (curl(a.p.xyz, t + a.p.w) * ${O(_.speed)} * lively - a.v.xyz) * ${O(_.gain)} + home(a.p.xyz);
      var v = (a.v.xyz + acc * h) * decay;
      let speed = length(v);
      let cap = ${O(b.maxSpeed)} * lively;
      if (speed > cap) { v = v * (cap / speed); }
      a.v = vec4f(v, 0.0);
      a.p = vec4f(a.p.xyz + v * h, a.p.w);
      // Disturbance: the pointer's push on screen, then the spring back.
      let depth = ${O(g.distance)} / max(${O(g.distance)} - me.z, 0.1);
      let d = me.xy * depth - params.pointer.xy;
      let dist = max(length(d), 1e-4);
      var k = clamp(1.0 - dist / ${O(S.radius)}, 0.0, 1.0);
      k = k * k * (3.0 - 2.0 * k) * params.pointer.z;
      let push = vec3f(d / dist * ${O(S.push)} + params.pointerVel.xy * ${O(S.sweep)}, -${O(S.depth)}) * k;
      let ow = a.w.xyz + (push - omega * omega * a.o.xyz - 2.0 * zeta * omega * a.w.xyz) * h;
      a.w = vec4f(ow, 0.0);
      a.o = vec4f(a.o.xyz + ow * h, 0.0);
    }
    // Apart, on screen, after the push: where every drone is now.
    workgroupBarrier();
    shared_pos[i] = a.p.xyz + a.o.xyz;
    shared_vel[i] = a.v.xyz + a.w.xyz;
    workgroupBarrier();
    if (live) { a = separate(a, i, count, h); }
    workgroupBarrier();
  }
  if (live) { agents[i] = a; }
}
`;function A(e){let t=Math.imul(e,747796405)+2891336453>>>0,n=Math.imul(t>>>(t>>>28)+4^t,277803737)>>>0;return(n>>>22^n)>>>0}var j=[0,0,0];function M(e,t,n,r){let i=A((e>>>0)+A((t>>>0)+A((n>>>0)+r>>>0)>>>0)>>>0);return j[0]=(i&1023)/511.5-1,j[1]=(i>>>10&1023)/511.5-1,j[2]=(i>>>20&1023)/511.5-1,j}var N=e=>e*e*e*(e*(e*6-15)+10),P=(e,t,n)=>e+(t-e)*n,ee=new Float64Array(8);function F(e,t,n,r){let i=Math.floor(e),a=Math.floor(t),o=Math.floor(n),s=e-i,c=t-a,l=n-o;for(let e=0;e<8;e++){let t=e&1,n=e>>1&1,u=e>>2&1,d=M(i+t,a+n,o+u,r);ee[e]=d[0]*(s-t)+d[1]*(c-n)+d[2]*(l-u)}let u=N(s),d=N(c),f=N(l),p=ee;return P(P(P(p[0],p[1],u),P(p[2],p[3],u),d),P(P(p[4],p[5],u),P(p[6],p[7],u),d),f)}function I(e,t,n,r){let i=_.lacunarity,a=_.detail,o=e*i,s=t*i,c=n*i;return r[0]=F(e,t,n,11)+a*F(o,s,c,17),r[1]=F(e+31.4,t,n,23)+a*F(o,s,c,29),r[2]=F(e,t+47.7,n,37)+a*F(o,s,c,41),r}var L=[0,0,0],R=[0,0,0];function te(e,t,n,r,i){let a=_.frequency,o=_.drift,s=e*a+r*o,c=t*a+r*o*.7,l=n*a+r*-o*.55,u=.01;I(s+u,c,l,L),I(s-u,c,l,R);let d=L[1]-R[1],f=L[2]-R[2];I(s,c+u,l,L),I(s,c-u,l,R);let p=L[0]-R[0],m=L[2]-R[2];I(s,c,l+u,L),I(s,c,l-u,R);let h=L[0]-R[0];return i[0]=(m-(L[1]-R[1]))/(2*u),i[1]=(h-f)/(2*u),i[2]=(d-p)/(2*u),i}var ne=e=>e>0?1:e<0?-1:0;function re(e,t,n){let r=m,i=Math.exp(-b.rate*r),a=C.omega,o=C.zeta,{centre:s,half:c}=n.volume,l=n.pointer,u=new Float64Array(t*3),d=[0,0,0];for(let f=0;f<n.steps;f++){let p=(n.step+f)*r;for(let n=0;n<t;n++){let t=n*16;u[n*3]=e[t]+e[t+8],u[n*3+1]=e[t+1]+e[t+9],u[n*3+2]=e[t+2]+e[t+10]}for(let n=0;n<t;n++){let t=n*16,f=u[n*3],m=u[n*3+1],h=u[n*3+2],y=n%x.every===x.offset?x.speed:1;te(e[t],e[t+1],e[t+2],p+e[t+3],d);let C=[0,0,0];for(let n=0;n<3;n++){let r=(e[t+n]-s[n])/c[n],i=Math.max(Math.abs(r)-v.inner,0);C[n]=(d[n]*_.speed*y-e[t+4+n])*_.gain+-ne(r)*i*c[n]*v.k}let w=(e[t+4]+C[0]*r)*i,T=(e[t+5]+C[1]*r)*i,E=(e[t+6]+C[2]*r)*i,D=Math.hypot(w,T,E);if(D>b.maxSpeed*y){let e=b.maxSpeed*y/D;w*=e,T*=e,E*=e}e[t+4]=w,e[t+5]=T,e[t+6]=E,e[t]+=w*r,e[t+1]+=T*r,e[t+2]+=E*r;let O=g.distance/Math.max(g.distance-h,.1),k=f*O-l.x,A=m*O-l.y,j=Math.max(Math.hypot(k,A),1e-4),M=Math.min(Math.max(1-j/S.radius,0),1);M=M*M*(3-2*M)*l.strength;let N=[(k/j*S.push+l.vx*S.sweep)*M,(A/j*S.push+l.vy*S.sweep)*M,-S.depth*M];for(let n=0;n<3;n++){let i=e[t+12+n]+(N[n]-a*a*e[t+8+n]-2*o*a*e[t+12+n])*r;e[t+12+n]=i,e[t+8+n]+=i*r}}z(e,t,n.volume.radius,r,u)}}function z(e,t,n,r,i=new Float64Array(t*3)){let a=g.distance,o=y.look,s=r>0?Math.min(y.settle*r,1):1,c=r>0?1-Math.exp(-y.brake*r):1,l=new Float64Array(t*3);for(let n=0;n<t;n++){let t=n*16;i[n*3]=e[t]+e[t+8],i[n*3+1]=e[t+1]+e[t+9],i[n*3+2]=e[t+2]+e[t+10];for(let r=0;r<3;r++)l[n*3+r]=i[n*3+r]+(e[t+4+r]+e[t+12+r])*o}for(let o=0;o<t;o++){let u=o*16,d=a/Math.max(a-i[o*3+2],.1),f=i[o*3]*d,p=i[o*3+1]*d,m=n*d,h=a/Math.max(a-l[o*3+2],.1),g=l[o*3]*h,_=l[o*3+1]*h,v=0,b=0,x=0,S=0;for(let r=0;r<t;r++){if(r===o)continue;let t=a/Math.max(a-i[r*3+2],.1),d=m+n*t,h=f-i[r*3]*t,C=p-i[r*3+1]*t,w=Math.hypot(h,C);w<1e-5&&(h=o-r,C=.5,w=Math.hypot(h,C));let T=h/w,E=C/w,D=a/Math.max(a-l[r*3+2],.1),O=Math.min(w,Math.hypot(g-l[r*3]*D,_-l[r*3+1]*D)),k=Math.max(1-O/(y.reach*d),0),A=Math.max(O/d,y.floor),j=y.k*k*k/(A*A);v+=T*j,b+=E*j;let M=y.hard*d;if(w<M){x+=T*((M-w)*.5*s),S+=E*((M-w)*.5*s);let t=e[u+4]*T+e[u+5]*E;t<0&&(e[u+4]-=T*t*c,e[u+5]-=E*t*c);let n=e[u+12]*T+e[u+13]*E;n<0&&(e[u+12]-=T*n*c,e[u+13]-=E*n*c)}}e[u+4]+=v/d*r,e[u+5]+=b/d*r,e[u]+=x/d,e[u+1]+=S/d}}var B=class{kind=`cpu`;count;#e;#t=0;constructor(e,t,n=0){this.#e=e.slice(),this.count=t,this.#t=n}get step(){return this.#t}advance(e){e.steps&&(re(this.#e,this.count,{...e,step:this.#t}),this.#t+=e.steps)}latest(){return{state:this.#e,step:this.#t}}destroy(){}},V={MAP_READ:1,COPY_SRC:4,COPY_DST:8,UNIFORM:64,STORAGE:128},H=1,U=3,W=class e{kind=`gpu`;count;#e;#t;#n;#r;#i;#a;#o=new ArrayBuffer(80);#s=0;#c;#l=!1;#u;constructor(e,t,n,r,i){this.#e=e,this.#t=t,this.count=r,this.#u=i,this.#c={state:n.slice(),step:0};let a=Math.max(4096,n.byteLength);this.#r=e.createBuffer({size:a,usage:V.STORAGE|V.COPY_SRC|V.COPY_DST}),e.queue.writeBuffer(this.#r,0,n),this.#i=e.createBuffer({size:80,usage:V.UNIFORM|V.COPY_DST}),this.#a=Array.from({length:U},()=>({buffer:e.createBuffer({size:n.byteLength,usage:V.MAP_READ|V.COPY_DST}),busy:!1})),this.#n=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.#r}},{binding:1,resource:{buffer:this.#i}}]}),e.lost.then(e=>{this.#l||this.#d(Error(`[swarm] device lost: ${e.message}`))})}static async create(t,n,r,i=2500){let a=navigator.gpu;if(!a)return null;try{let o=(async()=>{let i=await a.requestAdapter({powerPreference:`low-power`});if(!i)return null;let o=await i.requestDevice();o.pushErrorScope(`validation`);let s=o.createShaderModule({code:k}),c=await o.createComputePipelineAsync({layout:`auto`,compute:{module:s,entryPoint:`main`}}),l=await o.popErrorScope();return l?(console.warn(`[swarm] compute shader`,l.message),o.destroy(),null):new e(o,c,t,n,r)})(),s=new Promise(e=>window.setTimeout(()=>e(null),i)),c=await Promise.race([o,s]);return c||o.then(e=>e?.destroy()).catch(()=>{}),c}catch(e){return console.warn(`[swarm] no WebGPU`,e),null}}get step(){return this.#s}advance(e){if(this.#l||!e.steps)return;let t=this.#s;this.#s+=e.steps;try{let n=new Uint32Array(this.#o,0,4),r=new Float32Array(this.#o);n[0]=t,n[1]=e.steps,n[2]=this.count,n[3]=0,r.set([...e.volume.centre,0,...e.volume.half,e.volume.radius,e.pointer.x,e.pointer.y,e.pointer.strength,0,e.pointer.vx,e.pointer.vy,0,0],4);let i=this.#e;i.queue.writeBuffer(this.#i,0,this.#o);let a=i.createCommandEncoder(),o=a.beginComputePass();o.setPipeline(this.#t),o.setBindGroup(0,this.#n),o.dispatchWorkgroups(1),o.end();let s=this.#a.find(e=>!e.busy),c=this.count*16*4;if(s&&a.copyBufferToBuffer(this.#r,0,s.buffer,0,c),i.queue.submit([a.finish()]),!s)return;s.busy=!0;let l=this.#s;s.buffer.mapAsync(H,0,c).then(()=>{this.#l||(l>=this.#c.step&&(this.#c.state.set(new Float32Array(s.buffer.getMappedRange(0,c))),this.#c.step=l),s.buffer.unmap(),s.busy=!1)},e=>{this.#l||this.#d(e)})}catch(e){this.#d(e)}}latest(){return this.#c}#d(e){if(this.#l)return;console.warn(`[swarm] WebGPU failed, carrying on on the CPU`,e);let{state:t,step:n}=this.#c;this.destroy(),this.#u(t.slice(),n)}destroy(){if(!this.#l){this.#l=!0;try{this.#e.destroy()}catch{}}}},ie={share:1/12.5,min:58},G={x:.07,top:.85,title:.1,view:.9,depth:.6},ae=.3,K={yaw:2.2,yawSpeed:.06,accel:3,pitch:.45,cruise:.4,roll:.6,max:.38,ease:5},q={sway:.025,bob:.006},oe=.05,se={far:.4},ce={min:l.min,least:5},le=.85,J={from:.06,to:.62,line:3,band:.12,front:.03,glow:.12,dim:.5},ue={delay:900,fade:1400},Y={ease:5,velocityFade:7,tap:.7,tapFade:4},de={idle:30,idleAfter:6e3,slack:4},fe=`50% 0px 50% 0px`,X={budget:.35,downAfter:.5,upAfter:3,upShare:.5,warmup:1500,levels:[{samples:1,scale:1},{samples:.7,scale:.85},{samples:.5,scale:.7},{samples:.35,scale:.6}]},Z=new URLSearchParams(location.search),pe=Z.get(`swarm`),me=Z.has(`swarmtime`),he=Z.has(`swarmcompare`),ge=Z.has(`swarmquality`),Q=10,_e=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,ve=`#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in vec2 aUv;
uniform mat4 uModels[${Q}];
uniform float uHazes[${Q}];
uniform float uPhases[${Q}];
uniform mat4 uProjection;
uniform mat4 uPart;
uniform int uDrones;
uniform int uSamples;
// Spin axis (xyz) and direction (w; 0: a part that doesn't spin); base angle and blur arc.
uniform vec4 uSpin;
uniform vec2 uAngle;
out vec2 vUv;
out vec3 vNormal;
flat out float vHaze;
mat4 spin(vec3 a, float t) {
  float c = cos(t), s = sin(t), k = 1.0 - c;
  return mat4(
    c + a.x * a.x * k, a.y * a.x * k + a.z * s, a.z * a.x * k - a.y * s, 0.0,
    a.x * a.y * k - a.z * s, c + a.y * a.y * k, a.z * a.y * k + a.x * s, 0.0,
    a.x * a.z * k + a.y * s, a.y * a.z * k - a.x * s, c + a.z * a.z * k, 0.0,
    0.0, 0.0, 0.0, 1.0);
}
void main() {
  int d = gl_InstanceID % uDrones;
  int blurSample = gl_InstanceID / uDrones;
  mat4 m = uModels[d] * uPart;
  if (uSpin.w != 0.0) {
    float offset = uSamples > 1 ? (float(blurSample) / float(uSamples - 1) - 0.5) * uAngle.y : 0.0;
    m = m * spin(uSpin.xyz, (uAngle.x + uPhases[d] + offset) * uSpin.w);
  }
  vUv = aUv;
  vNormal = normalize(mat3(m) * aNormal);
  vHaze = uHazes[d];
  gl_Position = uProjection * m * vec4(aPosition, 1.0);
}`;function ye(e){return`${e.replace(`void main()`,`void metalMain()`)}
flat in float vHaze;
void main() {
  metalMain();
  outColor.rgb *= 1.0 - vHaze;
}`}var $=`#version 300 es
precision highp float;
uniform sampler2D uSharp;
uniform ivec2 uOrigin;
out vec4 outColor;
void main() {
  outColor = texelFetch(uSharp, ivec2(gl_FragCoord.xy) - uOrigin, 0);
}`,be=`#version 300 es
precision highp float;
uniform float uProgress;
uniform float uCanvasH;
uniform float uDpr;
out vec4 outColor;
float hash(float n) {
  return fract(sin(n * 12.9898) * 43758.5453);
}
void main() {
  // CSS px down from the hero's top; its height as 0 (top) .. 1 (bottom).
  float y = (uCanvasH - gl_FragCoord.y) / uDpr;
  float down = y / (uCanvasH / uDpr);
  float line = floor(y / ${J.line.toFixed(1)});
  // A line's moment: the bottom first, a little early or late on its own.
  float at = (1.0 - down) * ${(1-J.band).toFixed(3)} + hash(line) * ${J.band.toFixed(3)};
  float gone = step(at, uProgress);
  float glow = smoothstep(at - ${J.front.toFixed(3)}, at, uProgress) * (1.0 - gone) * ${J.glow.toFixed(3)};
  float ink = max(gone, uProgress * ${J.dim.toFixed(3)});
  vec3 inkColour = vec3(12.0 / 255.0);
  vec3 light = vec3(232.0, 238.0, 240.0) / 255.0;
  outColor = vec4(inkColour * ink + light * glow * (1.0 - ink), ink + glow * (1.0 - ink));
}`,xe=new WeakMap;function Se(e,t){let n=xe.get(e);return n||(n={drone:a(e.gl,ve,ye(t)),composite:a(e.gl,_e,$),exit:a(e.gl,_e,be)},xe.set(e,n)),n}var Ce=128;function we(e,t,n,r){let i=Math.min(4,e.getParameter(e.MAX_SAMPLES)),a=(r,a)=>{let o=e.createRenderbuffer();return e.bindRenderbuffer(e.RENDERBUFFER,o),a?e.renderbufferStorageMultisample(e.RENDERBUFFER,i,r,t,n):e.renderbufferStorage(e.RENDERBUFFER,r,t,n),o},o=r=>{let i=e.createTexture();e.bindTexture(e.TEXTURE_2D,i),e.texStorage2D(e.TEXTURE_2D,1,r,t,n);for(let[t,n]of[[e.TEXTURE_MIN_FILTER,e.NEAREST],[e.TEXTURE_MAG_FILTER,e.NEAREST],[e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE],[e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE]])e.texParameteri(e.TEXTURE_2D,t,n);return i},s=!0,c=t=>{let n=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,n),t(),s&&=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE,n},l=a(e.RGBA8,!0),u=a(e.DEPTH_COMPONENT24,!0),d=o(e.RGBA8),f=o(r?e.RGBA16F:e.RGBA8),p=a(e.DEPTH_COMPONENT24,!1),m={width:t,height:n,msaaColor:l,msaaDepth:u,color:d,blurColor:f,blurDepth:p,msaa:c(()=>{e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,l),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,u)}),resolved:c(()=>e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,d,0)),blur:c(()=>{e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,f,0),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,p)})};return e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindRenderbuffer(e.RENDERBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),s?m:(Te(e,m),r?we(e,t,n,!1):null)}function Te(e,t){for(let n of[t.msaa,t.resolved,t.blur])e.deleteFramebuffer(n);for(let n of[t.msaaColor,t.msaaDepth,t.blurDepth])e.deleteRenderbuffer(n);for(let n of[t.color,t.blurColor])e.deleteTexture(n)}var Ee=class{#e;#t;#n;#r;#i=null;#a=null;#o=null;#s=null;#c=new Float32Array(160);#l=new Float32Array(Q);#u=new Float32Array(Q);#d=null;#f={destroy:()=>this.#ie()};#p=!1;#m=null;#h=!1;#g=null;#_=null;#v;#y;#b;#x=window.matchMedia(`(prefers-reduced-motion: reduce)`);#S=window.matchMedia(`(hover: hover)`);#C=!1;#w=!1;#T;#E={width:1,height:1,top:0,left:0,view:1};#D={centre:[0,0,0],half:[1,1,G.depth],radius:.1};#O={reach:1/0,across:1/0};#k=null;#A=null;#j=new Map;#M;#N={ms:0};#P=[];#F={clientX:0,clientY:0,over:!1,strength:0,vx:0,vy:0,wx:0,wy:0,lastX:NaN,lastY:NaN,lastT:0,tap:0};#I={x:0,y:0,vx:0,vy:0,strength:0};#L=0;#R=0;#z=performance.now();#B=!0;#V=!1;#H=ge?Math.min(X.levels.length-1,Math.max(0,Number(Z.get(`swarmquality`))||0)):0;#U=0;#W=0;#G=0;#K=-1;#q={ext:null,query:null,ms:-1};#J=new Map;constructor(e,n,r,i=()=>window.scrollY){this.#e=e,this.#t=e.closest(`section`)??e,this.#n=n,this.#T=r,this.#r=i,this.#M=window.innerWidth<p.narrowBelow?p.narrowCount:p.count,this.#v=t.add(this.#le,{order:85}),this.#y=new IntersectionObserver(([e])=>{this.#C=!!e?.isIntersecting,this.#C||this.#oe(),this.#te()}),this.#b=new ResizeObserver(()=>{this.#ne(),this.#B=!0,this.#te()})}async load(e){let t=u(e);if(!t)return!1;let n=await f(t,this.#n);if(this.#w||!n||t.gl.isContextLost()||(this.#i=t,this.#a=n,this.#o=Se(t,e),this.#q.ext=t.gl.getExtension(`EXT_disjoint_timer_query_webgl2`),this.#ne(),await this.#Y(),this.#w))return!1;window.addEventListener(`pointermove`,this.#Z,{passive:!0}),window.addEventListener(`pointerdown`,this.#Q,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,this.#$);for(let e of[`wheel`,`keydown`,`scroll`])window.addEventListener(e,this.#X,{passive:!0});return document.addEventListener(`visibilitychange`,this.#te),this.#x.addEventListener(`change`,this.#ee),this.#y.observe(this.#e),this.#b.observe(this.#e),this.#b.observe(document.body),document.fonts?.ready.then(()=>{this.#ne(),this.#te()}),window.setTimeout(()=>!this.#w&&this.#ne(),2500),!0}async#Y(){let e=E(this.#M,this.#D);if(pe!==`cpu`){let t=await W.create(e,this.#M,(e,t)=>{this.#w||(this.#k=new B(e,this.#M,t))});if(this.#w){t?.destroy();return}t?(this.#k=t,he&&(this.#A=new B(e,this.#M))):pe===`gpu`&&console.warn(`[swarm] WebGPU unavailable: CPU simulation`)}this.#k??=new B(e,this.#M),this.#P=Array.from({length:this.#M},(t,n)=>{let r=n*16,i=e[r+4],a=e[r+6];return{yaw:Math.atan2(-i,-a),roll:0,pitch:0,ax:0,ay:0,az:0,ux:e[r+4],uy:e[r+5],uz:e[r+6],at:0}}),window.__swarmKind=this.#k.kind}#X=e=>{this.#z=performance.now(),e?.type===`scroll`&&this.#x.matches&&(this.#B=!0),this.#te()};#Z=e=>{if(e.pointerType===`touch`)return;let t=this.#F,n=performance.now();t.clientX=e.clientX,t.clientY=e.clientY,t.over=this.#S.matches;let r=this.#E,i=e.clientX/(r.width/2),a=-e.clientY/(r.width/2);if(Number.isFinite(t.lastX)&&n>t.lastT){let e=Math.max(8,n-t.lastT)/1e3;t.vx+=((i-t.lastX)/e-t.vx)*.5,t.vy+=((a-t.lastY)/e-t.vy)*.5}t.lastX=i,t.lastY=a,t.lastT=n,this.#X()};#Q=e=>{if(e.pointerType!==`touch`)return;let t=this.#F;t.clientX=e.clientX,t.clientY=e.clientY,t.tap=Y.tap,t.vx=t.vy=0,this.#X()};#$=()=>{this.#F.over=!1,this.#te()};#ee=()=>{this.#B=!0,this.#te()};#te=()=>{this.#w||!this.#C||document.hidden||!this.#k||this.#v.wake()};#ne(){let e=this.#E,t=this.#t,n=this.#e.getBoundingClientRect();e.width=Math.max(1,this.#e.clientWidth),e.height=Math.max(1,this.#e.clientHeight),e.top=n.top+this.#r(),e.left=n.left,e.view=window.innerHeight;let r=t.querySelector(`h1`)?.getBoundingClientRect(),i=(parseFloat(getComputedStyle(t).paddingTop)||0)*G.top,a=r?r.top-n.top+r.height*G.title:e.height*.6,o=Math.max(i+e.height*.2,Math.min(a,e.view*G.view,e.height)),s=e.width*G.x,c=e.width*(1-G.x),l=t=>(t-e.width/2)/(e.width/2),u=t=>-(t-e.height/2)/(e.width/2);this.#D={centre:[(l(s)+l(c))/2,(u(i)+u(o))/2,0],half:[(l(c)-l(s))/2,(u(i)-u(o))/2,G.depth],radius:this.#a?this.#he().reach:.1}}#re(){return this.#E.top-this.#r()}#ie(){this.#i?.canvas.removeEventListener(`webglcontextlost`,this.#ce),this.#p=!1,this.#m=null,this.#se(null),this.#d=null}#ae(){let e=this.#i;if(this.#p&&e.owner===this.#f)return!0;this.#p=!1;let t=e.canvas,n=e.owner,r=n?t.parentElement?.closest(`[data-module="flyover"]`):null;if(n&&r?.isConnected){if(this.#se(r),this.#h||!t.parentElement)return!1;this.#m={owner:n,parent:t.parentElement,next:t.nextSibling,style:t.style.cssText,width:t.width,height:t.height}}else n&&n.destroy();return e.owner=this.#f,this.#p=!0,t.width=t.height=1,t.style.cssText=`position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity ${this.#V?500:ue.fade}ms cubic-bezier(0.33,1,0.68,1)`,this.#e.append(t),this.#d=t,t.addEventListener(`webglcontextlost`,this.#ce),this.#B=!0,requestAnimationFrame(()=>{this.#d===t&&this.#p&&(t.style.opacity=`1`)}),!0}#oe(){let e=this.#i,t=this.#m;if(!e||!this.#p||!t)return;let n=e.canvas;n.removeEventListener(`webglcontextlost`,this.#ce),this.#p=!1,this.#m=null,this.#d=null,t.parent.isConnected?(n.style.cssText=t.style,n.width=t.width,n.height=t.height,t.parent.insertBefore(n,t.next&&t.next.parentNode===t.parent?t.next:null),e.owner=t.owner):(n.remove(),e.owner===this.#f&&(e.owner=null))}#se(e){e!==this.#_&&(this.#g?.disconnect(),this.#g=null,this.#_=e,this.#h=!1,e&&(this.#h=!0,this.#g=new IntersectionObserver(([e])=>{this.#h=!!e?.isIntersecting,this.#h?this.#oe():this.#te()},{rootMargin:fe}),this.#g.observe(e)))}#ce=()=>{this.destroy()};#le=(e,t)=>{if(this.#w||!this.#C||document.hidden||!this.#k||!this.#i)return!1;if(e-this.#T<ue.delay)return window.setTimeout(this.#te,ue.delay-(e-this.#T)),!1;if(!this.#ae())return!1;if(this.#x.matches)return this.#B&&this.#de(e,0,!0),!1;this.#ue(t);let n=e-this.#z>de.idleAfter?1e3/de.idle:0;return(this.#B||e-this.#R>=n-de.slack)&&this.#de(e,n,!1),!0};#ue(e){let t=this.#F,n=this.#E,r=e/1e3;if(t.strength+=(+!!t.over-t.strength)*(1-Math.exp(-Y.ease*r)),t.tap*=Math.exp(-Y.tapFade*r),performance.now()-t.lastT>40){let e=Math.exp(-Y.velocityFade*r);t.vx*=e,t.vy*=e}let i=t.clientX-n.left,a=t.clientY-this.#re(),o=this.#I;o.x=(i-n.width/2)/(n.width/2),o.y=-(a-n.height/2)/(n.width/2),o.vx=t.vx,o.vy=t.vy,o.strength=Math.max(t.strength,t.tap);let s=w(this.#N,e),c={steps:s,volume:this.#D,pointer:o};if(this.#k.advance(c),this.#A&&s){this.#A.advance(c),this.#j.set(this.#A.step,this.#A.latest().state.slice());for(let e of this.#j.keys())e<this.#A.step-64&&this.#j.delete(e)}}#de(e,t,n){let r=this.#R?e-this.#R:0;this.#B=!1;let i=performance.now(),a=this.#i.gl,o=this.#q,s=!1;o.ext&&!o.query&&(o.query=a.createQuery(),o.query&&(a.beginQuery(o.ext.TIME_ELAPSED_EXT,o.query),s=!0));try{this.#pe(e,r,n),this.#me()}finally{s&&o.ext&&a.endQuery(o.ext.TIME_ELAPSED_EXT)}let c=performance.now()-i;if(me){a.readPixels(0,0,1,1,a.RGBA,a.UNSIGNED_BYTE,new Uint8Array(4));let e=window;(e.__swarmTimes??=[]).push(performance.now()-i),(e.__swarmCpu??=[]).push(c)}n||this.#ye(e,r,c,t),this.#R=e,this.#V||(this.#V=!0,this.#K=e)}#fe(e,t){let n=this.#k,r=this.#M,{state:i,step:a}=t?{state:D(r,this.#D),step:0}:n.latest(),o=t?0:Math.min(oe,(n.step-a)*m);if(he&&this.#A&&!t){let e=this.#j.get(a);if(e){let t=0;for(let n=0;n<r*16;n++)n%4!=3&&(t=Math.max(t,Math.abs(e[n]-i[n])));let n=window;(n.__swarmCompare??=[]).push([a,t])}}let s=Math.min(e,100)/1e3,c=n.step*m%1e3,l=[];for(let e=0;e<r;e++){let n=e*16,r=this.#P[e],u=i[n+4]+i[n+12],d=i[n+5]+i[n+13],f=i[n+6]+i[n+14],p=i[n]+i[n+8]+u*o,h=i[n+1]+i[n+9]+d*o,g=i[n+2]+i[n+10]+f*o;if(t){l.push({x:p,y:h,z:g,yaw:Math.atan2(-u,-f),roll:0,pitch:0,i:e});continue}if(a>r.at){let e=(a-r.at)*m,t=1-Math.exp(-K.accel*e);r.ax+=((u-r.ux)/e-r.ax)*t,r.ay+=((d-r.uy)/e-r.ay)*t,r.az+=((f-r.uz)/e-r.az)*t,r.ux=u,r.uy=d,r.uz=f,r.at=a}let _=Math.hypot(u,f),v=K.yaw*Math.min(1,_/K.yawSpeed),y=De(Math.atan2(-u,-f)-r.yaw);r.yaw=De(r.yaw+y*(1-Math.exp(-v*s)));let b=-Math.sin(r.yaw),x=-Math.cos(r.yaw),S=Math.cos(r.yaw),C=-Math.sin(r.yaw),w=r.ax*b+r.az*x,T=r.ax*S+r.az*C,E=u*b+f*x,D=Oe(-K.pitch*w-K.cruise*E,K.max),O=Oe(-K.roll*T,K.max),k=1-Math.exp(-K.ease*s);r.pitch+=(D-r.pitch)*k,r.roll+=(O-r.roll)*k;let A=i[n+3];l.push({x:p,y:h+Math.sin(c*1.7+A)*q.bob,z:g,yaw:r.yaw,roll:r.roll+Math.sin(c*1.3+A*2)*q.sway,pitch:r.pitch+Math.sin(c*1.1+A*3)*q.sway*.7,i:e})}return l.sort((e,t)=>e.z-t.z)}#pe(e,t,a){let u=this.#i,f=u.gl,p=this.#d,m=this.#a,h=this.#o,_=this.#E,v=X.levels[this.#H],y=Math.min(Math.max(window.devicePixelRatio||1,1),2)*v.scale,b=Math.max(1,Math.round(_.width*y)),x=Math.max(1,Math.round(_.height*y));(p.width!==b||p.height!==x)&&(p.width=b,p.height=x),f.bindFramebuffer(f.FRAMEBUFFER,null),f.viewport(0,0,b,x),f.disable(f.SCISSOR_TEST),f.colorMask(!0,!0,!0,!0),f.clearColor(0,0,0,0),f.clear(f.COLOR_BUFFER_BIT);let S=this.#R?Math.min(1e3/30,e-this.#R):1e3/60;this.#L=a?0:(this.#L+56*S/1e3)%(Math.PI*2);let C=this.#fe(t||1e3/60,a),w=g.distance,T=1/w,E=T*_.height/_.width,D=this.#re(),{sizeWorld:O,scale:k,reach:A}=this.#he();me&&!a&&this.#ge(C,A,O/2);let j=[0,1,2].map(e=>(m.min[e]+m.max[e])/2),M=s(Ae(k),r(-j[0],-j[1],-j[2])),N=this.#c,P=this.#l,ee=this.#u,F=0,I=1/0,L=1/0,R=-1/0,te=-1/0,ne=1/0,re=[];for(let e of C){let t=w-e.z,i=w/t,a=_.width/2+e.x*i*(_.width/2),l=_.height/2-e.y*i*(_.width/2),u=A*i*_.width/2;if(me&&re.push([e.i,Math.round(a),Math.round(l),+(O*i*(_.width/2)).toFixed(1),+i.toFixed(3)]),D+l+u<0||D+l-u>_.view||F>=Q)continue;I=Math.min(I,(a-u)*y),R=Math.max(R,(a+u)*y),L=Math.min(L,(l-u)*y),te=Math.max(te,(l+u)*y),ne=Math.min(ne,t);let d=s(r(e.x,e.y,e.z-w),s(n(ae),s(o(e.yaw),s(c(e.roll),s(n(e.pitch),M)))));N.set(d,F*16),P[F]=se.far*Math.min(1,Math.max(0,(this.#D.half[2]-e.z)/(2*this.#D.half[2]))),ee[F]=e.i*1.7,F++}if(me&&(window.__swarmInfo={kind:this.#k.kind,quality:this.#H,gpuMs:+this.#q.ms.toFixed(2),cost:+this.#U.toFixed(2),width:_.width,canvas:[b,x],sizeWorld:O,agents:re}),!F)return;let z=Math.max(0,Math.floor(I)),B=Math.max(0,Math.floor(L)),V=Math.min(b,Math.ceil(R))-z,H=Math.min(x,Math.ceil(te))-B;if(V<=0||H<=0)return;let U=this.#ve(f,u,V,H);if(!U)return;let W=Math.max(.05,w-G.depth*1.6-A*2),ie=w+G.depth*1.6+A*2,K=e=>e/b*2-1,q=e=>1-e/x*2,oe=je(K(z)*T*W,K(z+V)*T*W,q(B+H)*E*W,q(B)*E*W,W,ie),le=h.drone;f.useProgram(le),f.activeTexture(f.TEXTURE0),f.bindTexture(f.TEXTURE_2D,m.ao),f.activeTexture(f.TEXTURE1),f.bindTexture(f.TEXTURE_2D,m.ink);let J=d(f,le);f.uniform1i(J(`uMaskMap`),0),f.uniform1i(J(`uEnvMap`),1),f.uniformMatrix4fv(J(`uModels`),!1,N),f.uniform1fv(J(`uHazes`),P),f.uniform1fv(J(`uPhases`),ee),f.uniformMatrix4fv(J(`uProjection`),!1,oe),f.uniform1i(J(`uDrones`),F);let ue=J(`uUni`),Y=J(`uPart`),de=J(`uSamples`),fe=J(`uSpin`),Z=J(`uAngle`),pe=m.gimbals.length?i({meshes:[],rotors:[],gimbals:m.gimbals},{}):[],he=m.parts.filter(e=>!e.rotor),ge=m.parts.filter(e=>e.rotor),_e=(e,t)=>{f.uniform4fv(ue,this.#_e(e.primitive)),f.bindVertexArray(e.vao),f.drawElementsInstanced(f.TRIANGLES,e.count,e.type,0,t)},ve=()=>{f.uniform4f(fe,0,0,0,0),f.uniform1i(de,1);for(let e of he)f.uniformMatrix4fv(Y,!1,e.gimbal===void 0?ke:pe[e.gimbal]),_e(e,F)},ye=e=>{f.uniform1i(de,e),f.uniform2f(Z,this.#L,e>1?l.arc:0);for(let t of ge){let n=t.rotor;f.uniformMatrix4fv(Y,!1,n.matrix);let r=Math.hypot(...n.axis)||1;f.uniform4f(fe,n.axis[0]/r,n.axis[1]/r,n.axis[2]/r,n.dir||1),_e(t,F*e)}};if(f.bindFramebuffer(f.FRAMEBUFFER,U.msaa),f.viewport(0,0,V,H),f.enable(f.SCISSOR_TEST),f.scissor(0,0,V,H),f.disable(f.BLEND),f.enable(f.DEPTH_TEST),f.depthFunc(f.LESS),f.depthMask(!0),f.disable(f.CULL_FACE),f.clear(f.COLOR_BUFFER_BIT|f.DEPTH_BUFFER_BIT),ve(),a||!ge.length)ye(1);else{let e=(m.rotorRadii[0]??0)*k*(w/ne)*_.width*y/2,t=Math.max(ce.least,Math.round(Math.min(l.samples,Math.max(ce.min,Math.ceil(l.arc*e/l.tipGap)))*v.samples));f.bindFramebuffer(f.FRAMEBUFFER,U.blur),f.clear(f.COLOR_BUFFER_BIT|f.DEPTH_BUFFER_BIT),f.colorMask(!1,!1,!1,!1),ve(),f.colorMask(!0,!0,!0,!0),f.depthMask(!1),f.enable(f.BLEND),f.blendColor(0,0,0,1/t),f.blendFunc(f.CONSTANT_ALPHA,f.ONE),ye(t),f.depthMask(!0),f.bindFramebuffer(f.FRAMEBUFFER,U.msaa),f.disable(f.DEPTH_TEST),f.blendFunc(f.ONE,f.ONE_MINUS_SRC_ALPHA),f.useProgram(u.composite),f.activeTexture(f.TEXTURE0),f.bindTexture(f.TEXTURE_2D,U.blurColor),f.uniform1i(d(f,u.composite)(`uTex`),0),f.viewport(0,0,U.width,U.height),f.drawArrays(f.TRIANGLES,0,3),f.disable(f.BLEND)}f.bindVertexArray(null),f.disable(f.SCISSOR_TEST),f.bindFramebuffer(f.READ_FRAMEBUFFER,U.msaa),f.bindFramebuffer(f.DRAW_FRAMEBUFFER,U.resolved),f.blitFramebuffer(0,0,V,H,0,0,V,H,f.COLOR_BUFFER_BIT,f.NEAREST),f.bindFramebuffer(f.READ_FRAMEBUFFER,null),f.bindFramebuffer(f.DRAW_FRAMEBUFFER,null),f.bindFramebuffer(f.FRAMEBUFFER,null),f.disable(f.DEPTH_TEST);let $=[z,x-B-H];f.viewport($[0],$[1],V,H),f.enable(f.BLEND),f.blendFunc(f.ONE,f.ONE_MINUS_SRC_ALPHA);let be=h.composite;f.useProgram(be);let xe=d(f,be);f.activeTexture(f.TEXTURE0),f.bindTexture(f.TEXTURE_2D,U.color),f.uniform1i(xe(`uSharp`),0),f.uniform2i(xe(`uOrigin`),$[0],$[1]),f.drawArrays(f.TRIANGLES,0,3),f.disable(f.BLEND),f.activeTexture(f.TEXTURE1),f.bindTexture(f.TEXTURE_2D,null),f.activeTexture(f.TEXTURE0),f.bindTexture(f.TEXTURE_2D,null),f.enable(f.DEPTH_TEST)}#me(){let e=this.#E,t=this.#i,n=this.#o;if(!t||!n||!e.height)return;let r=Math.max(0,-this.#re())/e.height,i=Math.min(1,Math.max(0,(r-J.from)/(J.to-J.from)));if(i<=0)return;let a=t.gl,o=t.canvas;a.bindFramebuffer(a.FRAMEBUFFER,null),a.viewport(0,0,o.width,o.height),a.disable(a.DEPTH_TEST),a.enable(a.BLEND),a.blendFunc(a.ONE,a.ONE_MINUS_SRC_ALPHA),a.useProgram(n.exit);let s=d(a,n.exit);a.uniform1f(s(`uProgress`),i),a.uniform1f(s(`uCanvasH`),o.height),a.uniform1f(s(`uDpr`),o.height/e.height),a.drawArrays(a.TRIANGLES,0,3),a.disable(a.BLEND),a.enable(a.DEPTH_TEST)}#he(){let e=this.#a,t=this.#E,n=Math.max(e.max[0]-e.min[0],e.max[2]-e.min[2]),r=2*Math.max(t.width*ie.share,ie.min)/t.width,i=r/n;return{sizeWorld:r,scale:i,reach:e.reach*i}}#ge(e,t,n){let r=g.distance,i=1/0,a=1/0;for(let o=0;o<e.length;o++)for(let s=o+1;s<e.length;s++){let c=e[o],l=e[s],u=r/(r-c.z),d=r/(r-l.z),f=Math.hypot(c.x*u-l.x*d,c.y*u-l.y*d);i=Math.min(i,f/(t*(u+d))),a=Math.min(a,f/(n*(u+d)))}let o=this.#O,s=window;s.__swarmGapReset&&(s.__swarmGapReset=!1,o.reach=o.across=1/0),i<o.reach&&(s.__swarmGapAt={t:Math.round(performance.now()),step:this.#k.step,read:this.#k.latest().step,value:+i.toFixed(3)}),o.reach=Math.min(o.reach,i),o.across=Math.min(o.across,a),window.__swarmGap={now:+i.toFixed(3),min:+o.reach.toFixed(3),minAcross:+o.across.toFixed(3),reachToHalf:+(t/n).toFixed(3)}}#_e(t){let n=this.#J.get(t);if(!n){let r=e(this.#n.primitives[t],0);r[10]*=le,n=new Float32Array(r),this.#J.set(t,n)}return n}#ve(e,t,n,r){let i=this.#s;if(i&&i.width>=n&&i.height>=r)return i;i&&Te(e,i);let a=e=>Math.ceil(e/Ce)*Ce;return this.#s=we(e,Math.max(a(n),i?.width??0),Math.max(a(r),i?.height??0),t.halfFloat),this.#s}#ye(e,n,r,i){let a=this.#i?.gl,o=this.#q;a&&o.ext&&o.query&&a.getQueryParameter(o.query,a.QUERY_RESULT_AVAILABLE)&&(a.getParameter(o.ext.GPU_DISJOINT_EXT)||(o.ms=a.getQueryParameter(o.query,a.QUERY_RESULT)/1e6,me&&(window.__swarmGpu??=[]).push(o.ms)),a.deleteQuery(o.query),o.query=null);let s=o.ext?Math.max(r,o.ms):r;s>=0&&(this.#U=this.#U?this.#U+(s-this.#U)*.1:s);let c=this.#K<0||e-this.#K<X.warmup?0:Math.min(.1,n/1e3),l=X.budget*Math.max(i,t.interval,1e3/120);this.#W=this.#U>l&&c?this.#W+c:0,this.#G=this.#U<l*X.upShare&&c?this.#G+c:0,!ge&&(this.#W>X.downAfter&&this.#H<X.levels.length-1?(this.#H++,this.#W=0,this.#U=l):this.#G>X.upAfter&&this.#H>0&&(this.#H--,this.#G=0))}destroy(){if(this.#w)return;this.#oe(),this.#w=!0,this.#v.remove(),this.#y.disconnect(),this.#b.disconnect(),this.#se(null),window.removeEventListener(`pointermove`,this.#Z),window.removeEventListener(`pointerdown`,this.#Q),document.documentElement.removeEventListener(`pointerleave`,this.#$);for(let e of[`wheel`,`keydown`,`scroll`])window.removeEventListener(e,this.#X);document.removeEventListener(`visibilitychange`,this.#te),this.#x.removeEventListener(`change`,this.#ee),this.#k?.destroy(),this.#k=null;let e=this.#i;e&&!e.gl.isContextLost()&&(this.#q.query&&e.gl.deleteQuery(this.#q.query),this.#s&&Te(e.gl,this.#s)),this.#s=null,e?.canvas.removeEventListener(`webglcontextlost`,this.#ce),e?.owner===this.#f&&(e.owner=null,e.canvas.remove()),this.#d=null}};function De(e){return e-Math.round(e/(Math.PI*2))*Math.PI*2}function Oe(e,t){return Math.min(t,Math.max(-t,e))}var ke=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);function Ae(e){let t=new Float32Array(16);return t[0]=t[5]=t[10]=e,t[15]=1,t}function je(e,t,n,r,i,a){let o=new Float32Array(16);return o[0]=2*i/(t-e),o[5]=2*i/(r-n),o[8]=(t+e)/(t-e),o[9]=(r+n)/(r-n),o[10]=-(a+i)/(a-i),o[11]=-1,o[14]=-2*a*i/(a-i),o}export{Ee as Swarm};