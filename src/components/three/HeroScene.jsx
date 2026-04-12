import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const scrollState = { progress: 0 };
const mouseState = { x: 0, y: 0 };

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouseState.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseState.y = -((e.clientY / window.innerHeight) * 2 - 1);
  });
}

/* ─── Custom Shader: Seamless liquid purple MicroLED surface ─── */
const LiquidScreenMaterial = {
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;

    // Simplex-style noise for organic flow
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 a0 = x - floor(x + 0.5);
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      float t = uTime;

      // Multiple noise layers for rich liquid flow
      float n1 = snoise(uv * 3.0 + vec2(t * 0.15, t * 0.1));
      float n2 = snoise(uv * 5.0 - vec2(t * 0.12, -t * 0.08));
      float n3 = snoise(uv * 8.0 + vec2(-t * 0.08, t * 0.15));
      float n4 = snoise(uv * 2.0 + vec2(t * 0.05, t * 0.05));

      // Combine for smooth organic motion
      float flow = n1 * 0.4 + n2 * 0.3 + n3 * 0.15 + n4 * 0.15;
      flow = flow * 0.5 + 0.5; // normalize to 0-1

      // Purple palette — deep blacks to bright lavender
      vec3 deepBlack  = vec3(0.02, 0.0, 0.05);
      vec3 deepPurple = vec3(0.14, 0.02, 0.30);
      vec3 purple     = vec3(0.29, 0.11, 0.58);
      vec3 violet     = vec3(0.49, 0.22, 0.91);
      vec3 lavender   = vec3(0.66, 0.33, 0.97);
      vec3 bright     = vec3(0.75, 0.52, 0.99);
      vec3 glow       = vec3(0.85, 0.71, 1.0);

      // Smooth color stops
      vec3 col;
      if (flow < 0.12)      col = mix(deepBlack, deepPurple, flow / 0.12);
      else if (flow < 0.28) col = mix(deepPurple, purple, (flow - 0.12) / 0.16);
      else if (flow < 0.45) col = mix(purple, violet, (flow - 0.28) / 0.17);
      else if (flow < 0.62) col = mix(violet, lavender, (flow - 0.45) / 0.17);
      else if (flow < 0.78) col = mix(lavender, bright, (flow - 0.62) / 0.16);
      else                  col = mix(bright, glow, (flow - 0.78) / 0.22);

      // Subtle vignette — darker at edges
      float vignette = 1.0 - smoothstep(0.3, 0.85, length(uv - 0.5) * 1.4);
      col *= 0.7 + vignette * 0.5;

      // Slight emissive bloom in bright areas
      float bloom = smoothstep(0.6, 1.0, flow) * 0.15;
      col += vec3(0.4, 0.2, 0.8) * bloom;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

/* ─── Animated Screen Surface ─── */
function MicroLEDScreen({ width, height }) {
  const matRef = useRef();

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh position={[0, 0, 0.045]}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={matRef}
        attach="material"
        uniforms={LiquidScreenMaterial.uniforms}
        vertexShader={LiquidScreenMaterial.vertexShader}
        fragmentShader={LiquidScreenMaterial.fragmentShader}
      />
    </mesh>
  );
}

