import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const scrollState = { progress: 0 };

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
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const p = scrollState.progress;
    const mouseInfluence = Math.max(0, p - 0.3) / 0.7;
    const targetRotY = mouse.current.x * 0.12 * mouseInfluence;
    const targetRotX = mouse.current.y * 0.08 * mouseInfluence;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.04;
  });

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    const p = scrollState.progress;
    glowRef.current.material.opacity = (0.12 + Math.sin(clock.getElapsedTime() * 1.5) * 0.05) * Math.min(1, p * 2);
  });

  return (
    <group ref={groupRef}>
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

      {/* Glow behind panel */}
      <mesh ref={glowRef} position={[0, 0, -0.2]}>
        <planeGeometry args={[5, 3.5]} />
        <meshBasicMaterial color="#7C3AED" transparent opacity={0} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Panel stand */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.12]} />
        <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -1.25, 0.15]}>
        <boxGeometry args={[0.5, 0.03, 0.35]} />
        <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Logo dot */}
      <mesh position={[0, -0.97, 0.046]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

/* ─── Ambient Particles ─── */
function ParticleField({ count = 500 }) {
  const meshRef = useRef();

  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;
      speeds[i] = Math.random() * 0.4 + 0.1;
    }
    return { positions: pos, speeds };
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = meshRef.current.geometry.getAttribute('position');
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      posAttr.array[ix + 1] += Math.sin(t * particles.speeds[i] + i) * 0.0008;
      posAttr.array[ix] += Math.cos(t * particles.speeds[i] * 0.3 + i) * 0.0004;
    }
    posAttr.needsUpdate = true;
    const p = scrollState.progress;
    meshRef.current.material.opacity = Math.max(0, (p - 0.2) * 1.5) * 0.5;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={particles.positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#A855F7" transparent opacity={0} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
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
      // Phase D: dramatic pull-out, long lens
      const t = (p - 0.58) / 0.42;
      targetZ = 0.7 + (10 - 0.7) * t;
      targetFov = 55 + (34 - 55) * t;
      targetY = 0.1 + 0.35 * t;
      targetRotX = -0.02 + (-0.15) * t;
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
        <ParticleField count={500} />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
