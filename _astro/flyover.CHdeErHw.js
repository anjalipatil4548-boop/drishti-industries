import{_ as e,b as t,c as n,d as r,g as i,o as a,u as o,v as s}from"./app.CeaB3lnz.js";import{BLUR as c,axisRotation as l,blurTarget as u,frameTargets as d,nextFrame as f,sharedContext as p,takeCanvas as m,uniforms as h,uploadDrone as g}from"./stage.BCc449a6.js";var _={extra:0,edge:.08},v={ends:.5,notes:.25},y=.18,b=2400;function x(e,t,n,r){return n+(r-n)*Math.min(1,Math.max(0,e/Math.max(1,t)))}function S(e){let{cw:t,view:n,section:r,notes:i,zoomFrom:a,zoomMax:o,off:s,margin:c}=e,l=-s,u=r+s,d=(t,i,s)=>E(t,n/2,x(i,r,a,o),e,s.map(e=>[e[0],e[1]+n/2-i,e[2],e[3]+n/2-i])),f=i.map((n,r)=>{let i=e.narrow?r%2==0:t-n[2]>=n[0];if(e.narrow)return t*(i?1-_.edge:_.edge);let a=i?1:-1,o=i?t*(1-_.edge):t*_.edge,s=i?n[2]:n[0],l=e=>Math.min(...[n[1],(n[1]+n[3])/2,n[3]].map(t=>d(e,t,[n])));for(;(i?s<o:s>o)&&l(s)<c;)s+=a*4;return i?Math.min(o,s+t*_.extra):Math.max(o,s-t*_.extra)}),p=(e,n)=>t/2+(e-t/2)*(1-n),m=O(e.seed),h=i.map(e=>(e[1]+e[3])/2),g=i.map((e,t)=>{let n=t?h[t]-h[t-1]:h[t]-l,r=t<i.length-1?h[t+1]-h[t]:u-h[t],a=(m()*2-1)*y;return[p(f[t],v.notes),h[t]+a*(a<0?n:r)]});return g.length||g.push([t/2,r/2]),g.unshift([p(f[0]??t/2,v.ends),l]),g.push([p(f[f.length-1]??t/2,v.ends),u]),w(C(g),g,l,u,(t,n)=>d(t,n,e.avoid))}function C(e){let t=[],n=[];for(let[r,i]of e)t.length&&i<=t[t.length-1]+1||(t.push(i),n.push(r));let r=t.length;if(r<2)return()=>[n[0]??0,0,0];let i=Array(r).fill(0);if(r>2){let e=t.slice(1).map((e,n)=>e-t[n]),a=[],o=[],s=[],c=[];for(let t=1;t<r-1;t++)a.push(e[t-1]),o.push(2*(e[t-1]+e[t])),s.push(e[t]),c.push(6*((n[t+1]-n[t])/e[t]-(n[t]-n[t-1])/e[t-1]));for(let e=1;e<o.length;e++){let t=a[e]/o[e-1];o[e]-=t*s[e-1],c[e]-=t*c[e-1]}for(let e=o.length-1;e>=0;e--)i[e+1]=(c[e]-(e<o.length-1?s[e]*i[e+2]:0))/o[e]}let a=(e,r)=>{let a=t[e+1]-t[e],o=1-r;return[o*n[e]+r*n[e+1]+a*a/6*((o**3-o)*i[e]+(r**3-r)*i[e+1]),(n[e+1]-n[e])/a+a/6*((1-3*o*o)*i[e]+(3*r*r-1)*i[e+1]),o*i[e]+r*i[e+1]]};return e=>{if(e<=t[0]){let[n,r]=a(0,0);return[n+r*(e-t[0]),r,0]}if(e>=t[r-1]){let[n,i]=a(r-2,1);return[n+i*(e-t[r-1]),i,0]}let n=0;for(;n<r-2&&e>t[n+1];)n++;return a(n,(e-t[n])/(t[n+1]-t[n]))}}function w(e,t,n,r,i){let a=new Float32Array(2401),o=new Float32Array(2401),s=new Float32Array(2401),c=new Float32Array(2401),l=new Float32Array(2401);for(let t=0;t<=b;t++){let i=n+t/b*(r-n),[u,d,f]=e(i),p=Math.hypot(d,1);a[t]=u,o[t]=i,s[t]=d/p,c[t]=1/p,l[t]=-f/p**3}let u=1/0,d=[0,0,0];for(let e=0;e<=b;e+=2){let t=i(a[e],o[e]);t<u&&(u=t,d=[+(e/b).toFixed(3),Math.round(a[e]),Math.round(o[e])])}return{xs:a,ys:o,tx:s,ty:c,curv:l,clearance:u,worst:d,points:t,y0:n,y1:r}}function T(e,t){let n=Math.min(1,Math.max(0,t))*(e.xs.length-1),r=Math.min(e.xs.length-2,Math.floor(n)),i=n-r,a=e=>e[r]+(e[r+1]-e[r])*i,o=a(e.tx),s=a(e.ty),c=Math.hypot(o,s)||1;return o/=c,s/=c,{x:a(e.xs),y:a(e.ys),tx:o,ty:s,curv:a(e.curv)}}function E(e,t,n,r,i){let a=r.footprint(e,t,n),o=1/0;for(let n of i)o=Math.min(o,D(e+a.x0,t+a.y0,e+a.x1,t+a.y1,n));return o}function D(e,t,n,r,i){let a=Math.max(0,i[0]-n,e-i[2]),o=Math.max(0,i[1]-r,t-i[3]);return Math.hypot(a,o)}function O(e){let t=Math.floor(e*4294967296)>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var k={ramp:` .:-=+*#%@`,noise:`01<>/\\|[]{}+x`,px:32},A={every:3.4,jitter:.45,max:2,duration:5.2,sweep:.32,fade:.28,minArea:120,reach:.65},j=class{#e;#t=null;#n=0;#r=0;#i=[];#a=null;#o=null;#s=[];#c=0;#l=625341585;uniforms=new Float32Array(8);constructor(e){this.#e=e}get ready(){return!!this.#a&&!!this.#o}async load(e){let t=`/images/flyover/${this.#e}-map`,[n,r]=await Promise.all([fetch(`${t}.json`).then(e=>e.json()),fetch(`${t}.png`).then(e=>e.blob())]),i=await createImageBitmap(r,{colorSpaceConversion:`none`,premultiplyAlpha:`none`}),a=document.createElement(`canvas`);a.width=i.width,a.height=i.height;let o=a.getContext(`2d`,{willReadFrequently:!0});if(!o||e.isContextLost())return!1;o.drawImage(i,0,0);let s=o.getImageData(0,0,i.width,i.height).data;this.#t=new Uint16Array(i.width*i.height);for(let e=0;e<this.#t.length;e++)this.#t[e]=s[e*4]|s[e*4+1]<<8;return this.#n=i.width,this.#r=i.height,this.#i=n.parcels,this.#a=te(e,i,e.NEAREST,e.NEAREST,e.MIRRORED_REPEAT,!1),i.close(),this.#o=te(e,P(),e.LINEAR_MIPMAP_LINEAR,e.LINEAR,e.CLAMP_TO_EDGE,!0),!0}#u(){let e=this.#l=this.#l+1831565813|0;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}#d(e,t,n){let r=e=>{let t=(e%2+2)%2;return t>1?2-t:t},i=r((e-n.origin[0])/n.size[0]),a=r((t-n.origin[1])/n.size[1]),o=this.#t[Math.min(this.#r-1,Math.floor(a*this.#r))*this.#n+Math.min(this.#n-1,Math.floor(i*this.#n))];return o?this.#i[o-1]:null}update(e,t,n,r){if(!this.#t)return!1;if(this.#s=this.#s.filter(t=>e-t.start<A.duration),e>=this.#c){this.#c=e+A.every*(1+(this.#u()*2-1)*A.jitter);for(let i=0;i<6&&this.#s.length<A.max;i++){let i=t[0]+(this.#u()*2-1)*n[0]*A.reach,a=t[1]+(this.#u()*2-1)*n[1]*A.reach,o=this.#d(i,a,r);if(!(!o||o.class===`road`||o.area<A.minArea||this.#s.some(e=>e.parcel.id===o.id))){this.#s.push({parcel:o,start:e});break}}}return this.uniforms.fill(0),this.#s.forEach((t,n)=>{let r=(e-t.start)/A.duration;this.uniforms[n*4]=t.parcel.id,this.uniforms[n*4+1]=Math.min(1.05,r/A.sweep),this.uniforms[n*4+2]=Math.min(1,Math.max(0,(1-r)/A.fade))}),this.#s.length>0}bind(e,t,n){e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,this.#a),e.activeTexture(e.TEXTURE0+n),e.bindTexture(e.TEXTURE_2D,this.#o),e.activeTexture(e.TEXTURE0)}free(e){this.#a&&e.deleteTexture(this.#a),this.#o&&e.deleteTexture(this.#o),this.#a=this.#o=null,this.#s=[]}},M=k.ramp.length+k.noise.length,N=k.ramp.length,ee=k.px;function P(){let e=k.ramp+k.noise,t=k.px,n=document.createElement(`canvas`);n.width=e.length*t,n.height=t;let r=n.getContext(`2d`);r.fillStyle=`#fff`,r.font=`${Math.round(t*.78)}px ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace`,r.textAlign=`center`,r.textBaseline=`middle`;for(let n=0;n<e.length;n++)r.fillText(e[n],n*t+t/2,t/2);return n}function te(e,t,n,r,i,a){let o=e.createTexture();return e.bindTexture(e.TEXTURE_2D,o),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,e.RGBA,e.UNSIGNED_BYTE,t),a&&e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,i),e.bindTexture(e.TEXTURE_2D,null),o}var ne=.06,F=`#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,I=`
const float M_GROUND = 0.0;
const float M_TREE = 1.0;
const float M_ROAD = 2.0;
const float M_WATER = 3.0;
const float M_ROOF = 4.0;
const float M_CONCRETE = 5.0;
const float M_PANEL = 6.0;
const float M_TRACK = 7.0;
const float M_ROCK = 8.0;
const float M_MEADOW = 9.0;
`,L=`
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
}
const mat2 OCT = mat2(1.6, 1.2, -1.2, 1.6);
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * vnoise(p); p = OCT * p; a *= 0.5; }
  return s / 0.96875;
}
float fbm3(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { s += a * vnoise(p); p = OCT * p; a *= 0.5; }
  return s / 0.875;
}
float ridged(vec2 p) {
  float s = 0.0, a = 0.5, w = 1.0;
  for (int i = 0; i < 5; i++) {
    float n = 1.0 - abs(vnoise(p) * 2.0 - 1.0);
    n *= n * w;
    w = clamp(n * 1.6, 0.0, 1.0);
    s += a * n; p = OCT * p; a *= 0.5;
  }
  return s;
}
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
// Cells with straight borders: (distance to the nearest border, the cell's hash, distance to its point), in cell units.
vec3 voronoi(vec2 x) {
  vec2 n = floor(x), f = fract(x);
  vec2 mg = vec2(0.0), mr = vec2(0.0);
  float md = 8.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 r = g + 0.15 + 0.7 * hash22(n + g) - f;
    float d = dot(r, r);
    if (d < md) { md = d; mr = r; mg = g; }
  }
  md = 8.0;
  for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
    vec2 g = mg + vec2(float(i), float(j));
    vec2 r = g + 0.15 + 0.7 * hash22(n + g) - f;
    if (dot(mr - r, mr - r) > 1e-5) md = min(md, dot(0.5 * (mr + r), normalize(r - mr)));
  }
  return vec3(md, hash12(n + mg), length(mr));
}
`,R=`#version 300 es
precision highp float;
precision highp int;
uniform vec2 uOrigin;
uniform vec2 uSize;
uniform float uSeed;
uniform int uWorld;
// The world's half width (units) and the camera's run down it (y from, y to).
uniform float uHalf;
uniform vec2 uRun;
in vec2 vUv;
out vec4 outData;
${L}
${I}