/* ─── The LED Display Panel ─── */
function LEDPanel() {
  const groupRef = useRef();
  const glowRef = useRef();
  const haloRef = useRef();
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const p = scrollState.progress;
    const mouseInfluence = Math.max(0, p - 0.3) / 0.7;
    const targetRotY = mouseState.x * 0.12 * mouseInfluence;
    const targetRotX = -mouseState.y * 0.08 * mouseInfluence;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.04;
    // subtle float — only during pull-out when panel is visible small
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.06 * p;
  });

  useFrame(({ clock }) => {
    const p = scrollState.progress;
    const t = clock.getElapsedTime();
    if (glowRef.current) {
      glowRef.current.material.opacity = (0.22 + Math.sin(t * 1.5) * 0.06) * Math.min(1, p * 2);
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = t * 0.12;
      const haloOpacity = Math.max(0, (p - 0.35) / 0.65) * (0.55 + Math.sin(t * 0.8) * 0.1);
      haloRef.current.material.opacity = haloOpacity;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.08;
      ringRef.current.material.opacity = Math.max(0, (p - 0.45) / 0.55) * 0.7;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Far glow halo — torus behind panel */}
      <mesh ref={haloRef} position={[0, 0, -0.6]}>
        <torusGeometry args={[3.0, 0.035, 24, 128]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      {/* Inner ring */}
      <mesh ref={ringRef} position={[0, 0, -0.4]}>
        <torusGeometry args={[2.4, 0.014, 16, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>

      {/* Panel body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.6, 2.05, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Bezel accent — top */}
      <mesh position={[0, 1.025, 0.041]}>
        <boxGeometry args={[3.62, 0.015, 0.003]} />
        <meshBasicMaterial color="#9333EA" transparent opacity={0.7} />
      </mesh>
      {/* Bezel accent — bottom */}
      <mesh position={[0, -1.025, 0.041]}>
        <boxGeometry args={[3.62, 0.015, 0.003]} />
        <meshBasicMaterial color="#9333EA" transparent opacity={0.4} />
      </mesh>

      {/* Seamless MicroLED screen with liquid shader */}
      <MicroLEDScreen width={3.4} height={1.9} />

      {/* Soft background glow plane */}
      <mesh ref={glowRef} position={[0, 0, -0.25]}>
        <planeGeometry args={[8.5, 5.8]} />
        <meshBasicMaterial color="#7C3AED" transparent opacity={0} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Logo dot */}
      <mesh position={[0, -0.97, 0.046]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

/* ─── GLSL Particle Field ─── */
const ParticleVertexShader = `
  attribute float aSeed;
  attribute float aSize;
  uniform float uTime;
  uniform float uScroll;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  varying float vAlpha;
  varying float vDepth;
  varying float vForce;

  void main() {
    vec3 p = position;

    // Curl-ish flow using layered sin/cos on per-particle seed
    float t = uTime * 0.25;
    float s = aSeed * 6.2831;
    p.x += sin(t * 0.9 + s) * 0.35 + cos(t * 0.5 + aSeed * 11.0) * 0.22;
    p.y += cos(t * 0.7 + s * 1.3) * 0.28 + sin(t * 0.45 + aSeed * 9.0) * 0.2;
    p.z += sin(t * 0.6 + s * 0.8) * 0.3;

    // Scroll streams particles toward camera + disperses outward
    float push = uScroll * 6.0;
    p.z += push;
    p.xy *= 1.0 + uScroll * 0.55;

    // Cursor repulsion bubble — probe NDC before final projection
    vec4 mvEarly = modelViewMatrix * vec4(p, 1.0);
    vec4 projEarly = projectionMatrix * mvEarly;
    vec2 ndcEarly = projEarly.xy / max(projEarly.w, 0.0001);
    vec2 toMouse = ndcEarly - uMouse;
    float d = length(toMouse);
    float force = smoothstep(0.42, 0.0, d);
    vec2 dir = d > 0.001 ? toMouse / d : vec2(0.0);
    p.xy += dir * force * 1.4;
    // small swirl component so it feels alive
    p.xy += vec2(-dir.y, dir.x) * force * 0.6;
    vForce = force;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Distance-based point size with subtle twinkle + cursor boost
    float twinkle = 0.7 + 0.6 * sin(uTime * 2.0 + aSeed * 17.0);
    gl_PointSize = aSize * twinkle * uPixelRatio * (40.0 / -mv.z) * (1.0 + force * 0.8);

    // Opacity: ramp in with scroll, fade far depths
    float depthFade = smoothstep(-20.0, -2.0, mv.z);
    vAlpha = smoothstep(0.15, 0.6, uScroll) * depthFade;
    vDepth = clamp((-mv.z) / 12.0, 0.0, 1.0);
  }
`;

const ParticleFragmentShader = `
  varying float vAlpha;
  varying float vDepth;
  varying float vForce;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float falloff = smoothstep(0.5, 0.0, d);
    float core = pow(falloff, 2.2);

    vec3 near = vec3(0.82, 0.58, 1.0);
    vec3 far  = vec3(0.35, 0.12, 0.68);
    vec3 col = mix(near, far, vDepth);
    col += core * 0.35;
    // cursor-touched particles flare bright white
    col += vec3(0.9, 0.75, 1.0) * vForce * 0.6;

    gl_FragColor = vec4(col, core * vAlpha);
  }
`;

function ParticleField({ count = 2400 }) {
  const meshRef = useRef();
  const matRef = useRef();

  const { positions, seeds, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Spherical-ish distribution biased toward the camera volume
      const r = Math.pow(Math.random(), 0.6) * 11;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.55 - 2.5;
      seeds[i] = Math.random();
      sizes[i] = 0.9 + Math.random() * 2.4;
    }
    return { positions, seeds, sizes };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (matRef.current) {
      const u = matRef.current.uniforms;
      u.uTime.value = clock.getElapsedTime();
      u.uScroll.value = scrollState.progress;
      // smooth mouse toward target for lagged trail
      u.uMouse.value.x += (mouseState.x - u.uMouse.value.x) * 0.08;
      u.uMouse.value.y += (mouseState.y - u.uMouse.value.y) * 0.08;
    }
  });

  return (
    <points ref={meshRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aSeed" array={seeds} count={count} itemSize={1} />
        <bufferAttribute attach="attributes-aSize" array={sizes} count={count} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={ParticleVertexShader}
        fragmentShader={ParticleFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Bokeh Orbs — soft glowing lights drifting in background ─── */
function BokehOrbs() {
  const groupRef = useRef();
  const orbs = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        pos: [
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 7,
          -3 - Math.random() * 6,
        ],
        scale: 0.8 + Math.random() * 1.8,
        speed: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        color: i % 3 === 0 ? '#c084fc' : i % 3 === 1 ? '#7c3aed' : '#a855f7',
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const p = scrollState.progress;
    groupRef.current.children.forEach((c, i) => {
      const orb = orbs[i];
      c.position.y = orb.pos[1] + Math.sin(t * orb.speed + orb.phase) * 0.45;
      c.position.x = orb.pos[0] + Math.cos(t * orb.speed * 0.6 + orb.phase) * 0.35;
      if (c.material) {
        c.material.opacity = Math.max(0, (p - 0.3) / 0.7) * 0.6;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.pos} scale={orb.scale}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={{ uColor: { value: new THREE.Color(orb.color) } }}
            vertexShader={`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform vec3 uColor;
              varying vec2 vUv;
              void main() {
                vec2 uv = vUv - 0.5;
                float d = length(uv);
                float core = smoothstep(0.5, 0.0, d);
                float bloom = pow(core, 2.5);
                gl_FragColor = vec4(uColor * bloom, bloom);
              }
            `}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Floating Wireframe Shapes ─── */
function FloatingShapes() {
  const groupRef = useRef();
  const shapes = useMemo(() => [
    { pos: [-5, 2, -4], scale: 0.35, speed: 0.5, geo: 'octahedron' },
    { pos: [5.5, -1.5, -3], scale: 0.25, speed: 0.7, geo: 'icosahedron' },
    { pos: [-4, -2.5, -5], scale: 0.4, speed: 0.4, geo: 'dodecahedron' },
    { pos: [4, 3, -6], scale: 0.3, speed: 0.6, geo: 'octahedron' },
    { pos: [-6, 0.5, -7], scale: 0.2, speed: 0.8, geo: 'tetrahedron' },
  ], []);

  useFrame(() => {
    if (!groupRef.current) return;
    const p = scrollState.progress;
    groupRef.current.children.forEach(c => {
      if (c.material) c.material.opacity = Math.max(0, (p - 0.4) * 0.3);
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((s, i) => (
        <Float key={i} speed={s.speed} rotationIntensity={0.4} floatIntensity={0.5}>
          <mesh position={s.pos} scale={s.scale}>
            {s.geo === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
            {s.geo === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
            {s.geo === 'dodecahedron' && <dodecahedronGeometry args={[1, 0]} />}
            {s.geo === 'tetrahedron' && <tetrahedronGeometry args={[1, 0]} />}
            <MeshDistortMaterial color="#7C3AED" transparent opacity={0} wireframe distort={0.15} speed={1.5} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* ─── Camera Rig — cinematic dolly-zoom ─── */
function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    const p = scrollState.progress;

    // Piecewise curve: rush-in → vertigo FOV swing → settle → dramatic pull-out
    let targetZ, targetFov, targetY, targetRotX;

    if (p < 0.15) {
      // Phase A: rush in, panel gets huge
      const t = p / 0.15;
      targetZ = 1.2 + (0.45 - 1.2) * t;
      targetFov = 50 + (65 - 50) * t;
      targetY = 0;
      targetRotX = 0;
    } else if (p < 0.35) {
      // Phase B: dolly-zoom vertigo — camera holds, FOV explodes
      const t = (p - 0.15) / 0.20;
      targetZ = 0.45 + (0.4 - 0.45) * t;
      targetFov = 65 + (92 - 65) * t;
      targetY = 0;
      targetRotX = 0;
    } else if (p < 0.58) {
      // Phase C: settle — FOV pulls back so text is readable over scene
      const t = (p - 0.35) / 0.23;
      targetZ = 0.4 + (0.7 - 0.4) * t;
      targetFov = 92 + (55 - 92) * t;
      targetY = 0.1 * t;
      targetRotX = -0.02 * t;
    } else {
      // Phase D: dramatic pull-out, long lens (tighter to keep monument grand)
      const t = (p - 0.58) / 0.42;
      targetZ = 0.7 + (6 - 0.7) * t;
      targetFov = 55 + (38 - 55) * t;
      targetY = 0.1 + 0.15 * t;
      targetRotX = -0.02 + (-0.08) * t;
    }

    camera.position.z += (targetZ - camera.position.z) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.rotation.x += (targetRotX - camera.rotation.x) * 0.06;

    const fovDiff = targetFov - camera.fov;
    if (Math.abs(fovDiff) > 0.01) {
      camera.fov += fovDiff * 0.08;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

/* ─── Lights ─── */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 4]} intensity={0.8} color="#A855F7" />
      <pointLight position={[-4, 3, 2]} intensity={0.4} color="#7C3AED" />
      <pointLight position={[4, -2, 3]} intensity={0.3} color="#9333EA" />
      <spotLight position={[0, 5, 5]} angle={0.4} penumbra={1} intensity={0.6} color="#C084FC" />
    </>
  );
}

/* ─── Main Export ─── */
export default function HeroScene({ scrollProgress = 0 }) {
  useEffect(() => {
    scrollState.progress = scrollProgress;
  }, [scrollProgress]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 1.2], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <CameraRig />
        <Lighting />
        <LEDPanel />
        <ParticleField count={3500} />
        <BokehOrbs />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
