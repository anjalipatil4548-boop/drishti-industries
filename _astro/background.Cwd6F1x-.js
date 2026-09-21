var e=`fn unpackColor(v: f32) -> vec3f {
let r = floor(v / 65536.0);
let g = floor((v - r * 65536.0) / 256.0);
let b = v - r * 65536.0 - g * 256.0;
return vec3f(r, g, b) / 255.0;
}
fn fsMain() -> vec4f {
return vec4f(unpackColor(uUni.values0.x), 1.0);
}`,t=`#version 300 es
precision highp float;
in vec2 vUv;
uniform vec4 uUni[4];
out vec4 outColor;
vec3 unpackColor(float v) {
float r = floor(v / 65536.0);
float g = floor((v - r * 65536.0) / 256.0);
float b = v - r * 65536.0 - g * 256.0;
return vec3(r, g, b) / 255.0;
}
void main() {
outColor = vec4(unpackColor(uUni[0].x), 1.0);
return;
}`,n={fragment:e,fragmentGlsl:t};export{n as default,e as fragment,t as fragmentGlsl};