struct Cell { float h; float m; float b; float a; };

vec2 seedOff() { return vec2(17.31, 41.7) * uSeed; }

// A curve running down the world near x0 (a river or road): distance from it, in units.
float curveAt(float y, float x0, float amp, float freq, float ph) {
  return x0 + amp * sin(y * freq + ph) + amp * 0.45 * sin(y * freq * 2.37 + ph * 1.9) + 70.0 * (fbm3(vec2(y * 0.0035, ph)) - 0.5);
}
float distDown(vec2 g, float x0, float amp, float freq, float ph) {
  float c = curveAt(g.y, x0, amp, freq, ph);
  float dc = curveAt(g.y + 2.0, x0, amp, freq, ph) - c;
  return abs(g.x - c) / sqrt(1.0 + dc * dc * 0.25);
}
// One running across the world near y0.
float distAcross(vec2 g, float y0, float amp, float freq, float ph) {
  return distDown(g.yx, y0, amp, freq, ph);
}

float river(vec2 g) {
  if (uWorld == 2) return distDown(g, uHalf * 0.12, 240.0, 0.0024, uSeed * 5.0 + 1.0);
  return distDown(g, -uHalf * 0.42, 210.0, 0.0019, uSeed * 5.0 + 1.0);
}
float riverWidth(vec2 g) { return (uWorld == 2 ? 30.0 : 22.0) + 10.0 * vnoise(vec2(g.y * 0.004, 3.0)); }
float roads(vec2 g, out float centre) {
  float a, b;
  if (uWorld == 2) {
    a = distDown(g, uHalf * 0.12 + 150.0, 230.0, 0.0024, uSeed * 5.0 + 1.0);
    b = 1e4;
  } else {
    a = distDown(g, uHalf * 0.38, 90.0, 0.0011, uSeed * 2.0 + 4.0);
    b = distAcross(g, mix(uRun.x, uRun.y, 0.62), 70.0, 0.0013, uSeed * 3.0 + 2.0);
  }
  float d = min(a, b);
  centre = d;
  return d;
}

// Parcels: warped, stretched cells. x: border distance (units), y: hash.
vec2 parcels(vec2 g) {
  vec2 w = g + 70.0 * (vec2(fbm3(g * 0.0021 + 11.0), fbm3(g * 0.0021 + 23.0)) - 0.5);
  vec2 q = rot(0.32 + uSeed * 0.7) * (w + seedOff()) / vec2(400.0, 250.0);
  vec3 v = voronoi(q);
  return vec2(v.x * 250.0, v.y);
}

float baseHeight(vec2 g) {
  vec2 s = g + seedOff();
  float h;
  if (uWorld == 2) h = 0.08 + 0.5 * ridged(s * 0.0011) + 0.1 * fbm3(s * 0.004);
  else h = 0.1 + 0.26 * fbm3(s * 0.0010) + 0.04 * fbm3(s * 0.006);
  float rd = river(g);
  float valley = uWorld == 2 ? 360.0 : 240.0;
  h = mix(h, (uWorld == 2 ? 0.06 : 0.07), exp(-rd * rd / (valley * valley)) * (uWorld == 2 ? 0.85 : 0.6));
  return h;
}

// Where trees grow (0..1), at a point.
float treeMask(vec2 g) {
  float rd = river(g);
  float rw = riverWidth(g);
  float riparian = (1.0 - smoothstep(rw + 6.0, rw + 26.0, rd)) * step(0.3, vnoise(g * 0.012 + 5.0));
  if (rd < rw - 2.0) return 0.0;
  float centre;
  if (roads(g, centre) < 9.0) return 0.0;
  if (uWorld == 2) {
    vec2 s = g + seedOff();
    float clearing = smoothstep(0.30, 0.34, fbm3(s * 0.0019 + 70.0));
    float rock = baseHeight(g) > 0.42 && vnoise(s * 0.02) > 0.62 ? 0.0 : 1.0;
    return clearing * rock;
  }
  vec2 p = parcels(g);
  float copse = smoothstep(0.7, 0.73, fbm3((g + seedOff()) * 0.0028 + 40.0));
  float hedge = step(0.5, vnoise(g * 0.0055 + 9.0)) * (1.0 - smoothstep(4.0, 8.0, p.x)) * step(0.12, vnoise(g * 0.07));
  float orchard = step(0.9, fract(p.y * 7.13)) * step(14.0, p.x);
  return max(max(copse, hedge), max(riparian, orchard));
}

// The tallest crown over this point on a jittered grid (cell: units): (profile 0..1, hash, centre).
vec4 crowns(vec2 g, float cell, float conifer) {
  vec2 c = floor(g / cell);
  float best = 0.0, id = 0.0;
  vec2 centre = vec2(0.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 k = c + vec2(float(i), float(j));
    vec2 rnd = hash22(k + 3.7);
    vec2 at = (k + 0.5 + (rnd - 0.5) * 0.7) * cell;
    float r = cell * (0.45 + 0.3 * rnd.y);
    float d = length(g - at) / r;
    if (d >= 1.0) continue;
    float tall = 0.65 + 0.35 * rnd.x;
    float p = conifer > 0.5 ? tall * (1.0 - d) * (1.0 - 0.15 * d) : tall * sqrt(1.0 - d * d);
    if (p > best) { best = p; id = hash12(k); centre = at; }
  }
  return vec4(best, id, centre);
}

Cell world(vec2 g) {
  Cell s;
  float base = baseHeight(g);
  s.h = base; s.m = M_GROUND; s.b = 0.0; s.a = 0.0;
  vec2 sg = g + seedOff();
  if (uWorld == 2) {
    s.m = M_MEADOW; s.b = vnoise(sg * 0.01); s.a = vnoise(sg * 0.08);
    if (base > 0.42 && vnoise(sg * 0.02) > 0.62) { s.m = M_ROCK; s.b = vnoise(sg * 0.05); s.a = vnoise(sg * 0.3); }
  } else {
    vec2 p = parcels(g);
    s.b = p.y;
    float t = fract(p.y * 7.13);
    float ang = hash12(vec2(p.y * 91.7, 2.0)) * 3.14159;
    float period = 5.0 + 4.0 * fract(p.y * 13.1);
    s.a = 0.5 + 0.5 * sin(dot(g, vec2(cos(ang), sin(ang))) * 6.28318 / period);
    s.h += 0.003 * s.a;
    // Tracks along some borders.
    if (p.x < 2.6 && vnoise(g * 0.0055 + 9.0) < 0.5) { s.m = M_TRACK; s.b = 0.3; s.a = vnoise(g * 0.2); }
  }
  // Trees.
  float conifer = uWorld == 2 ? step(0.48, vnoise(sg * 0.0032 + 2.0)) : step(0.8, vnoise(sg * 0.004));
  float cell = uWorld == 2 ? (conifer > 0.5 ? 9.0 : 13.0) : 15.0;
  vec4 crown = crowns(g, cell, conifer);
  if (crown.x > 0.0 && treeMask(crown.zw) > 0.5) {
    s.m = M_TREE;
    s.b = crown.y * 0.5 + conifer * 0.5;
    s.a = crown.x;
    s.h = base + crown.x * (uWorld == 2 ? 0.17 : 0.14) + 0.006 * vnoise(g * 0.5);
  }
  // Water.
  float rd = river(g);
  float rw = riverWidth(g);
  if (rd < rw && s.m != M_TREE) { s.m = M_WATER; s.h = base - 0.012; s.b = rd / rw; s.a = vnoise(g * vec2(0.05, 0.012)); }
  else if (rd < rw && crown.x < 0.6) { s.m = M_WATER; s.h = base - 0.012; s.b = rd / rw; s.a = 0.0; }
  // Roads: clear and level, a centre line.
  float centre;
  float rdist = roads(g, centre);
  float half_ = uWorld == 2 ? 5.0 : 6.0;
  if (rdist < half_ + 1.5) {
    bool bridge = rd < rw + 4.0;
    s.m = rdist < half_ ? M_ROAD : M_TRACK;
    s.b = 0.5;
    s.a = uWorld == 2 ? 0.0 : 1.0 - smoothstep(0.3, 0.6, centre);
    s.h = base + (bridge ? 0.02 : 0.0);
  }
  return s;
}

