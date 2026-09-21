var e=`fn ggx(NdotH: f32, roughness: f32) -> f32 {
let a = max(roughness * roughness, 0.002);
let a2 = a * a;
let d = NdotH * NdotH * (a2 - 1.0) + 1.0;
return a2 / (3.14159265 * d * d + 0.0001);
}
fn smithG(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
let r = roughness + 1.0;
let k = (r * r) / 8.0;
let gv = NdotV / (NdotV * (1.0 - k) + k + 0.0001);
let gL = NdotL / (NdotL * (1.0 - k) + k + 0.0001);
return gv * gL;
}
fn schlick(cosTheta: f32, F0: vec3f) -> vec3f {
return F0 + (vec3f(1.0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}
fn studioLight(N: vec3f, V: vec3f, L: vec3f, color: vec3f, power: f32, albedo: vec3f, metallic: f32, roughness: f32, F0: vec3f) -> vec3f {
let H: vec3f = normalize(V + L);
let NdotL = max(dot(N, L), 0.0);
let NdotV = max(dot(N, V), 0.001);
let NdotH = max(dot(N, H), 0.0);
let F: vec3f = schlick(max(dot(H, V), 0.0), F0);
let spec: vec3f = (ggx(NdotH, roughness) * smithG(NdotV, NdotL, roughness) * F) / (4.0 * NdotV * NdotL + 0.0001);
let kD: vec3f = (vec3f(1.0) - F) * (1.0 - metallic);
return (kD * albedo / 3.14159265 + spec) * color * power * NdotL;
}
fn envBRDF(F0: vec3f, roughness: f32, NdotV: f32) -> vec3f {
let rx = 1.0 - roughness;
let ry = 0.0425 - 0.0275 * roughness;
let rz = 1.04 - 0.572 * roughness;
let rw = 0.022 * roughness - 0.04;
let a004 = min(rx * rx, exp2(-9.28 * NdotV)) * rx + ry;
let A = -1.04 * a004 + rz;
let B = 1.04 * a004 + rw;
return F0 * A + vec3f(B);
}
fn softbox(R: vec3f, c: vec3f, u0: vec3f, ha: f32, hb: f32, blur: f32) -> f32 {
let u: vec3f = normalize(u0 - c * dot(u0, c));
let v: vec3f = cross(c, u);
let d = dot(R, c);
let dd = max(d, 0.08);
let a = abs(dot(R, u)) / dd;
let b = abs(dot(R, v)) / dd;
let wa = 1.0 - smoothstep(ha - blur, ha + blur, a);
let wb = 1.0 - smoothstep(hb - blur, hb + blur, b);
return wa * wb * smoothstep(-0.05, 0.25, d);
}
fn studioEnv(R: vec3f, roughness: f32) -> vec3f {
let alpha = roughness * roughness;
let blur = 0.015 + alpha * 1.25;
let gw = 0.12 + alpha * 0.6;
let ground: vec3f = mix(vec3f(0.17, 0.17, 0.175), vec3f(0.33, 0.33, 0.34), smoothstep(-0.35 - gw, 0.05 + gw, R.y));
var env: vec3f = mix(ground, vec3f(0.5, 0.5, 0.52), smoothstep(0.1 - gw, 0.95 + gw * 0.5, R.y));
env += vec3f(1.0, 0.975, 0.94) * 8.5 * softbox(R, normalize(vec3f(-0.45, 0.75, 0.5)), vec3f(1.0, 0.0, 0.0), 0.5, 0.34, blur);
env += vec3f(1.0) * 3.2 * softbox(R, normalize(vec3f(0.1, 1.0, -0.15)), vec3f(1.0, 0.0, 0.0), 0.95, 0.12, blur);
env += vec3f(0.86, 0.92, 1.0) * 2.2 * softbox(R, normalize(vec3f(0.88, 0.12, 0.45)), vec3f(0.0, 1.0, 0.0), 0.75, 0.2, blur);
env += vec3f(0.9, 0.94, 1.0) * 4.0 * softbox(R, normalize(vec3f(0.62, 0.38, -0.69)), vec3f(0.0, 1.0, 0.0), 0.8, 0.1, blur);
env += vec3f(0.92, 0.95, 1.0) * 2.6 * softbox(R, normalize(vec3f(-0.72, 0.3, -0.62)), vec3f(0.0, 1.0, 0.0), 0.8, 0.1, blur);
return env;
}
fn boxLight(N: vec3f, c: vec3f, power: f32, wrap: f32) -> f32 {
return power * clamp((dot(N, c) + wrap) / (1.0 + wrap), 0.0, 1.0) / (1.0 + wrap);
}
fn studioAmbient(N: vec3f) -> vec3f {
let up = clamp(N.y * 0.5 + 0.5, 0.0, 1.0);
var e: vec3f = mix(vec3f(0.11, 0.11, 0.115), vec3f(0.34, 0.34, 0.355), up * up * (3.0 - 2.0 * up));
e += vec3f(1.0) * boxLight(N, normalize(vec3f(0.1, 1.0, -0.15)), 0.17, 0.2);
e += vec3f(0.86, 0.92, 1.0) * boxLight(N, normalize(vec3f(0.88, 0.12, 0.45)), 0.2, 0.3);
e += vec3f(0.9, 0.94, 1.0) * boxLight(N, normalize(vec3f(0.62, 0.38, -0.69)), 0.12, 0.15);
e += vec3f(0.92, 0.95, 1.0) * boxLight(N, normalize(vec3f(-0.72, 0.3, -0.62)), 0.08, 0.15);
return e;
}
fn tiltStudio(v: vec3f, a: f32) -> vec3f {
let c = cos(a);
let s = sin(a);
return vec3f(v.x, v.y * c - v.z * s, v.y * s + v.z * c);
}
fn studioKey(N: vec3f) -> vec3f {
return vec3f(1.0, 0.975, 0.94) * boxLight(N, normalize(vec3f(-0.45, 0.75, 0.5)), 1.05, 0.12);
}
fn hash21(p: vec2f) -> f32 {
return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}
fn noise2(p: vec2f) -> f32 {
let i = floor(p);
let f = fract(p);
let s = f * f * (vec2f(3.0) - 2.0 * f);
let a = hash21(i);
let b = hash21(i + vec2f(1.0, 0.0));
let c = hash21(i + vec2f(0.0, 1.0));
let d = hash21(i + vec2f(1.0, 1.0));
return mix(mix(a, b, s.x), mix(c, d, s.x), s.y);
}
fn pbrNeutral(c: vec3f) -> vec3f {
let x = min(c.x, min(c.y, c.z));
let offset = mix(x - 6.25 * x * x, 0.04, step(0.08, x));
let col: vec3f = c - vec3f(offset);
let peak = max(col.x, max(col.y, col.z));
let start = 0.76;
let d = 1.0 - start;
let newPeak = 1.0 - d * d / (peak + d - start);
let scaled: vec3f = col * (newPeak / max(peak, 0.0001));
let g = 1.0 - 1.0 / (0.15 * (peak - newPeak) + 1.0);
let compressed: vec3f = mix(scaled, vec3f(newPeak), g);
return mix(col, compressed, step(start, peak));
}
fn fsMain() -> vec4f {
let metallic = clamp(uUni.values0.y, 0.0, 1.0);
let roughness0 = clamp(uUni.values0.z, 0.05, 1.0);
let decalOn = clamp(uUni.values1.w, 0.0, 1.0);
let aoStrength = clamp(uUni.values2.x, 0.0, 1.0);
let lensFlag = uUni.values2.y;
let exposure = uUni.values2.z;
let coat0 = clamp(uUni.values2.w, 0.0, 1.0);
let coatRough = clamp(uUni.values3.x, 0.05, 1.0);
let f0d = uUni.values3.y;
let detail = clamp(uUni.values3.z, 0.0, 1.0);
let packedRaw = uUni.values3.w;
let packedWorld = max(packedRaw, 0.0);
let worldR = floor(packedWorld / 65536.0);
let worldG = floor((packedWorld - worldR * 65536.0) / 256.0);
let worldB = packedWorld - worldR * 65536.0 - worldG * 256.0;
let worldSrgb = vec3f(worldR, worldG, worldB) / 255.0;
let worldFull: vec3f = pow(worldSrgb, vec3f(2.2));
let world: vec3f = mix(vec3f(dot(worldFull, vec3f(0.2126, 0.7152, 0.0722))), worldFull, 0.5);
let hasWorld = step(0.5, packedWorld);
let studioTilt = min(packedRaw, 0.0);
let aoBaked = textureSample(uMaskMap, uSampler, vUv).r;
let inkBaked = textureSample(uEnvMap, uSampler, vUv).r;
let ink = inkBaked * decalOn;
let inkSolid = smoothstep(0.35, 0.8, ink);
let drift = noise2(vUv * 36.0) * 0.6 + noise2(vUv * 90.0 + vec2f(17.0, 3.0)) * 0.4 - 0.5;
let paint: vec3f = vec3f(uUni.values1.x, uUni.values1.y, uUni.values1.z);
let albedo: vec3f = mix(paint, paint * 0.28, ink);
let roughness = clamp(roughness0 + drift * detail * 0.08 * (1.0 - ink) + inkSolid * 0.15, 0.05, 1.0);
let coat = coat0 * (1.0 - inkSolid * 0.7);
let V: vec3f = vec3f(0.0, 0.0, 1.0);
let G0: vec3f = normalize(vNormal);
let facing = step(0.0, dot(G0, V)) * 2.0 - 1.0;
let Ng: vec3f = normalize(G0 * facing + V * max(0.0, 0.08 - dot(G0 * facing, V)));
let N: vec3f = Ng;
let NdotV = max(dot(N, V), 0.001);
let R: vec3f = reflect(-V, N);
let occ = mix(1.0, pow(aoBaked, 1.3), aoStrength);
let keyOcc = mix(1.0, occ, 0.8);
let occS = mix(occ, 1.0, 0.4);
let specOcc = clamp(pow(NdotV + occS, exp2(-16.0 * roughness - 1.0)) - 1.0 + occS, 0.0, 1.0);
let F0: vec3f = mix(vec3f(f0d), albedo, metallic);
let brdf: vec3f = envBRDF(F0, roughness, NdotV);
let ab: vec3f = envBRDF(vec3f(1.0), roughness, NdotV);
let ms: vec3f = vec3f(1.0) + F0 * (1.0 / max(ab.x, 0.2) - 1.0);
let downR = smoothstep(0.15, -0.6, R.y) * hasWorld;
let envBase = studioEnv(tiltStudio(R, studioTilt), roughness);
let worldEnv: vec3f = mix(envBase, world * 1.6, downR * 0.55 * (1.0 - 0.5 * metallic));
let specular: vec3f = worldEnv * brdf * ms * specOcc;
let kD: vec3f = (vec3f(1.0) - brdf) * (1.0 - metallic);
let downN = clamp(-N.y * 0.5 + 0.5, 0.0, 1.0);
let bounce: vec3f = world * 0.55 * downN * downN * hasWorld;
let diffuse: vec3f = kD * albedo * ((studioAmbient(tiltStudio(N, studioTilt)) + bounce) * occ + studioKey(tiltStudio(N, studioTilt)) * keyOcc);
var color: vec3f = diffuse + specular;
let NgV = max(dot(Ng, V), 0.001);
let Fc = (0.04 + 0.96 * pow(1.0 - NgV, 5.0)) * coat;
let Rc: vec3f = reflect(-V, Ng);
let coatSpec: vec3f = studioEnv(tiltStudio(Rc, studioTilt), coatRough) * envBRDF(vec3f(0.04), coatRough, NgV) * coat * clamp(pow(NgV + occS, exp2(-16.0 * coatRough - 1.0)) - 1.0 + occS, 0.0, 1.0);
color = color * (1.0 - Fc) + coatSpec;
let lensOn = step(0.5, lensFlag);
let G: vec3f = Ng;
let NdotVl = max(dot(G, V), 0.001);
let Rl: vec3f = reflect(-V, G);
let lensFres = 0.04 + 0.96 * pow(1.0 - NdotVl, 5.0);
let coatTint: vec3f = mix(vec3f(1.0), vec3f(0.9, 0.86, 1.0), smoothstep(0.1, 0.6, lensFres));
var lens = vec3f(0.005);
lens += studioEnv(tiltStudio(Rl, studioTilt), 0.06) * 0.5 * coatTint * lensFres;
let key: vec3f = normalize(vec3f(-0.45, 0.75, 0.5));
let fill: vec3f = normalize(vec3f(0.85, 0.1, 0.5));
lens += studioLight(G, V, key, vec3f(1.0), 6.0, vec3f(0.0), 0.0, 0.05, vec3f(0.04));
lens += studioLight(G, V, key, vec3f(1.0), 0.5, vec3f(0.0), 0.0, 0.25, vec3f(0.04));
lens += studioLight(G, V, fill, vec3f(0.85, 0.92, 1.0), 2.0, vec3f(0.0), 0.0, 0.05, vec3f(0.04));
color = mix(color, lens, lensOn);
color = pbrNeutral(color * exposure);
color = pow(max(color, vec3f(0.0)), vec3f(0.45454545));
let shown = min(color, vec3f(1.0));
return vec4f(shown, 1.0);
}`,t=`#version 300 es
precision highp float;
in vec2 vUv;
in vec3 vNormal;
uniform vec4 uUni[4];
uniform sampler2D uEnvMap;
uniform sampler2D uMaskMap;
out vec4 outColor;
float ggx(float NdotH, float roughness) {
float a = max(roughness * roughness, 0.002);
float a2 = a * a;
float d = NdotH * NdotH * (a2 - 1.0) + 1.0;
return a2 / (3.14159265 * d * d + 0.0001);
}
float smithG(float NdotV, float NdotL, float roughness) {
float r = roughness + 1.0;
float k = (r * r) / 8.0;
float gv = NdotV / (NdotV * (1.0 - k) + k + 0.0001);
float gL = NdotL / (NdotL * (1.0 - k) + k + 0.0001);
return gv * gL;
}
vec3 schlick(float cosTheta, vec3 F0) {
return F0 + (vec3(1.0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}
vec3 studioLight(vec3 N, vec3 V, vec3 L, vec3 color, float power, vec3 albedo, float metallic, float roughness, vec3 F0) {
vec3 H = normalize(V + L);
float NdotL = max(dot(N, L), 0.0);
float NdotV = max(dot(N, V), 0.001);
float NdotH = max(dot(N, H), 0.0);
vec3 F = schlick(max(dot(H, V), 0.0), F0);
vec3 spec = (ggx(NdotH, roughness) * smithG(NdotV, NdotL, roughness) * F) / (4.0 * NdotV * NdotL + 0.0001);
vec3 kD = (vec3(1.0) - F) * (1.0 - metallic);
return (kD * albedo / 3.14159265 + spec) * color * power * NdotL;
}
vec3 envBRDF(vec3 F0, float roughness, float NdotV) {
float rx = 1.0 - roughness;
float ry = 0.0425 - 0.0275 * roughness;
float rz = 1.04 - 0.572 * roughness;
float rw = 0.022 * roughness - 0.04;
float a004 = min(rx * rx, exp2(-9.28 * NdotV)) * rx + ry;
float A = -1.04 * a004 + rz;
float B = 1.04 * a004 + rw;
return F0 * A + vec3(B);
}
float softbox(vec3 R, vec3 c, vec3 u0, float ha, float hb, float blur) {
vec3 u = normalize(u0 - c * dot(u0, c));
vec3 v = cross(c, u);
float d = dot(R, c);
float dd = max(d, 0.08);
float a = abs(dot(R, u)) / dd;
float b = abs(dot(R, v)) / dd;
float wa = 1.0 - smoothstep(ha - blur, ha + blur, a);
float wb = 1.0 - smoothstep(hb - blur, hb + blur, b);
return wa * wb * smoothstep(-0.05, 0.25, d);
}
vec3 studioEnv(vec3 R, float roughness) {
float alpha = roughness * roughness;
float blur = 0.015 + alpha * 1.25;
float gw = 0.12 + alpha * 0.6;
vec3 ground = mix(vec3(0.17, 0.17, 0.175), vec3(0.33, 0.33, 0.34), smoothstep(-0.35 - gw, 0.05 + gw, R.y));
vec3 env = mix(ground, vec3(0.5, 0.5, 0.52), smoothstep(0.1 - gw, 0.95 + gw * 0.5, R.y));
env += vec3(1.0, 0.975, 0.94) * 8.5 * softbox(R, normalize(vec3(-0.45, 0.75, 0.5)), vec3(1.0, 0.0, 0.0), 0.5, 0.34, blur);
env += vec3(1.0) * 3.2 * softbox(R, normalize(vec3(0.1, 1.0, -0.15)), vec3(1.0, 0.0, 0.0), 0.95, 0.12, blur);
env += vec3(0.86, 0.92, 1.0) * 2.2 * softbox(R, normalize(vec3(0.88, 0.12, 0.45)), vec3(0.0, 1.0, 0.0), 0.75, 0.2, blur);
env += vec3(0.9, 0.94, 1.0) * 4.0 * softbox(R, normalize(vec3(0.62, 0.38, -0.69)), vec3(0.0, 1.0, 0.0), 0.8, 0.1, blur);
env += vec3(0.92, 0.95, 1.0) * 2.6 * softbox(R, normalize(vec3(-0.72, 0.3, -0.62)), vec3(0.0, 1.0, 0.0), 0.8, 0.1, blur);
return env;
}
float boxLight(vec3 N, vec3 c, float power, float wrap) {
return power * clamp((dot(N, c) + wrap) / (1.0 + wrap), 0.0, 1.0) / (1.0 + wrap);
}
vec3 studioAmbient(vec3 N) {
float up = clamp(N.y * 0.5 + 0.5, 0.0, 1.0);
vec3 e = mix(vec3(0.11, 0.11, 0.115), vec3(0.34, 0.34, 0.355), up * up * (3.0 - 2.0 * up));
e += vec3(1.0) * boxLight(N, normalize(vec3(0.1, 1.0, -0.15)), 0.17, 0.2);
e += vec3(0.86, 0.92, 1.0) * boxLight(N, normalize(vec3(0.88, 0.12, 0.45)), 0.2, 0.3);
e += vec3(0.9, 0.94, 1.0) * boxLight(N, normalize(vec3(0.62, 0.38, -0.69)), 0.12, 0.15);
e += vec3(0.92, 0.95, 1.0) * boxLight(N, normalize(vec3(-0.72, 0.3, -0.62)), 0.08, 0.15);
return e;
}
vec3 tiltStudio(vec3 v, float a) {
float c = cos(a);
float s = sin(a);
return vec3(v.x, v.y * c - v.z * s, v.y * s + v.z * c);
}
vec3 studioKey(vec3 N) {
return vec3(1.0, 0.975, 0.94) * boxLight(N, normalize(vec3(-0.45, 0.75, 0.5)), 1.05, 0.12);
}
float hash21(vec2 p) {
return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise2(vec2 p) {
vec2 i = floor(p);
vec2 f = fract(p);
vec2 s = f * f * (vec2(3.0) - 2.0 * f);
float a = hash21(i);
float b = hash21(i + vec2(1.0, 0.0));
float c = hash21(i + vec2(0.0, 1.0));
float d = hash21(i + vec2(1.0, 1.0));
return mix(mix(a, b, s.x), mix(c, d, s.x), s.y);
}
vec3 pbrNeutral(vec3 c) {
float x = min(c.x, min(c.y, c.z));
float offset = mix(x - 6.25 * x * x, 0.04, step(0.08, x));
vec3 col = c - vec3(offset);
float peak = max(col.x, max(col.y, col.z));
float start = 0.76;
float d = 1.0 - start;
float newPeak = 1.0 - d * d / (peak + d - start);
vec3 scaled = col * (newPeak / max(peak, 0.0001));
float g = 1.0 - 1.0 / (0.15 * (peak - newPeak) + 1.0);
vec3 compressed = mix(scaled, vec3(newPeak), g);
return mix(col, compressed, step(start, peak));
}
void main() {
float metallic = clamp(uUni[0].y, 0.0, 1.0);
float roughness0 = clamp(uUni[0].z, 0.05, 1.0);
float decalOn = clamp(uUni[1].w, 0.0, 1.0);
float aoStrength = clamp(uUni[2].x, 0.0, 1.0);
float lensFlag = uUni[2].y;
float exposure = uUni[2].z;
float coat0 = clamp(uUni[2].w, 0.0, 1.0);
float coatRough = clamp(uUni[3].x, 0.05, 1.0);
float f0d = uUni[3].y;
float detail = clamp(uUni[3].z, 0.0, 1.0);
float packedRaw = uUni[3].w;
float packedWorld = max(packedRaw, 0.0);
float worldR = floor(packedWorld / 65536.0);
float worldG = floor((packedWorld - worldR * 65536.0) / 256.0);
float worldB = packedWorld - worldR * 65536.0 - worldG * 256.0;
vec3 worldSrgb = vec3(worldR, worldG, worldB) / 255.0;
vec3 worldFull = pow(worldSrgb, vec3(2.2));
vec3 world = mix(vec3(dot(worldFull, vec3(0.2126, 0.7152, 0.0722))), worldFull, 0.5);
float hasWorld = step(0.5, packedWorld);
float studioTilt = min(packedRaw, 0.0);
float aoBaked = texture(uMaskMap, vUv).r;
float inkBaked = texture(uEnvMap, vUv).r;
float ink = inkBaked * decalOn;
float inkSolid = smoothstep(0.35, 0.8, ink);
float drift = noise2(vUv * 36.0) * 0.6 + noise2(vUv * 90.0 + vec2(17.0, 3.0)) * 0.4 - 0.5;
vec3 paint = vec3(uUni[1].x, uUni[1].y, uUni[1].z);
vec3 albedo = mix(paint, paint * 0.28, ink);
float roughness = clamp(roughness0 + drift * detail * 0.08 * (1.0 - ink) + inkSolid * 0.15, 0.05, 1.0);
float coat = coat0 * (1.0 - inkSolid * 0.7);
vec3 V = vec3(0.0, 0.0, 1.0);
vec3 G0 = normalize(vNormal);
float facing = step(0.0, dot(G0, V)) * 2.0 - 1.0;
vec3 Ng = normalize(G0 * facing + V * max(0.0, 0.08 - dot(G0 * facing, V)));
vec3 N = Ng;
float NdotV = max(dot(N, V), 0.001);
vec3 R = reflect(-V, N);
float occ = mix(1.0, pow(aoBaked, 1.3), aoStrength);
float keyOcc = mix(1.0, occ, 0.8);
float occS = mix(occ, 1.0, 0.4);
float specOcc = clamp(pow(NdotV + occS, exp2(-16.0 * roughness - 1.0)) - 1.0 + occS, 0.0, 1.0);
vec3 F0 = mix(vec3(f0d), albedo, metallic);
vec3 brdf = envBRDF(F0, roughness, NdotV);
vec3 ab = envBRDF(vec3(1.0), roughness, NdotV);
vec3 ms = vec3(1.0) + F0 * (1.0 / max(ab.x, 0.2) - 1.0);
float downR = smoothstep(0.15, -0.6, R.y) * hasWorld;
vec3 envBase = studioEnv(tiltStudio(R, studioTilt), roughness);
vec3 worldEnv = mix(envBase, world * 1.6, downR * 0.55 * (1.0 - 0.5 * metallic));
vec3 specular = worldEnv * brdf * ms * specOcc;
vec3 kD = (vec3(1.0) - brdf) * (1.0 - metallic);
float downN = clamp(-N.y * 0.5 + 0.5, 0.0, 1.0);
vec3 bounce = world * 0.55 * downN * downN * hasWorld;
vec3 diffuse = kD * albedo * ((studioAmbient(tiltStudio(N, studioTilt)) + bounce) * occ + studioKey(tiltStudio(N, studioTilt)) * keyOcc);
vec3 color = diffuse + specular;
float NgV = max(dot(Ng, V), 0.001);
float Fc = (0.04 + 0.96 * pow(1.0 - NgV, 5.0)) * coat;
vec3 Rc = reflect(-V, Ng);
vec3 coatSpec = studioEnv(tiltStudio(Rc, studioTilt), coatRough) * envBRDF(vec3(0.04), coatRough, NgV) * coat * clamp(pow(NgV + occS, exp2(-16.0 * coatRough - 1.0)) - 1.0 + occS, 0.0, 1.0);
color = color * (1.0 - Fc) + coatSpec;
float lensOn = step(0.5, lensFlag);
vec3 G = Ng;
float NdotVl = max(dot(G, V), 0.001);
vec3 Rl = reflect(-V, G);
float lensFres = 0.04 + 0.96 * pow(1.0 - NdotVl, 5.0);
vec3 coatTint = mix(vec3(1.0), vec3(0.9, 0.86, 1.0), smoothstep(0.1, 0.6, lensFres));
vec3 lens = vec3(0.005);
lens += studioEnv(tiltStudio(Rl, studioTilt), 0.06) * 0.5 * coatTint * lensFres;
vec3 key = normalize(vec3(-0.45, 0.75, 0.5));
vec3 fill = normalize(vec3(0.85, 0.1, 0.5));
lens += studioLight(G, V, key, vec3(1.0), 6.0, vec3(0.0), 0.0, 0.05, vec3(0.04));
lens += studioLight(G, V, key, vec3(1.0), 0.5, vec3(0.0), 0.0, 0.25, vec3(0.04));
lens += studioLight(G, V, fill, vec3(0.85, 0.92, 1.0), 2.0, vec3(0.0), 0.0, 0.05, vec3(0.04));
color = mix(color, lens, lensOn);
color = pbrNeutral(color * exposure);
color = pow(max(color, vec3(0.0)), vec3(0.45454545));
vec3 shown = min(color, vec3(1.0));
outColor = vec4(shown, 1.0);
return;
}`,n={fragment:e,fragmentGlsl:t};export{n as default,e as fragment,t as fragmentGlsl};