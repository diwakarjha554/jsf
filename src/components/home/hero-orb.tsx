"use client";

/**
 * Hero 3D model: a slowly morphing liquid "sphere of life" with a warm rim, a tilted ring of light
 * with a travelling glow, and a faint dust shell. Plain three.js (no React renderer) for a small bundle.
 * - Pauses when off-screen or when the tab is hidden; renders one still frame for reduced motion.
 * - Pixel ratio capped for performance; detail reduced on touch devices.
 * Simplex noise: "webgl-noise" by Ian McEwan, Ashima Arts (MIT License).
 */
import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERT = /* glsl */ `
uniform float uTime; uniform float uAmp;
varying vec3 vNormal; varying vec3 vView; varying float vNoise;
${NOISE}
float field(vec3 p){ return snoise(p*0.62+vec3(0.0,uTime*0.12,uTime*0.05)) + 0.18*snoise(p*1.3-vec3(uTime*0.08)); }
vec3 displace(vec3 p){ return p + normalize(p)*field(p)*uAmp; }
void main(){
  vec3 n = normalize(normal);
  vec3 t = normalize(cross(n, abs(n.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0)));
  vec3 b = normalize(cross(n, t));
  float e = 0.012;
  vec3 p0 = displace(position);
  vec3 dn = normalize(cross(displace(position+t*e)-p0, displace(position+b*e)-p0));
  if (dot(dn, n) < 0.0) dn = -dn;
  vNoise = field(position);
  vec4 world = modelMatrix * vec4(p0, 1.0);
  vNormal = normalize(mat3(modelMatrix) * dn);
  vView = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const FRAG = /* glsl */ `
uniform float uTime; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform vec3 uD; uniform vec3 uE;
varying vec3 vNormal; varying vec3 vView; varying float vNoise;
void main(){
  vec3 N = normalize(vNormal); vec3 V = normalize(vView);
  float ndv = max(dot(N, V), 0.0);
  float fres = pow(1.0 - ndv, 2.6);
  vec3 L = normalize(vec3(-0.75, 0.8, 0.32));
  float lam = dot(N, L) * 0.5 + 0.5;
  // body: deep plum shadow -> magenta plum -> vermilion -> marigold highlight
  vec3 body = mix(uD, uE, smoothstep(0.08, 0.46, lam));
  body = mix(body, uB, smoothstep(0.46, 0.78, lam));
  body = mix(body, uA, smoothstep(0.8, 1.0, lam));
  // slow liquid sheen following the surface flow
  float band = 0.5 + 0.5 * sin(vNoise * 5.0 + uTime * 0.35);
  body += uA * band * 0.05 * lam;
  // warm rim (no green), shifting gently between vermilion and marigold
  vec3 rim = mix(uB, uA, 0.5 + 0.5 * sin(fres * 3.0 + uTime * 0.25));
  vec3 col = body + rim * fres * 0.75;
  // cool violet back light for depth
  float back = pow(max(dot(N, normalize(vec3(0.75, -0.55, -0.25))), 0.0), 1.6);
  col += uC * back * 0.32;
  // highlights: tight specular + broad soft bloom
  vec3 H = normalize(L + V);
  float nh = max(dot(N, H), 0.0);
  col += vec3(1.0, 0.95, 0.88) * (pow(nh, 140.0) * 1.15 + pow(nh, 14.0) * 0.14);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

export default function HeroOrb({ className, onReady }: { className?: string; onReady?: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: the CSS fallback orb stays visible
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0, 9.2);

    const col = (hex: string) => new Color(hex);
    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.16 },
      uA: { value: col("#ffc233") },
      uB: { value: col("#f5532e") },
      uC: { value: col("#9479d4") },
      uD: { value: col("#160c2c") },
      uE: { value: col("#6d2763") },
    };

    const world = new Group();
    scene.add(world);

    const orbGeo = new IcosahedronGeometry(1.48, coarse ? 32 : 56);
    const orbMat = new ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG });
    const orb = new Mesh(orbGeo, orbMat);
    world.add(orb);

    // Tilted ring of light
    const ring = new Group();
    ring.rotation.set(1.18, 0.2, 0);
    world.add(ring);
    const dot = dotTexture();
    const ringGeo = new BufferGeometry();
    const N = coarse ? 900 : 1600;
    const pos: number[] = [];
    const cols: number[] = [];
    const warm = new Color("#ffd15c");
    for (let i = 0; i < N; i++) {
      const f = i / N;
      const a = f * Math.PI * 2 + Math.random() * 0.02;
      const r = 2.32 + (Math.random() - 0.5) * 0.2 * Math.random();
      pos.push(Math.cos(a) * r, (Math.random() - 0.5) * 0.04, Math.sin(a) * r);
      // a comet-like glow that fades along the ring; the ring's rotation makes it travel
      const glow = 0.34 + 0.66 * Math.pow(f, 5);
      cols.push(warm.r * glow, warm.g * glow, warm.b * glow);
    }
    ringGeo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    ringGeo.setAttribute("color", new Float32BufferAttribute(cols, 3));
    const ringMat = new PointsMaterial({ size: 0.05, map: dot, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false, blending: AdditiveBlending });
    ring.add(new Points(ringGeo, ringMat));

    // Faint outer dust shell
    const dustGeo = new BufferGeometry();
    const dust: number[] = [];
    for (let i = 0; i < (coarse ? 220 : 420); i++) {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const r = 2.7 + Math.random() * 1.1;
      const s = Math.sqrt(1 - u * u);
      dust.push(r * s * Math.cos(th), r * u, r * s * Math.sin(th));
    }
    dustGeo.setAttribute("position", new Float32BufferAttribute(dust, 3));
    const dustMat = new PointsMaterial({ size: 0.026, map: dot, color: "#bba8e6", transparent: true, opacity: 0.38, depthWrite: false, blending: AdditiveBlending });
    const dustPts = new Points(dustGeo, dustMat);
    world.add(dustPts);

    // Interaction state
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.55;
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.35;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    let last = 0;
    let t = 0;
    let firstFrame = true;
    const frame = (time: number = performance.now()) => {
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 0.016;
      last = time;
      t += dt;
      uniforms.uTime.value = t;
      // ease toward pointer (responsive, not sluggish)
      const k = 1 - Math.pow(0.0015, dt);
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      // scroll: shrink and spin a little as the hero leaves
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));
      world.scale.setScalar(1 - p * 0.18);
      world.rotation.y = current.x;
      world.rotation.x = current.y + p * 0.25;
      orb.rotation.y += dt * 0.1;
      ring.rotation.y -= dt * (0.32 + p * 0.6);
      dustPts.rotation.y -= dt * 0.02;
      renderer.render(scene, camera);
      if (firstFrame) {
        firstFrame = false;
        readyRef.current?.();
      }
    };

    let running = false;
    const start = () => {
      if (running || reduce) return;
      running = true;
      renderer.setAnimationLoop(frame);
    };
    const stop = () => {
      running = false;
      last = 0;
      renderer.setAnimationLoop(null);
    };
    if (reduce) frame();
    else start();

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()), { threshold: 0 });
    io.observe(host);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      orbGeo.dispose();
      orbMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      dot.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