// The test compound (site world): a rotated block of buildings and yard, solar rows beside it, a pad.
void site(vec2 g, inout Cell s) {
  vec2 c0 = vec2(uHalf * 0.05, mix(uRun.x, uRun.y, 0.42));
  vec2 q = rot(0.12) * (g - c0);
  vec2 half_ = vec2(430.0, 300.0);
  float base = baseHeight(c0);
  vec2 e = abs(q) - half_;
  float out_ = max(e.x, e.y);
  if (out_ < 0.0) {
    // Yard.
    s.m = M_CONCRETE; s.h = base; s.b = vnoise(q * 0.02); s.a = vnoise(q * 0.15);
    // Lots: buildings on a grid, lanes between.
    vec2 lot = vec2(150.0, 115.0);
    vec2 li = floor((q + half_) / lot);
    vec2 lf = (q + half_) - (li + 0.5) * lot;
    float hl = hash12(li + 7.0);
    vec2 size = lot * 0.5 - vec2(16.0) - vec2(18.0, 10.0) * hash22(li);
    vec2 be = abs(lf) - size;
    // Fence line.
    if (out_ > -3.0) { s.m = M_TRACK; s.b = 0.8; s.h = base + 0.008; return; }
    // The pad: a ring with a cross, in one lot.
    if (li == vec2(4.0, 1.0)) {
      float r = length(lf);
      if (r < 44.0) { s.m = M_CONCRETE; s.b = 0.95; s.a = (abs(r - 34.0) < 2.5 || (r < 22.0 && min(abs(lf.x), abs(lf.y)) < 2.5)) ? 1.0 : 0.0; s.h = base + 0.004; }
      return;
    }
    if (hl > 0.22 && max(be.x, be.y) < 0.0) {
      s.m = M_ROOF;
      s.b = hash12(li + 1.3);
      float tall = 0.16 + 0.22 * hash12(li + 4.1);
      s.h = base + tall;
      // Parapet, roof lights and plant on top.
      float edge = -max(be.x, be.y);
      s.a = edge < 3.0 ? 0.9 : 0.25 * step(0.5, fract(lf.x / 12.0)) * step(edge, 40.0);
      vec2 vent = fract(lf / 22.0) - 0.5;
      if (edge > 10.0 && hash12(floor(lf / 22.0) + li) > 0.82 && max(abs(vent.x), abs(vent.y)) < 0.28) { s.h += 0.025; s.a = 0.6; }
    }
    return;
  }
  // Solar rows, east of the compound.
  vec2 qs = q - vec2(half_.x + 300.0, 40.0);
  if (abs(qs.x) < 230.0 && abs(qs.y) < 260.0) {
    float row = fract(qs.y / 16.0);
    if (row < 0.62 && abs(qs.x) < 222.0) { s.m = M_PANEL; s.h = baseHeight(c0) + 0.02; s.b = row / 0.62; s.a = step(0.92, fract(qs.x / 18.0)); }
    else { s.m = M_GROUND; s.b = 0.62; s.a = 0.5; s.h = baseHeight(c0); }
    return;
  }
  // An apron and a strip running down from the compound.
  float strip = abs(q.x + 120.0);
  if (strip < 22.0 && q.y > 0.0 && q.y < 1300.0) {
    s.m = M_ROAD; s.h = baseHeight(c0); s.b = 0.3;
    s.a = (strip < 1.2 && fract(q.y / 40.0) < 0.5) ? 1.0 : (strip > 19.5 ? 0.7 : 0.0);
  }
}

void main() {
  vec2 g = uOrigin + vUv * uSize;
  Cell s = world(g);
  if (uWorld == 1) site(g, s);
  outData = vec4(clamp(s.h, 0.0, 1.0), (s.m + 0.5) / 16.0, clamp(s.b, 0.0, 1.0), clamp(s.a, 0.0, 1.0));
}`,re=`#version 300 es
precision highp float;
precision highp int;
uniform sampler2D uData;
uniform vec2 uTexel;     // 1 / texture size
uniform float uUnits;    // world units per texel
uniform float uRelief;   // world units at height 1
uniform vec3 uSun;       // towards the sun (ground x right, y down, z up)
uniform int uWorld;
uniform float uExposure;
in vec2 vUv;
out vec4 outColor;
${L}
${I}

float H(vec2 uv) { return texture(uData, uv).r; }

vec3 albedo(float m, float b, float a, vec2 uv) {
  vec2 g = uv / uTexel;
  if (m == M_TREE) {
    bool conifer = b >= 0.5;
    float k = fract(b * 2.0);
    vec3 c = conifer ? mix(vec3(0.010, 0.020, 0.014), vec3(0.016, 0.028, 0.017), k) : mix(vec3(0.020, 0.034, 0.015), vec3(0.040, 0.046, 0.020), k);
    if (uWorld == 2 && !conifer && k > 0.86) c = vec3(0.060, 0.045, 0.020);
    return c * (0.55 + 0.45 * a);
  }
  if (m == M_WATER) return mix(vec3(0.004, 0.008, 0.010), vec3(0.008, 0.013, 0.015), a);
  if (m == M_ROAD) return mix(vec3(0.040, 0.040, 0.041) * (0.85 + 0.3 * vnoise(g * 0.4)), vec3(0.12, 0.115, 0.1), a);
  if (m == M_TRACK) return mix(vec3(0.075, 0.066, 0.050), vec3(0.11, 0.10, 0.09), b) * (0.85 + 0.3 * a);
  if (m == M_ROOF) {
    vec3 c = mix(vec3(0.030, 0.031, 0.033), vec3(0.075, 0.074, 0.072), b);
    if (b > 0.85) c = vec3(0.036, 0.044, 0.052);
    return mix(c, c * 1.4, a);
  }
  if (m == M_CONCRETE) return a > 0.5 && b > 0.9 ? vec3(0.16, 0.15, 0.135) : vec3(0.046, 0.046, 0.044) * (0.8 + 0.35 * b + 0.15 * a);
  if (m == M_PANEL) return mix(vec3(0.008, 0.012, 0.022), vec3(0.03, 0.04, 0.06), b) + a * 0.06;
  if (m == M_ROCK) return vec3(0.022, 0.026, 0.020) * (0.75 + 0.5 * a);
  if (m == M_MEADOW) return mix(vec3(0.024, 0.034, 0.016), vec3(0.042, 0.044, 0.022), b) * (0.85 + 0.3 * a);
  // Parcels by type: crop, ploughed, stubble, pasture, fallow.
  float t = fract(b * 7.13);
  float n = vnoise(g * 0.05 + b * 50.0);
  vec3 c;
  float stripe;
  if (t < 0.28) { c = vec3(0.028, 0.044, 0.019); stripe = 0.18; }
  else if (t < 0.46) { c = vec3(0.046, 0.034, 0.024); stripe = 0.45; }
  else if (t < 0.6) { c = vec3(0.082, 0.070, 0.045); stripe = 0.22; }
  else if (t < 0.8) { c = vec3(0.034, 0.050, 0.026); stripe = 0.0; }
  else { c = vec3(0.030, 0.034, 0.024); stripe = 0.05; }
  c *= 0.8 + 0.4 * fract(b * 31.7);
  return c * (1.0 - stripe * 0.5 + stripe * a) * (0.82 + 0.36 * n);
}

