import{C as e,S as t,n}from"./esm.DPdbMh04.js";var r=`struct VsOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vsMain(@builtin(vertex_index) index: u32) -> VsOut {
  var corners = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  let p = corners[index];
  var out: VsOut;
  out.position = vec4f(p, 0.0, 1.0);
  out.uv = vec2f(p.x * 0.5 + 0.5, 1.0 - (p.y * 0.5 + 0.5));
  return out;
}

@group(0) @binding(0) var uSampler: sampler;
@group(0) @binding(1) var uSource: texture_2d<f32>;

@fragment
fn fsMain(in: VsOut) -> @location(0) vec4f {
  return textureSample(uSource, uSampler, in.uv);
}
`,i=new WeakMap;function a(e,t){return Math.floor(Math.log2(Math.max(e,t,1)))+1}function o(t){let n=i.get(t);return n||(n={sampler:t.createSampler({label:`shooosh-mip-sampler`,magFilter:`linear`,minFilter:`linear`}),layout:t.createBindGroupLayout({label:`shooosh-mip-layout`,entries:[{binding:0,visibility:e.FRAGMENT,sampler:{type:`filtering`}},{binding:1,visibility:e.FRAGMENT,texture:{sampleType:`float`,viewDimension:`2d`}}]}),pipelines:new Map},i.set(t,n)),n}function s(e,t){let n=o(e),i=n.pipelines.get(t);if(!i){let a=e.createShaderModule({label:`shooosh-mip-blit`,code:r});i=e.createRenderPipeline({label:`shooosh-mip-blit-${t}`,layout:e.createPipelineLayout({label:`shooosh-mip-pipeline-layout`,bindGroupLayouts:[n.layout]}),vertex:{module:a,entryPoint:`vsMain`},fragment:{module:a,entryPoint:`fsMain`,targets:[{format:t}]},primitive:{topology:`triangle-list`}}),n.pipelines.set(t,i)}return i}function c(e,t,n,r,i=`shooosh-texture`){if(r<2)return;let a=o(e),c=s(e,n),l=e.createCommandEncoder({label:`${i}-mips`}),u=t.createView({baseMipLevel:0,mipLevelCount:1});for(let n=1;n<r;n+=1){let r=t.createView({baseMipLevel:n,mipLevelCount:1}),o=l.beginRenderPass({label:`${i}-mip-${n}`,colorAttachments:[{view:r,loadOp:`clear`,storeOp:`store`,clearValue:[0,0,0,0]}]});o.setPipeline(c),o.setBindGroup(0,e.createBindGroup({label:`${i}-mip-${n}-bind`,layout:a.layout,entries:[{binding:0,resource:a.sampler},{binding:1,resource:u}]})),o.draw(3),o.end(),u=r}e.queue.submit([l.finish()])}var l=t.TEXTURE_BINDING|t.COPY_DST|t.RENDER_ATTACHMENT,u=t.TEXTURE_BINDING|t.RENDER_ATTACHMENT,d=!1;function f(e,t,r={}){let i=n(e);if(!i)throw Error(`loadTexture could not reach the WebGPU device. Await createScene()/initEngine() first.`);let{device:o}=i;if(!o.queue.copyExternalImageToTexture)throw Error(`This WebGPU implementation cannot copy images to textures (queue.copyExternalImageToTexture missing).`);let s=Math.max(1,t.width),f=Math.max(1,t.height),p=r.format===`rgb`?`rgba8unorm`:r.format??`rgba8unorm`,m=r.usage??l,h=1;r.sampler?.mipmapFilter&&((m&u)===u?h=a(s,f):d||(d=!0,console.warn("loadTexture: sampler.mipmapFilter needs TEXTURE_BINDING | RENDER_ATTACHMENT usage to generate mips — the custom `usage` omits one, so this texture stays single-level.")));let g=o.createTexture({label:r.label??`shooosh-texture`,size:{width:s,height:f},format:p,usage:m,mipLevelCount:h});o.queue.copyExternalImageToTexture({source:t,flipY:r.flipY===!0},{texture:g,premultipliedAlpha:!0},{width:s,height:f}),h>1&&c(o,g,p,h,r.label);let _=g.createView(),v=r.createSampler??!0?o.createSampler({label:`${r.label??`shooosh-texture`}-sampler`,magFilter:r.sampler?.magFilter??`linear`,minFilter:r.sampler?.minFilter??`linear`,...h>1?{mipmapFilter:r.sampler?.mipmapFilter}:{},addressModeU:r.sampler?.addressModeU??`clamp-to-edge`,addressModeV:r.sampler?.addressModeV??`clamp-to-edge`}):null;return{texture:{backend:`webgpu`,texture:g,width:s,height:f,createView(){return _},destroy(){g.destroy()}},view:_,sampler:v}}export{f as uploadWebGpuTexture};