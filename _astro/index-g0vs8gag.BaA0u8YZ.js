function e(e){return/^\s*#version\s+300\s+es/.test(e)}function t(e){return/\buTexture\b/.test(e)}function n(e){return e?`fn fsMain() -> vec4f {
  return vec4f(vUv, max(0.0, uUni.values0.x), 1.0);
}
`:`fn fsMain() -> vec4f {
  let c = max(0.0, uUni.values0.x);
  return vec4f(c, c, c, 1.0);
}
`}function r(e){return e?`fn fsMain() -> vec4f {
  return vec4f(vUv, 0.5 + 0.5 * uUni.values0.x, 1.0);
}
`:n(!1)}function i(){return`fn hash21(p: vec2f) -> f32 {
  let q = vec2f(dot(p, vec2f(127.1, 311.7)), dot(p, vec2f(269.5, 183.3)));
  return fract(sin(q.x + q.y) * 43758.5453);
}

fn valueNoise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash21(i + vec2f(0.0, 0.0));
  let b = hash21(i + vec2f(1.0, 0.0));
  let c = hash21(i + vec2f(0.0, 1.0));
  let d = hash21(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fsMain() -> vec4f {
  let time = uUni.values0.w;
  let uv = fitUv(vUv);
  let noiseUv = uv * 9.0 + vec2f(time * 0.35, time * 0.22);
  let n = valueNoise(noiseUv);
  let offset = (n - 0.5) * 0.035;
  let distortedUv = uv + vec2f(offset, -offset * 0.65);
  return textureSample(uTexture, uSampler, distortedUv);
}
`}function a(e,t={}){let n=e.replace(/\r/g,``).replace(/@fragment\s+/g,``);return`struct Uni {
  values0: vec4f,
  values1: vec4f,
  values2: vec4f,
  values3: vec4f,
}

@group(0) @binding(0) var<uniform> uUni: Uni;

struct VsOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vsMain(@location(0) aPosition: vec2f, @location(1) aUv: vec2f) -> VsOut {
  var out: VsOut;
  out.position = vec4f(aPosition, 0.0, 1.0);
  out.uv = aUv;
  return out;
}

var<private> vUv: vec2f;
${t.hasTexture?`@group(0) @binding(1) var uSampler: sampler;
@group(0) @binding(2) var uTexture: texture_2d<f32>;

fn fitUv(uv: vec2f) -> vec2f {
  return uv * uUni.values1.xy + uUni.values1.zw;
}
`:``}${n}

@fragment
fn fsEntry(in: VsOut) -> @location(0) vec4f {
  vUv = in.uv;
  return fsMain();
}
`}function o(o){let s=o.fragment?.trim()??``;s&&e(s)&&console.warn(`shooosh: GLSL #version 300 es is a WebGL2 escape hatch and is ignored on WebGPU. Using the default WGSL fragment.`);let c=s&&!e(s)?s:o.hasTexture?i():o.kind===`item`?r(!!o.debugUv):n(!!o.debugUv),l=!!o.hasTexture&&t(c);return{code:a(c,{hasTexture:l}),usesTexture:l}}export{e as n,o as t};