void main() {
  vec4 d = texture(uData, vUv);
  float h = d.r;
  float m = floor(d.g * 16.0);
  // Normal from the height (world units).
  float hl = H(vUv - vec2(uTexel.x, 0.0)), hr = H(vUv + vec2(uTexel.x, 0.0));
  float hu = H(vUv - vec2(0.0, uTexel.y)), hd = H(vUv + vec2(0.0, uTexel.y));
  vec3 N = normalize(vec3(-(hr - hl) * uRelief / (2.0 * uUnits), -(hd - hu) * uRelief / (2.0 * uUnits), 1.0));
  // Soft sun shadow: march towards the sun through the height.
  vec2 dir = normalize(uSun.xy) * uTexel;
  float rise = uSun.z / length(uSun.xy) * uUnits / uRelief;
  float vis = 1.0;
  float t = 1.5;
  for (int i = 0; i < 28; i++) {
    float ray = h + rise * t;
    if (ray > 1.0) break;
    float th = H(vUv + dir * t);
    vis = min(vis, clamp((ray - th) * uRelief / (0.06 * t * uUnits) + 0.5, 0.0, 1.0));
    t += 1.0 + t * 0.12;
  }
  // Cavity: below the local mean height.
  float h3 = textureLod(uData, vUv, 3.0).r, h5 = textureLod(uData, vUv, 5.0).r;
  float ao = clamp(1.0 - (max(0.0, h3 - h) * 9.0 + max(0.0, h5 - h) * 3.0) * uRelief / 100.0, 0.3, 1.0);
  vec3 a = albedo(m, d.b, d.a, vUv);
  vec3 sunCol = vec3(1.0, 0.96, 0.9) * 2.3;
  vec3 skyCol = vec3(0.62, 0.72, 0.9) * 0.7;
  float ndl = max(dot(N, normalize(uSun)), 0.0);
  vec3 c = a * (sunCol * ndl * vis + skyCol * (0.55 + 0.45 * N.z) * ao);
  if (m == M_WATER) {
    // Sky in the water, darker towards the banks, a few glints.
    c += vec3(0.010, 0.013, 0.017) * (0.6 + 0.4 * d.b) * ao;
    c += vec3(0.05) * smoothstep(0.82, 0.95, vnoise(vUv / uTexel * vec2(0.15, 0.04))) * vis;
  }
  if (m == M_PANEL) c += vec3(0.02, 0.025, 0.035) * smoothstep(0.4, 1.0, d.b);
  // Grade: muted, a little cool in the shade, dark.
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(vec3(l), c, 0.6);
  c *= mix(vec3(0.9, 0.96, 1.1), vec3(1.0), smoothstep(0.0, 0.08, l));
  outColor = vec4(c * uExposure, h);
}`,z=`
uniform vec4 uText[12];
uniform float uTextWeight[12]; // how much of each shows (the scrubbed notes fade)
uniform int uTextCount;
uniform vec2 uScrim;       // strength, reach (CSS px)
uniform float uDim;        // overall (reduced motion: no scrim that follows the text)
uniform float uCanvasTop;  // the canvas's top in the section (CSS px)
uniform float uSection;    // the section's height (CSS px)
uniform float uFade;       // fade length (CSS px)
float scrim(vec2 css) {
  float dark = 0.0;
  for (int i = 0; i < 12; i++) {
    if (i >= uTextCount) break;
    vec4 r = uText[i];
    vec2 c = (r.xy + r.zw) * 0.5, e = (r.zw - r.xy) * 0.5;
    vec2 q = abs(css - c) - e;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    dark = max(dark, uTextWeight[i] * (1.0 - smoothstep(-10.0, uScrim.y, d)));
  }
  return (1.0 - uScrim.x * dark) * uDim;
}
float edges(vec2 css) {
  float y = uCanvasTop + css.y;
  return smoothstep(0.0, uFade, y) * smoothstep(0.0, uFade, uSection - y);
}`,B=`#version 300 es
precision highp float;
uniform sampler2D uWorld;
uniform vec2 uOrigin;      // world region (units)
uniform vec2 uSize;
uniform vec3 uEye;         // camera (x, y, height)
uniform vec2 uTan;         // half-view tangents
uniform vec2 uTilt;        // the camera's tilt back (cos, sin): it looks a little up the page
uniform float uRelief;
uniform int uSteps;
uniform float uLod;        // texture footprint (mip level) at ground
uniform float uDof;        // extra blur for the low ground (mips)
uniform vec3 uSun;
// The drone's shadow, a soft blob: where the drone falls along the sun on the ground plane
// (centre) and its plan's half length and width (units); its heading on the ground; its
// height above the plane (units); strength, softening and fading with the fall (\`SHADOW\`).
uniform vec4 uBlob;
uniform vec2 uBlobDir;
uniform float uBlobAlt;
uniform vec3 uBlobLook;
uniform vec2 uCss;         // canvas size, CSS px
uniform float uTime;
// The ASCII scans (\`./scans.ts\`): the parcel map (ids in red and green, how far down the
// parcel in blue) laid as the photo is, the glyph atlas, each scan's id, sweep and opacity.
uniform sampler2D uScanMap;
uniform sampler2D uGlyphs;
uniform vec2 uScanOrigin;
uniform vec2 uScanSize;
uniform vec4 uScans[2];
uniform float uGlyphLod;
${z}
in vec2 vUv;
out vec4 outColor;
float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec3 toSrgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
void main() {
  vec2 ndc = vUv * 2.0 - 1.0;
  // Ray from the camera: screen up is ground -y; tilted (about x), then scaled to fall 1 per unit.
  vec3 d = vec3(ndc.x * uTan.x, -ndc.y * uTan.y, -1.0);
  d = vec3(d.x, d.y * uTilt.x + d.z * uTilt.y, -d.y * uTilt.y + d.z * uTilt.x);
  d /= -d.z;
  vec3 p0 = uEye + d * (uEye.z - uRelief);
  vec3 p1 = uEye + d * uEye.z;
  vec3 prev = p0, hit = p1;
  float prevDiff = uRelief;
  float n = float(uSteps);
  for (int i = 1; i <= 48; i++) {
    if (i > uSteps) break;
    vec3 p = mix(p0, p1, float(i) / n);
    float th = textureLod(uWorld, (p.xy - uOrigin) / uSize, 0.0).a * uRelief;
    float diff = p.z - th;
    if (diff <= 0.0) {
      hit = mix(prev, p, prevDiff / max(prevDiff - diff, 1e-4));
      break;
    }
    prev = p;
    prevDiff = diff;
  }
  vec2 uv = (hit.xy - uOrigin) / uSize;
  float low = 1.0 - clamp(hit.z / uRelief, 0.0, 1.0);
  vec3 c = textureLod(uWorld, uv, uLod + uDof * low).rgb;
  // The drone's shadow: this point taken along the sun to the ground plane, against a soft
  // ellipse of the drone's plan there; wider and fainter the further it falls (trees under
  // the drone take a crisper one than the low ground).
  if (uBlobLook.x > 0.0) {
    vec2 q = hit.xy - uSun.xy / uSun.z * hit.z - uBlob.xy;
    vec2 l = vec2(dot(q, uBlobDir), dot(q, vec2(-uBlobDir.y, uBlobDir.x)));
    float fall = clamp((uBlobAlt - hit.z) / max(uBlobAlt, 1.0), 0.0, 1.0);
    float soft = 1.0 + uBlobLook.y * fall;
    vec2 e = l / (uBlob.zw * soft);
    float blob = exp(-2.2 * dot(e, e));
    c *= 1.0 - uBlobLook.x * (1.0 - uBlobLook.z * fall) * blob;
  }
  // Haze in the low ground, a lens vignette.
  c = mix(c, vec3(0.006, 0.008, 0.011), low * 0.3);
  float v = length(ndc * vec2(0.8, 1.0));
  c *= 1.0 - 0.45 * smoothstep(0.5, 1.4, v);
  // Never bright enough to cost the text its contrast: luminance softly held under 0.05.
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float k = l > 0.022 ? (0.022 + (l - 0.022) / (1.0 + (l - 0.022) / 0.028)) / l : 1.0;
  c *= k;
  // The scans: cells on the ground, each read from the map at its centre; inside a scan's
  // parcel and above its sweep, a character by the ground's brightness there (just reached,
  // or now and then, a flicker of noise), faint: the text runs over it.
  if (uScans[0].z + uScans[1].z > 0.0) {
    vec2 cell = floor(hit.xy / ${7 .toFixed(1)});
    vec2 centre = (cell + 0.5) * ${7 .toFixed(1)};
    vec4 m = texture(uScanMap, (centre - uScanOrigin) / uScanSize);
    float id = floor(m.r * 255.0 + 0.5) + floor(m.g * 255.0 + 0.5) * 256.0;
    for (int k = 0; k < 2; k++) {
      vec4 scan = uScans[k];
      if (scan.z <= 0.0 || abs(id - scan.x) > 0.5 || m.b > scan.y) continue;
      // Thinning out: each cell drops at its own moment of the fade.
      if (hash(cell * 1.7) > scan.z) continue;
      float lum = dot(textureLod(uWorld, (centre - uOrigin) / uSize, uLod + 1.0).rgb, vec3(0.2126, 0.7152, 0.0722));
      float glyph = floor(clamp(sqrt(lum / 0.03), 0.0, 0.999) * ${N.toFixed(1)});
      if (scan.y - m.b < 0.06 || hash(cell + floor(uTime * 9.0)) < 0.05) glyph = ${N.toFixed(1)} + floor(hash(cell + floor(uTime * 23.0) + 7.0) * ${(M-N).toFixed(1)});
      vec2 f = fract(hit.xy / ${7 .toFixed(1)});
      float ink = textureLod(uGlyphs, vec2((glyph + f.x) / ${M.toFixed(1)}, f.y), uGlyphLod).a;
      c += vec3(0.86, 0.9, 0.93) * ink * ${ne.toFixed(4)};
    }
  }
  vec2 css = vec2(vUv.x, 1.0 - vUv.y) * uCss;
  c *= scrim(css);
  float a = edges(css);
  // Dither against banding in the dark gradients.
  vec3 s = toSrgb(c) + (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;
  outColor = vec4(s * a, a);
}`,V=`#version 300 es
precision highp float;
uniform sampler2D uPhoto;
uniform sampler2D uHeightMap;
uniform vec2 uOrigin;       // the baked region (units)
uniform vec2 uSize;
uniform vec2 uPhotoOrigin;  // the photo's top-left on the ground (units)
uniform vec2 uPhotoSize;    // its extent (units)
uniform float uExposure;
in vec2 vUv;
out vec4 outColor;
void main() {
  // As the generated world: texture v runs with the ground's y (down the page); the photo's
  // rows are uploaded top first, so its north is up the page.
  vec2 p = uOrigin + vUv * uSize;
  vec2 uv = (p - uPhotoOrigin) / uPhotoSize;
  vec3 c = texture(uPhoto, uv).rgb;
  float h = texture(uHeightMap, uv).r;
  outColor = vec4(c * uExposure, h);
}`,ie=`#version 300 es
precision highp float;
uniform sampler2D uTex;
in vec2 vUv;
out vec4 outColor;
void main() { outColor = texture(uTex, vUv); }`,H=`#version 300 es
precision highp float;
uniform sampler2D uSharp;
uniform ivec2 uOrigin;
uniform float uDpr;
uniform float uCanvasH;
${z}
out vec4 outColor;
void main() {
  vec4 c = texelFetch(uSharp, ivec2(gl_FragCoord.xy) - uOrigin, 0);
  vec2 css = vec2(gl_FragCoord.x, uCanvasH - gl_FragCoord.y) / uDpr;
  float a = edges(css);
  outColor = vec4(c.rgb * mix(1.0, scrim(css), 0.5), c.a) * a;
}`,ae={fields:0,site:1,forest:2},oe={margin:3.5},U={from:18*Math.PI/180,to:34*Math.PI/180,drone:{from:24*Math.PI/180,to:66*Math.PI/180}},se={ease:14,back:40,snap:.6},W=34*Math.PI/180,ce=.5,G={wide:1,narrow:.72,breakpoint:768},le={wide:.17,narrow:.03},ue=.1,K={share:.27,narrowShare:.23,min:88,max:510},de={"drone-04":1.45},fe=.62,q=Ne([-.1,-.25,.95]),J={strength:.34,plan:1.05,soften:.9,fade:.45},Y={from:1/1.3,max:2.1,dof:.9},pe=48,X={perCurve:140,max:.4,pitch:-.08},Z={bob:4,drift:3,roll:.025},me={shift:16,ease:2.6},Q={strength:.35,reach:150,pad:16,reducedDim:.8},he=.24,ge={units:1,exposure:1,relief:.25},_e={rows:160,units:1,maxEdge:4096,exposure:.4},ve=1100,ye={active:60,idle:30,idleAfter:5e3,slack:4},$={budget:.6,downAfter:.5,upAfter:3,upShare:.5,warmup:1200,levels:[{ground:1,steps:28,samples:1,scale:1},{ground:.8,steps:22,samples:.7,scale:1},{ground:.65,steps:16,samples:.5,scale:.85},{ground:.5,steps:12,samples:.35,scale:.7}]},be=new Float32Array(8),xe=new URLSearchParams(location.search),Se=xe.has(`flyovertrace`);Se&&(window.__flyoverTrace=[]);var Ce=xe.has(`flyovertime`),we=new WeakMap;async function Te(e,t,n){let r=e.createProgram(),i=[[e.VERTEX_SHADER,t],[e.FRAGMENT_SHADER,n]].map(([t,n])=>{let i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),e.attachShader(r,i),i});e.bindAttribLocation(r,0,`aPosition`),e.linkProgram(r);let a=e.getExtension(`KHR_parallel_shader_compile`);if(a)for(;!e.getProgramParameter(r,a.COMPLETION_STATUS_KHR);)await f();if(!e.getProgramParameter(r,e.LINK_STATUS)){let t=i.map(t=>e.getShaderInfoLog(t)).join(`
`)+e.getProgramInfoLog(r);throw Error(`[flyover] ${t}`)}for(let t of i)e.deleteShader(t);return r}function Ee(e){let t=we.get(e);if(!t){let n=e.gl;t=(async()=>{let[e,t,r,i,a,o]=await Promise.all([Te(n,F,V),Te(n,F,R),Te(n,F,re),Te(n,F,B),Te(n,F,ie),Te(n,F,H)]);return{photo:e,height:t,shade:r,view:i,blit:a,composite:o}})(),t.catch(()=>we.delete(e)),we.set(e,t)}return t}var De=class{#e;#t;#n;#r;#i;#a=null;#o=null;#s=null;#c=0;#l;#u=null;#d=null;#f=null;#p=null;#m=null;#h=null;#g;#_;#v;#y=window.matchMedia(`(prefers-reduced-motion: reduce)`);#b=!1;#x=!1;#S=!1;#C=!0;#w={top:0,section:1,view:1,cw:1,ch:1,canvasTop:0};#T=[];#E=null;#D=null;#O;#k;#A=null;#j=0;#M=U.drone;#N=U;#P;#F=1/0;#I={p:0,x:0,y:0,heading:0,roll:0,pitch:0,zoom:1};#L={x:0,y:0};#R={x:0,y:0};#z=0;#B=0;#V=performance.now();#H=0;#U=performance.now();#W=``;#G=0;#K=0;#q=0;#J=0;#Y=1/0;#X=-1;#Z={ext:null,query:null,ms:-1};#Q=0;constructor(e,n,r,i,a,o=()=>window.scrollY,c){this.#O=o,this.#k=c??null,this.#P=Object.entries(de).find(([e])=>s(r.file).endsWith(`/${e}.glb`))?.[1]??1,this.#e=e,this.#t=n,this.#n=e.closest(`section`)??e;let l=Number(e.dataset.flyoverPitch)||1,u=Number(e.dataset.flyoverTilt)||1;this.#M={from:U.drone.from,to:U.drone.to*l},this.#N={from:U.from*u,to:U.to*u},this.#r=r,this.#i=i,this.#l=a,this.#g=t.add(this.#Oe,{order:90}),this.#_=new IntersectionObserver(([e])=>{this.#b=!!e?.isIntersecting,this.#ae()}),this.#v=new ResizeObserver(()=>{this.#ce(),this.#ue(),this.#C=!0,this.#ae(),window.clearTimeout(this.#Q),this.#Q=window.setTimeout(()=>this.#Ee(),400)})}async load(e){let t=p(e);if(!t)return!1;let[n,r]=await Promise.all([Ee(t),g(t,this.#r)]);if(this.#x||!r||t.gl.isContextLost()||(this.#u=t,this.#d=n,this.#f=r,this.#$(t),this.#Z.ext=t.gl.getExtension(`EXT_disjoint_timer_query_webgl2`),this.#ce(),this.#ue(),await this.#Te(),this.#x)||!await this.#De()||this.#x)return!1;this.#we(t.gl),this.#k?this.#A=this.#k(this.#te):window.addEventListener(`scroll`,this.#te,{passive:!0}),window.addEventListener(`pointermove`,this.#re,{passive:!0});for(let e of[`wheel`,`keydown`,`touchstart`])window.addEventListener(e,this.#ne,{passive:!0});return document.addEventListener(`visibilitychange`,this.#ae),this.#y.addEventListener(`change`,this.#ie),this.#_.observe(this.#e),this.#v.observe(this.#t),this.#v.observe(this.#n),this.#v.observe(document.body),document.fonts?.ready.then(()=>{this.#ue(),this.#ae()}),!0}#$(e){m(e,this);let t=e.canvas;t.width=t.height=1,t.style.cssText=`position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity ${ve}ms cubic-bezier(0.33,1,0.68,1)`,this.#t.append(t),t.addEventListener(`webglcontextlost`,this.#ee),this.#p=t,this.#S=!1,this.#C=!0,this.#W=``}live(){return!this.#x&&this.#e.isConnected}#ee=()=>{this.destroy()};#te=()=>{this.#U=performance.now(),this.#ae()};#ne=()=>{this.#U=performance.now()};#re=e=>{this.#U=performance.now(),e.pointerType!==`touch`&&(this.#L.x=e.clientX/window.innerWidth*2-1,this.#L.y=e.clientY/window.innerHeight*2-1,this.#ae())};#ie=()=>{this.#C=!0,this.#ae()};#ae=()=>{this.#x||!this.#b||document.hidden||!this.#m||this.#g.wake()};#oe(){return this.#w.cw<G.breakpoint?G.narrow:G.wide}#se(){return this.#w.ch/2/this.#oe()/Math.tan(W/2)}#ce(){let e=this.#w,t=this.#n.getBoundingClientRect();this.#j=t.top+window.scrollY,e.section=Math.max(1,t.height),e.view=window.innerHeight,e.cw=Math.max(1,this.#t.clientWidth),e.ch=Math.max(1,this.#t.clientHeight),this.#le()}#le(){let e=this.#w;e.top=this.#j-this.#O(),e.canvasTop=Math.min(Math.max(e.top,0),e.top+e.section-e.ch)}#ue(){let e=this.#n,t=e.getBoundingClientRect(),n=(n,r)=>{let i=Ae(n,e),a=n.getBoundingClientRect();if(r){let e=document.createRange();e.selectNodeContents(n),a=e.getBoundingClientRect(),e.detach()}return[a.left-t.left,i,a.right-t.left,i+n.offsetHeight]},r=e.querySelector(`:scope > .grid-row > [data-flyover-avoid]`);this.#E=r?n(r,!1):null,this.#T=[...e.querySelectorAll(`:scope > ol > li`)].flatMap(e=>{let t=e.querySelector(`[data-flyover-avoid]`),r=[...e.children].find(e=>e!==t&&e instanceof HTMLElement)??null;return t?[{text:n(t,!0),label:r?n(r,!1):null}]:[]}),this.#_e()}#de(){return this.#w.view/2-this.#w.top}#fe(){return this.#w.top-this.#w.canvasTop}#pe(){return this.#w.cw<G.breakpoint?le.narrow:le.wide}#me(e,t,n=1){let r=this.#w,i=this.#pe(),a=i/((1-i)/n+i),o=a*this.#se()*this.#oe();return{dx:-q[0]/q[2]*o-(e-r.cw/2)*a,dy:-q[1]/q[2]*o-(t-r.ch/2)*a}}#he(e,t,n=1){let r=this.#Se()/2*n+Z.drift+2,i=r*.85,a=this.#me(e,t,n);return{x0:Math.min(-r,a.dx-i),x1:Math.max(r,a.dx+i),y0:Math.min(-r,a.dy-i),y1:Math.max(r,a.dy+i)}}#ge(){return[...this.#T.map(e=>e.text),...this.#E?[this.#E]:[]]}#_e(){let e=this.#w;if(!this.#T.length){this.#D=null;return}let t=parseFloat(getComputedStyle(document.documentElement).fontSize)||16,n=oe.margin*t,r=this.#Se()*Y.max,i=S({cw:e.cw,view:e.view,section:e.section,narrow:e.cw<G.breakpoint,notes:this.#T.map(e=>e.text),avoid:this.#ge(),footprint:(e,t,n)=>this.#he(e,t,n),zoomFrom:Y.from,zoomMax:Y.max,margin:n,off:r,seed:this.#l});if(this.#D=i,Ce&&e.cw>=G.breakpoint&&i.clearance<n&&console.warn(`[flyover] route ${i.clearance.toFixed(0)}px from the text at u ${i.worst[0]} (wanted ${n.toFixed(0)})`),Ce){let t=[.1,.3,.5,.7,.9].map(t=>+x(t*e.section,e.section,Y.from,Y.max).toFixed(2));window.__flyoverRoute={clearance:+i.clearance.toFixed(1),worst:i.worst,margin:n,zoom:t,points:i.points.map(e=>e.map(Math.round)),notes:this.#ge().map(e=>e.map(Math.round)),size:this.#Se(),radius:Math.round(1/Math.max(...i.curv.map(Math.abs))),path:Array.from({length:81},(e,t)=>{let n=T(i,t/80);return[Math.round(n.x),Math.round(n.y)]}),cw:e.cw,section:e.section}}}#ve(e){let t=this.#w;return(t.view-e)/(t.section+t.view)}#ye(e){let t=this.#w,n=t.view-e*(t.section+t.view);return{top:n,canvasTop:Math.min(Math.max(n,0),n+t.section-t.ch)}}#be(e,t){return[0,(t-ce*e)/this.#oe()]}#xe(e,t=this.#N){return t.from+(t.to-t.from)*Fe(e)}#Se(){let e=this.#w.cw<G.breakpoint?K.narrowShare:K.share;return Math.min(K.max,Math.max(K.min,this.#w.cw*e))*this.#P}#Ce(){let e=this.#w,t=this.#oe(),n=this.#pe(),r=(1-n)/Y.from+n,i=e.cw/2/t*r,a=e.ch/2/t*r,o=e.section+e.view,s=[0,e.view/o,Math.min(1,(e.view-e.ch+e.section)/o),1].map(e=>{let t=this.#ye(e);return this.#be(t.top,t.canvasTop)[1]}),c=Math.min(...s),l=Math.max(...s),u=80+me.shift,d=W/2,f=this.#se()*r*(Math.tan(d+this.#N.to)-Math.tan(d)),p=Math.cos(d)/Math.cos(d+this.#N.to),m=-i*1.12*p-u,h=c-a*1.12-f-u;return{origin:[m,h],size:[-2*m,l+a*1.12+u-h],run:[c,l]}}#we(e){if(!this.#a||this.#s||this.#y.matches)return;let t=new j(this.#i);this.#s=t;let n=()=>void t.load(e).then(e=>{!e||this.#x||this.#s!==t||this.#ae()}).catch(e=>console.warn(`[flyover] scan map`,e));this.#c=window.requestIdleCallback?window.requestIdleCallback(n,{timeout:3e3}):window.setTimeout(n,500)}async#Te(){let e=this.#u?.gl;if(!e)return;let t=async e=>{let t=await fetch(e);if(!t.ok)throw Error(`${e}: ${t.status}`);return createImageBitmap(await t.blob(),{colorSpaceConversion:`none`,premultiplyAlpha:`none`})};try{let[n,r]=await Promise.all([t(`/images/flyover/${this.#i}.webp`),t(`/images/flyover/${this.#i}-height.webp`)]);if(this.#x||e.isContextLost())return;let i=(t,n,r)=>{let i=e.createTexture();return e.bindTexture(e.TEXTURE_2D,i),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.texImage2D(e.TEXTURE_2D,0,n,r,e.UNSIGNED_BYTE,t),e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.MIRRORED_REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.MIRRORED_REPEAT),e.bindTexture(e.TEXTURE_2D,null),t.close(),i},a=[n.width*ge.units,n.height*ge.units];this.#a={colour:i(n,e.SRGB8_ALPHA8,e.RGBA),height:i(r,e.R8,e.RED),size:a}}catch{this.#a=null}}async#Ee(){if(this.#x||!this.#m)return;this.#ce();let e=this.#Ce(),t=this.#m;e.origin[0]>=t.origin[0]&&e.origin[1]>=t.origin[1]&&e.origin[0]+e.size[0]<=t.origin[0]+t.size[0]&&e.origin[1]+e.size[1]<=t.origin[1]+t.size[1]&&e.size[0]>t.size[0]*.6||(await this.#De(),this.#C=!0,this.#ae())}async#De(){let e=this.#u,t=this.#d;if(!e||!t)return!1;let n=e.gl,r=this.#Ce(),i=Math.min(_e.maxEdge,n.getParameter(n.MAX_TEXTURE_SIZE)),a=Math.max(_e.units,r.size[0]/i,r.size[1]/i),o=Math.ceil(r.size[0]/a),s=Math.ceil(r.size[1]/a),c=[o*a,s*a],l=Math.floor(Math.log2(Math.max(o,s)))+1,u=!!n.getExtension(`EXT_color_buffer_float`),d=ue*this.#se(),p=Oe(n,o,s,u?n.RGBA16F:n.RGBA8,l),m=Oe(n,o,s,n.SRGB8_ALPHA8,l);if(!p||!m){for(let e of[p,m])e&&ke(n,e);return!1}let g=async(e,t,r)=>{for(let i=0;i<s;i+=_e.rows){if(this.#x||n.isContextLost())return!1;n.bindFramebuffer(n.FRAMEBUFFER,t.framebuffer),n.viewport(0,0,o,s),n.enable(n.SCISSOR_TEST),n.scissor(0,i,o,Math.min(_e.rows,s-i)),n.disable(n.BLEND),n.disable(n.DEPTH_TEST),n.useProgram(e),r(),n.drawArrays(n.TRIANGLES,0,3),n.disable(n.SCISSOR_TEST),n.bindFramebuffer(n.FRAMEBUFFER,null),await f()}return!0},_=()=>(ke(n,p),ke(n,m),!1),v=this.#a;if(v){let e=h(n,t.photo);if(!await g(t.photo,m,()=>{n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,v.colour),n.uniform1i(e(`uPhoto`),0),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,v.height),n.uniform1i(e(`uHeightMap`),1),n.activeTexture(n.TEXTURE0),n.uniform2f(e(`uOrigin`),r.origin[0],r.origin[1]),n.uniform2f(e(`uSize`),c[0],c[1]);let t={origin:[-v.size[0]/2,r.origin[1]-this.#l*v.size[1]*.5],size:v.size};this.#o=t,n.uniform2f(e(`uPhotoOrigin`),t.origin[0],t.origin[1]),n.uniform2f(e(`uPhotoSize`),v.size[0],v.size[1]),n.uniform1f(e(`uExposure`),ge.exposure)}))return _()}else{let e=h(n,t.height);if(!await g(t.height,p,()=>{n.uniform2f(e(`uOrigin`),r.origin[0],r.origin[1]),n.uniform2f(e(`uSize`),c[0],c[1]),n.uniform1f(e(`uSeed`),this.#l),n.uniform1i(e(`uWorld`),ae[this.#i]),n.uniform1f(e(`uHalf`),r.size[0]/2),n.uniform2f(e(`uRun`),r.run[0],r.run[1])}))return _();n.bindTexture(n.TEXTURE_2D,p.texture),n.generateMipmap(n.TEXTURE_2D),n.bindTexture(n.TEXTURE_2D,null);let i=h(n,t.shade);if(!await g(t.shade,m,()=>{n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,p.texture),n.uniform1i(i(`uData`),0),n.uniform2f(i(`uTexel`),1/o,1/s),n.uniform1f(i(`uUnits`),a),n.uniform1f(i(`uRelief`),d),n.uniform3f(i(`uSun`),q[0],q[1],q[2]),n.uniform1i(i(`uWorld`),ae[this.#i]),n.uniform1f(i(`uExposure`),_e.exposure)}))return _()}return n.bindTexture(n.TEXTURE_2D,m.texture),n.generateMipmap(n.TEXTURE_2D),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.MIRRORED_REPEAT),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.MIRRORED_REPEAT),n.bindTexture(n.TEXTURE_2D,null),ke(n,p),n.deleteFramebuffer(m.framebuffer),this.#m&&n.deleteTexture(this.#m.texture),this.#m={texture:m.texture,origin:r.origin,size:c,units:a,width:o,height:s},this.#W=``,!0}#Oe=e=>{if(this.#x||!this.#b||document.hidden||!this.#m||!this.#p)return!1;if(this.#u&&this.#u.owner!==this&&this.#$(this.#u),this.#le(),this.#y.matches||!this.#D)return this.#C&&this.#ke(e,0,!0),!1;let t=this.#z?Math.min(.1,(e-this.#z)/1e3):0;this.#z=e;let n=this.#R,r=this.#L,i=1-Math.exp(-me.ease*t);n.x+=(r.x-n.x)*i,n.y+=(r.y-n.y)*i;let a=Math.abs(r.x-n.x)+Math.abs(r.y-n.y)>.001,o=this.#Ae(t)||a,s=this.#Pe(),c=o?0:1e3/(e-this.#U>ye.idleAfter?ye.idle:ye.active);return(this.#C||o||s&&e-this.#H>=c-ye.slack)&&this.#ke(e,c,!1),o||s};#ke(e,t,n){let r=this.#H?e-this.#H:0;this.#H&&(this.#Y=Math.min(this.#Y*1.0005,Math.max(4,r))),this.#C=!1;let i=performance.now(),a=this.#u.gl,o=this.#Z,s=!1;o.ext&&!o.query&&(o.query=a.createQuery(),o.query&&(a.beginQuery(o.ext.TIME_ELAPSED_EXT,o.query),s=!0));try{this.#Fe(e,n)}finally{s&&o.ext&&a.endQuery(o.ext.TIME_ELAPSED_EXT)}let c=performance.now()-i;if(Ce){a.readPixels(0,0,1,1,a.RGBA,a.UNSIGNED_BYTE,new Uint8Array(4));let e=window;(e.__flyoverTimes??=[]).push(performance.now()-i),e.__flyoverInfo={quality:this.#G,cost:+this.#K.toFixed(2),ground:this.#h?[this.#h.width,this.#h.height]:null,canvas:[this.#p.width,this.#p.height],baked:this.#m?[this.#m.width,this.#m.height,+this.#m.units.toFixed(2)]:null}}n||this.#He(e,r,c,t),this.#H=e,this.#S||(this.#S=!0,this.#X=e,requestAnimationFrame(()=>{!this.#x&&this.#p&&(this.#p.style.opacity=`1`)}))}#Ae(e){let t=this.#I,n=this.#w;t.p=this.#ve(n.top);let r=this.#de();!Number.isFinite(this.#je)||Math.abs(r-this.#je)>n.view*se.snap?this.#je=r:this.#je+=(r-this.#je)*(1-Math.exp(-(r<this.#je?se.back:se.ease)*e));let i=Math.abs(r-this.#je)>.2,a=this.#D,o=this.#je,s=(o-a.y0)/(a.y1-a.y0),c=T(a,s);return t.x=c.x,t.y=c.y,t.heading=Math.atan2(-c.tx,-c.ty),t.roll=-Pe(c.curv*X.perCurve,-X.max,X.max),t.pitch=X.pitch,t.zoom=x(o,n.section,Y.from,Y.max),Se&&window.__flyoverTrace.push([performance.now(),t.x,t.y+this.#fe(),t.heading,t.zoom,t.roll,t.p,t.p,s,r-this.#je]),n.top!==this.#Me||i}#je=NaN;#Me=NaN;#Ne(e,t){let n=this.#w,r=this.#I,i=e?0:(t-this.#V)/1e3;if(e){let e=n.cw<G.breakpoint;return{x:n.cw*(e?.8:.88),y:n.ch*(e?.2:.42),heading:2.5,roll:0,pitch:0,bob:0}}let a=r.x,o=r.y+this.#fe(),s=Math.PI*2;return{x:a+Math.sin(i/7.3*s)*Z.drift,y:o+Math.sin(i/5.9*s+1.1)*Z.drift,heading:r.heading,roll:r.roll+Math.sin(i/4.1*s+.6)*Z.roll,pitch:r.pitch+Math.sin(i/3.7*s+2.1)*Z.roll*.7,bob:(Math.sin(i/3.4*s)*.7+Math.sin(i/5.3*s+1.3)*.3)*Z.bob}}#Pe(){if(this.#y.matches)return!0;let e=this.#w,t=this.#I;if(!this.#D)return!1;let n=t.x,r=t.y+this.#fe(),i=this.#Se()*.6*t.zoom,a=e.canvasTop+r;return n+i>0&&n-i<e.cw&&a+i>Math.max(0,e.top)&&a-i<Math.min(e.view,e.top+e.section)&&r+i>0&&r-i<e.ch}#Fe(e,t){let i=this.#u,s=i.gl,c=this.#d,l=this.#f,u=this.#p,d=this.#m,f=this.#w,p=$.levels[this.#G],m=Math.min(Math.max(window.devicePixelRatio||1,1),2)*p.scale,g=Math.max(1,Math.round(f.cw*m)),_=Math.max(1,Math.round(f.ch*m));(u.width!==g||u.height!==_)&&(u.width=g,u.height=_),this.#Me=f.top;let v=this.#oe(),y=this.#se(),b=Math.tan(W/2),x=b*f.cw/f.ch,S=t?this.#ye(f.view/(f.section+f.view)):{top:f.top,canvasTop:f.canvasTop},C=this.#be(S.top,S.canvasTop),w=this.#R,T=this.#pe(),E=t?Y.from:this.#I.zoom,D=y*((1-T)/E+T),O=this.#xe(E),k=[C[0]+(t?0:-w.x*me.shift),C[1]+(t?0:-w.y*me.shift),D],A=this.#Ne(t,e),j=y*(1-T)/E-A.bob,M=[(A.x-f.cw/2)/(f.cw/2)*x*j,-(A.y-f.ch/2)/(f.ch/2)*b*j,-j],N=[0,1,2].map(e=>(l.min[e]+l.max[e])/2),ee=this.#Se()/2/v*(1-T),P=ee/l.reach,te=a(r(M[0],M[1],M[2]),a(n(-this.#xe(E,this.#M)),a(o(A.heading),a(n(Math.PI/2),a(o(A.roll),a(n(A.pitch),a(Me(P),r(-N[0],-N[1],-N[2])))))))),ne=t||this.#Pe(),F=Math.cos(O),I=Math.sin(O),L=[k[0]+M[0],k[1]-M[1]*F+M[2]*I,D+M[1]*I+M[2]*F],R=[L[0]-q[0]/q[2]*L[2],L[1]-q[1]/q[2]*L[2]],re={centre:R,half:[(l.max[2]-l.min[2])/2*P*J.plan,(l.max[0]-l.min[0])/2*P*J.plan],dir:[-Math.sin(A.heading),-Math.cos(A.heading)],alt:L[2],on:ne},z=Math.max(1,Math.round(f.cw*p.ground)),B=Math.max(1,Math.round(f.ch*p.ground)),V=this.#Ie(f),ie=[z,B,k.map(e=>e.toFixed(2)).join(),ne?[...R,...re.dir,...re.half].map(e=>e.toFixed(2)).join():`-`,f.canvasTop.toFixed(1),f.top.toFixed(1),t,d.width].join(`|`);if(ie!==this.#W&&(this.#W=ie,this.#Re(s,c,d,z,B,k,x,b,y,re,V,t,e,E)),s.bindFramebuffer(s.FRAMEBUFFER,null),s.viewport(0,0,g,_),s.disable(s.BLEND),s.disable(s.DEPTH_TEST),s.disable(s.SCISSOR_TEST),s.useProgram(c.blit),s.activeTexture(s.TEXTURE0),s.bindTexture(s.TEXTURE_2D,this.#h.texture),s.uniform1i(h(s,c.blit)(`uTex`),0),s.drawArrays(s.TRIANGLES,0,3),ne&&(this.#ze(s,i,c,l,te,j,ee,A,x,b,m,g,_,V,t,e,E),Ce)){let e=f.cw/2+(R[0]-k[0])*v*(y/D),t=f.ch/2+(R[1]-k[1])*v*(y/D),n=this.#Se()/2*E;this.#Ve(A.x,A.y,n,e,t,n)}s.bindTexture(s.TEXTURE_2D,null),s.enable(s.DEPTH_TEST)}#Ie(e){let t=[],n=this.#fe(),r=e=>[e[0]-Q.pad,e[1]+n-Q.pad,e[2]+Q.pad,e[3]+n+Q.pad];this.#E&&t.push({r:r(this.#E),w:1});for(let e of this.#T)t.push({r:r(e.text),w:1}),e.label&&t.push({r:r(e.label),w:1});let i=t.filter(({r:t})=>t[3]>-Q.reach&&t[1]<e.ch+Q.reach).slice(0,12),a=new Float32Array(48),o=new Float32Array(12);return i.forEach(({r:e,w:t},n)=>{a.set(e,n*4),o[n]=t}),{data:a,weight:o,count:i.length}}#Le(e,t,n,r){let i=h(e,t),a=this.#w;e.uniform4fv(i(`uText`),n.data),e.uniform1fv(i(`uTextWeight`),n.weight),e.uniform1i(i(`uTextCount`),r?0:n.count),e.uniform2f(i(`uScrim`),Q.strength,Q.reach),e.uniform1f(i(`uDim`),r?Q.reducedDim:1),e.uniform1f(i(`uCanvasTop`),a.canvasTop-a.top),e.uniform1f(i(`uSection`),a.section),e.uniform1f(i(`uFade`),Math.min(a.ch*he,a.section*.2))}#Re(e,t,n,r,i,a,o,s,c,l,u,d,f,p){(!this.#h||this.#h.width!==r||this.#h.height!==i)&&(this.#h&&ke(e,this.#h),this.#h=Oe(e,r,i,e.RGBA8,1));let m=this.#h;if(!m)return;let g=this.#w,_=$.levels[this.#G];e.bindFramebuffer(e.FRAMEBUFFER,m.framebuffer),e.viewport(0,0,r,i),e.disable(e.BLEND),e.disable(e.DEPTH_TEST),e.disable(e.SCISSOR_TEST);let v=t.view;e.useProgram(v);let y=h(e,v);e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,n.texture),e.uniform1i(y(`uWorld`),0),e.uniform2f(y(`uOrigin`),n.origin[0],n.origin[1]),e.uniform2f(y(`uSize`),n.size[0],n.size[1]),e.uniform3f(y(`uEye`),a[0],a[1],a[2]),e.uniform2f(y(`uTan`),o,s);let b=this.#xe(p);e.uniform2f(y(`uTilt`),Math.cos(b),Math.sin(b)),e.uniform1f(y(`uRelief`),ue*c*(this.#a?ge.relief:1)),e.uniform1i(y(`uSteps`),_.steps);let x=g.cw/this.#oe()*(a[2]/c)/r/n.units;e.uniform1f(y(`uLod`),Math.log2(Math.max(1,x))+.35),e.uniform1f(y(`uDof`),1.1+Y.dof*Fe(p)),e.uniform3f(y(`uSun`),q[0],q[1],q[2]),e.uniform4f(y(`uBlob`),l.centre[0],l.centre[1],l.half[0],l.half[1]),e.uniform2f(y(`uBlobDir`),l.dir[0],l.dir[1]),e.uniform1f(y(`uBlobAlt`),l.alt),e.uniform3f(y(`uBlobLook`),l.on?J.strength:0,J.soften,J.fade),e.uniform2f(y(`uCss`),g.cw,g.ch),e.uniform1f(y(`uTime`),d?0:(f-this.#V)/1e3%100);let S=this.#s,C=this.#o,w=a[2]*Math.tan(b),T=!d&&!!S?.ready&&!!C&&S.update(f/1e3,[a[0],a[1]-w],[a[2]*o,a[2]*s],C);if(e.uniform4fv(y(`uScans`),T?S.uniforms:be),T){S.bind(e,1,2),e.uniform1i(y(`uScanMap`),1),e.uniform1i(y(`uGlyphs`),2),e.uniform2f(y(`uScanOrigin`),C.origin[0],C.origin[1]),e.uniform2f(y(`uScanSize`),C.size[0],C.size[1]);let t=7*r/(2*a[2]*o);e.uniform1f(y(`uGlyphLod`),Math.max(0,Math.log2(ee/Math.max(1,t))))}if(this.#Le(e,v,u,d),e.drawArrays(e.TRIANGLES,0,3),T){for(let t of[1,2])e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,null);e.activeTexture(e.TEXTURE0)}e.bindTexture(e.TEXTURE_2D,null)}#ze(t,n,r,o,s,f,p,m,g,_,v,y,b,x,S,C,w){let T=$.levels[this.#G],E=this.#Se()*1.25*w,D=Math.ceil(E*v/8)*8,O=Math.max(D,Math.ceil(this.#Se()*1.25*Y.max*v/8)*8),k=Math.floor((m.x-E/2)*v),A=Math.floor((m.y-E/2)*v),j=[k,b-A-D];if(k>=y||A>=b||k+D<=0||A+D<=0)return;let M=Math.max(f*.05,f-p*1.6),N=f+p*1.6,ee=e=>e/y*2-1,P=e=>1-e/b*2,te=ee(k)*g*M,ne=ee(k+D)*g*M,F=P(A)*_*M,I=je(te,ne,P(A+D)*_*M,F,M,N),L=a(I,s),R=S?0:(C-this.#V)/1e3,re=this.#Be?Math.min(1/60,(C-this.#Be)/1e3):1/60;this.#Be=C,this.#B=S?0:(this.#B+56*re)%(Math.PI*2);let z=o.parts.filter(e=>e.rotor),B=S||!z.length?null:u(n,O,O),V=d(n,O,O);if(!V)return;let ie=n.program;t.useProgram(ie),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,o.ao),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,o.ink);let H=h(t,ie);t.uniform1i(H(`uMaskMap`),0),t.uniform1i(H(`uEnvMap`),1);let ae=H(`uUni`),oe=H(`uModel`),U=H(`uMvp`),se=new Map,W=(n,r,i)=>{t.uniformMatrix4fv(oe,!1,r),t.uniformMatrix4fv(U,!1,i);let a=se.get(n.primitive);if(!a){let t=e(this.#r.primitives[n.primitive],R);t[10]*=fe,t[15]=-this.#xe(w,this.#M),a=new Float32Array(t),se.set(n.primitive,a)}t.uniform4fv(ae,a),t.bindVertexArray(n.vao),t.drawElements(t.TRIANGLES,n.count,n.type,0)},ce=o.gimbals.length?i({meshes:[],rotors:[],gimbals:o.gimbals},{}):[],G=o.parts.filter(e=>!e.rotor),le=G.map(e=>e.gimbal===void 0?s:a(s,ce[e.gimbal])),ue=le.map(e=>e===s?L:a(I,e)),K=()=>G.forEach((e,t)=>W(e,le[t],ue[t])),de=(e,t)=>a(s,a(e.matrix,l(e.axis,t)));if(t.bindFramebuffer(t.FRAMEBUFFER,V.msaa),t.viewport(0,0,D,D),t.enable(t.SCISSOR_TEST),t.scissor(0,0,D,D),t.disable(t.BLEND),t.enable(t.DEPTH_TEST),t.depthFunc(t.LESS),t.depthMask(!0),t.colorMask(!0,!0,!0,!0),t.disable(t.CULL_FACE),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),K(),B){let e=(o.rotorRadii[0]??0)*(s[0]**2+s[1]**2+s[2]**2)**.5*D/2/((ne-te)/2/M)/f,r=Math.max(c.min,Math.round(Math.min(pe,Math.ceil(c.arc*e/c.tipGap))*T.samples));t.bindFramebuffer(t.FRAMEBUFFER,B.bodyFramebuffer),t.clear(t.DEPTH_BUFFER_BIT),t.colorMask(!1,!1,!1,!1),K(),t.bindFramebuffer(t.FRAMEBUFFER,B.framebuffer),t.colorMask(!0,!0,!0,!0),t.clear(t.COLOR_BUFFER_BIT),t.blendColor(0,0,0,1/r),t.blendFunc(t.CONSTANT_ALPHA,t.ONE);for(let e=0;e<r;e++){let n=(e/(r-1)-.5)*c.arc,i=z.map(e=>de(e.rotor,(this.#B+n)*e.rotor.dir)),o=i.map(e=>a(I,e));t.bindFramebuffer(t.READ_FRAMEBUFFER,B.bodyFramebuffer),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,B.framebuffer),t.blitFramebuffer(0,0,D,D,0,0,D,D,t.DEPTH_BUFFER_BIT,t.NEAREST),t.bindFramebuffer(t.FRAMEBUFFER,B.framebuffer),t.disable(t.BLEND),t.colorMask(!1,!1,!1,!1),t.depthMask(!0),t.depthFunc(t.LESS),z.forEach((e,t)=>W(e,i[t],o[t])),t.enable(t.BLEND),t.colorMask(!0,!0,!0,!0),t.depthMask(!1),t.depthFunc(t.EQUAL),z.forEach((e,t)=>W(e,i[t],o[t]))}t.depthMask(!0),t.depthFunc(t.LESS),t.bindFramebuffer(t.FRAMEBUFFER,V.msaa),t.viewport(0,0,O,O),t.disable(t.DEPTH_TEST),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.useProgram(n.composite),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,B.color),t.uniform1i(h(t,n.composite)(`uTex`),0),t.drawArrays(t.TRIANGLES,0,3),t.disable(t.BLEND)}else for(let e of z){let t=de(e.rotor,this.#B*e.rotor.dir);W(e,t,a(I,t))}t.bindVertexArray(null),t.disable(t.SCISSOR_TEST),t.bindFramebuffer(t.READ_FRAMEBUFFER,V.msaa),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,V.resolved),t.blitFramebuffer(0,0,D,D,0,0,D,D,t.COLOR_BUFFER_BIT,t.NEAREST),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.FRAMEBUFFER,null),t.disable(t.DEPTH_TEST),t.viewport(j[0],j[1],D,D),t.enable(t.SCISSOR_TEST);let q=Math.max(0,j[0]),J=Math.max(0,j[1]);t.scissor(q,J,Math.max(0,Math.min(y,j[0]+D)-q),Math.max(0,Math.min(b,j[1]+D)-J)),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA);let X=r.composite;t.useProgram(X);let Z=h(t,X);t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,V.color),t.uniform1i(Z(`uSharp`),0),t.uniform2i(Z(`uOrigin`),j[0],j[1]),t.uniform1f(Z(`uDpr`),v),t.uniform1f(Z(`uCanvasH`),b),this.#Le(t,X,x,S),t.drawArrays(t.TRIANGLES,0,3),t.disable(t.BLEND),t.disable(t.SCISSOR_TEST),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,null),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,null)}#Be=0;#Ve(e,t,n,r,i,a){if(!this.#T.length)return;let o=this.#fe(),s=1/0;for(let c of this.#ge()){let l=[c[0],c[1]+o,c[2],c[3]+o];s=Math.min(s,D(e-n,t-n,e+n,t+n,l),D(r-a,i-a,r+a,i+a,l))}this.#F=Math.min(this.#F,s);let c=window;c.__flyoverClear=this.#F,c.__flyoverClearNow=s}#He(e,t,n,r){let i=this.#u?.gl,a=this.#Z;i&&a.ext&&a.query&&i.getQueryParameter(a.query,i.QUERY_RESULT_AVAILABLE)&&(i.getParameter(a.ext.GPU_DISJOINT_EXT)||(a.ms=i.getQueryParameter(a.query,i.QUERY_RESULT)/1e6),i.deleteQuery(a.query),a.query=null);let o=r===0&&t>0&&Number.isFinite(this.#Y)?Math.max(0,t-this.#Y):0,s=a.ext?Math.max(n,a.ms):n+o;s>=0&&(this.#K=this.#K?this.#K+(s-this.#K)*.1:s);let c=this.#X<0||e-this.#X<$.warmup?0:Math.min(.1,t/1e3),l=$.budget*Math.max(r,Number.isFinite(this.#Y)?this.#Y:0,1e3/60);this.#q=this.#K>l&&c?this.#q+c:0,this.#J=this.#K<l*$.upShare&&c?this.#J+c:0,this.#q>$.downAfter&&this.#G<$.levels.length-1?(this.#G++,this.#q=0,this.#K=l):this.#J>$.upAfter&&this.#G>0&&(this.#G--,this.#J=0)}destroy(){if(this.#x)return;this.#x=!0,this.#g.remove(),this.#_.disconnect(),this.#v.disconnect(),window.clearTimeout(this.#Q),window.removeEventListener(`scroll`,this.#te),this.#A?.(),this.#A=null,window.removeEventListener(`pointermove`,this.#re);for(let e of[`wheel`,`keydown`,`touchstart`])window.removeEventListener(e,this.#ne);document.removeEventListener(`visibilitychange`,this.#ae),this.#y.removeEventListener(`change`,this.#ie),window.cancelIdleCallback&&window.cancelIdleCallback(this.#c),window.clearTimeout(this.#c);let e=this.#s;this.#s=null;let t=this.#u;if(t&&!t.gl.isContextLost()){let n=t.gl;if(this.#m&&n.deleteTexture(this.#m.texture),this.#a)for(let e of[this.#a.colour,this.#a.height])n.deleteTexture(e);this.#a=null,e?.free(n),this.#h&&ke(n,this.#h),this.#Z.query&&n.deleteQuery(this.#Z.query)}this.#m=this.#h=null,this.#p?.removeEventListener(`webglcontextlost`,this.#ee),t?.owner===this&&(t.owner=null,t.canvas.remove()),this.#p=null}};function Oe(e,t,n,r,i){let a=e.createTexture();e.bindTexture(e.TEXTURE_2D,a),e.texStorage2D(e.TEXTURE_2D,i,r,t,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,i>1?e.LINEAR_MIPMAP_LINEAR:e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);let o=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,o),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0);let s=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),!s||!a||!o?(e.deleteTexture(a),e.deleteFramebuffer(o),null):{texture:a,framebuffer:o,width:t,height:n}}function ke(e,t){e.deleteTexture(t.texture),e.deleteFramebuffer(t.framebuffer)}function Ae(e,t){let n=0,r=e;for(;r&&r!==t;)n+=r.offsetTop,r=r.offsetParent;return r===t?n:e.getBoundingClientRect().top-t.getBoundingClientRect().top}function je(e,t,n,r,i,a){let o=new Float32Array(16);return o[0]=2*i/(t-e),o[5]=2*i/(r-n),o[8]=(t+e)/(t-e),o[9]=(r+n)/(r-n),o[10]=-(a+i)/(a-i),o[11]=-1,o[14]=-2*a*i/(a-i),o}function Me(e){let t=new Float32Array(16);return t[0]=t[5]=t[10]=e,t[15]=1,t}function Ne(e){let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]}function Pe(e,t,n){return Math.min(n,Math.max(t,e))}function Fe(e){return Pe((e-Y.from)/(Y.max-Y.from),0,1)}export{De as Flyover};