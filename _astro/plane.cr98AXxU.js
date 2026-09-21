var e=`fn unpackColor(v: f32) -> vec3f {
let r = floor(v / 65536.0);
let g = floor((v - r * 65536.0) / 256.0);
let b = v - r * 65536.0 - g * 256.0;
return vec3f(r, g, b) / 255.0;
}
fn fsMain() -> vec4f {
let bg = unpackColor(uUni.values0.x);
let planeAspect = max(uUni.values0.y, 0.0001);
let texAspect = max(uUni.values0.z, 0.0001);
let cover = uUni.values2.x;
let pos = vec2f(uUni.values2.y, uUni.values2.z);
let zoom = max(uUni.values2.w, 0.0001);
let r = texAspect / planeAspect;
let wide = step(1.0, r);
let containSize = mix(vec2f(r, 1.0), vec2f(1.0, 1.0 / r), wide);
let coverSize = mix(vec2f(1.0, 1.0 / r), vec2f(r, 1.0), wide);
let size = mix(containSize, coverSize, cover) * zoom;
let offset = (vec2f(1.0, 1.0) - size) * pos;
let uv = (vUv - offset) / size;
let inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
let tex = textureSample(uTexture, uSampler, clamp(uv, vec2f(0.0, 0.0), vec2f(1.0, 1.0)));
let a = tex.a * inside * clamp(uUni.values3.z, 0.0, 1.0);
let page = unpackColor(uUni.values3.y);
let exit = max(uUni.values3.w, 0.0);
let flashSteps = floor(exit * 0.5);
let wipe = clamp(exit - flashSteps * 2.0, 0.0, 1.0);
let flash = flashSteps / 100.0;
let shown = step(vUv.y, 1.0 - wipe) * (1.0 - step(1.0, wipe));
let color = min(mix(bg, tex.rgb, a) * (1.0 + flash), vec3f(1.0, 1.0, 1.0));
return vec4f(mix(page, color, clamp(uUni.values3.x, 0.0, 1.0) * shown), 1.0);
}`,t=`#version 300 es
precision highp float;
in vec2 vUv;
uniform vec4 uUni[4];
uniform sampler2D uTexture;
out vec4 outColor;
vec2 fitUv(vec2 uv) {
return uv * uUni[1].xy + uUni[1].zw;
}
vec3 unpackColor(float v) {
float r = floor(v / 65536.0);
float g = floor((v - r * 65536.0) / 256.0);
float b = v - r * 65536.0 - g * 256.0;
return vec3(r, g, b) / 255.0;
}
void main() {
vec3 bg = unpackColor(uUni[0].x);
float planeAspect = max(uUni[0].y, 0.0001);
float texAspect = max(uUni[0].z, 0.0001);
float cover = uUni[2].x;
vec2 pos = vec2(uUni[2].y, uUni[2].z);
float zoom = max(uUni[2].w, 0.0001);
float r = texAspect / planeAspect;
float wide = step(1.0, r);
vec2 containSize = mix(vec2(r, 1.0), vec2(1.0, 1.0 / r), wide);
vec2 coverSize = mix(vec2(1.0, 1.0 / r), vec2(r, 1.0), wide);
vec2 size = mix(containSize, coverSize, cover) * zoom;
vec2 offset = (vec2(1.0, 1.0) - size) * pos;
vec2 uv = (vUv - offset) / size;
float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
vec4 tex = texture(uTexture, clamp(uv, vec2(0.0, 0.0), vec2(1.0, 1.0)));
float a = tex.a * inside * clamp(uUni[3].z, 0.0, 1.0);
vec3 page = unpackColor(uUni[3].y);
float exit = max(uUni[3].w, 0.0);
float flashSteps = floor(exit * 0.5);
float wipe = clamp(exit - flashSteps * 2.0, 0.0, 1.0);
float flash = flashSteps / 100.0;
float shown = step(vUv.y, 1.0 - wipe) * (1.0 - step(1.0, wipe));
vec4 color = min(mix(bg, tex.rgb, a) * (1.0 + flash), vec3(1.0, 1.0, 1.0));
outColor = vec4(mix(page, color, clamp(uUni[3].x, 0.0, 1.0) * shown), 1.0);
return;
}`,n={fragment:e,fragmentGlsl:t};export{n as default,e as fragment,t as fragmentGlsl};