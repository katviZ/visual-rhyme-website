import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Shared scroll value (set from outside React Three) ─── */
const scrollState = { progress: 0 };

/* ─── Dense LED Pixel Grid — fills the screen when zoomed in ─── */
function LEDPixels({ width, height, density }) {
  const meshRef = useRef();
  const count = density * density;

  const { positions, colors, scales } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    const purple = new THREE.Color('#9333EA');
    const blue = new THREE.Color('#A855F7');
    const white = new THREE.Color('#E9D5FF');

    for (let i = 0; i < density; i++) {
      for (let j = 0; j < density; j++) {
        const idx = i * density + j;
        pos[idx * 3] = (i / density - 0.5) * width * 0.92;
        pos[idx * 3 + 1] = (j / density - 0.5) * height * 0.92;
        pos[idx * 3 + 2] = 0.06;

        const r = Math.random();
        const c = r < 0.4 ? purple : r < 0.7 ? blue : white;
        col[idx * 3] = c.r;
        col[idx * 3 + 1] = c.g;
        col[idx * 3 + 2] = c.b;

        sc[idx] = 0.3 + Math.random() * 0.7;
      }
    }
    return { positions: pos, colors: col, scales: sc };
  }, [width, height, density, count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const colAttr = meshRef.current.geometry.getAttribute('color');
    const dark = new THREE.Color('#6D28D9');
    const bright = new THREE.Color('#E9D5FF');
    const mid = new THREE.Color('#A855F7');

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      // Multiple waves for a richer pattern
      const wave1 = Math.sin(t * 1.8 + x * 3.5 + y * 2.5) * 0.5 + 0.5;
      const wave2 = Math.sin(t * 1.2 + x * 1.5 - y * 4) * 0.5 + 0.5;
      const wave = (wave1 + wave2) * 0.5;
      const c = wave < 0.4 ? dark.clone().lerp(mid, wave * 2.5) : mid.clone().lerp(bright, (wave - 0.4) * 1.6);
      colAttr.setXYZ(i, c.r * scales[i] + 0.1, c.g * scales[i], c.b * scales[i]);
    }
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.055} vertexColors sizeAttenuation transparent opacity={0.95} blending={THREE.AdditiveBlending} />
    </points>
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
    // Only apply mouse rotation when zoomed out enough
    const mouseInfluence = Math.max(0, p - 0.3) / 0.7;
    const targetRotY = mouse.current.x * 0.12 * mouseInfluence;
    const targetRotX = mouse.current.y * 0.08 * mouseInfluence;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.04;
  });

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    const p = scrollState.progress;
    // Glow intensifies as it zooms out
    glowRef.current.material.opacity = (0.1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.05) * Math.min(1, p * 2);
  });

  return (
    <group ref={groupRef}>
      {/* Panel body — sleek black frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.6, 2.05, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Thin bezel accent line — top */}
      <mesh position={[0, 1.025, 0.041]}>
        <boxGeometry args={[3.62, 0.015, 0.003]} />
        <meshBasicMaterial color="#9333EA" transparent opacity={0.7} />
      </mesh>
      {/* Thin bezel accent line — bottom */}
      <mesh position={[0, -1.025, 0.041]}>
        <boxGeometry args={[3.62, 0.015, 0.003]} />
        <meshBasicMaterial color="#9333EA" transparent opacity={0.4} />
      </mesh>

      {/* Screen surface */}
      <mesh position={[0, 0, 0.041]}>
        <planeGeometry args={[3.4, 1.9]} />
        <meshStandardMaterial color="#050507" metalness={0.3} roughness={0.4} emissive="#2e1065" emissiveIntensity={0.15} />
      </mesh>

      {/* LED pixel grid */}
      <LEDPixels width={3.4} height={1.9} density={40} />

      {/* Glow behind panel — visible on zoom-out */}
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

      {/* Small logo dot on bezel */}
      <mesh position={[0, -0.97, 0.045]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

/* ─── Ambient Particles — only visible on zoom-out ─── */
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
    // Fade in particles as we zoom out
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

/* ─── Floating Wireframe Shapes — fade in on zoom-out ─── */
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

/* ─── Camera Controller — drives the zoom-out ─── */
function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    const p = scrollState.progress;
    // Zoom: start at z=1.2 (deep in the pixels) → end at z=6 (full panel view)
    const targetZ = 1.2 + p * 4.8;
    // Slight upward drift as we zoom out
    const targetY = p * 0.3;
    // Gentle tilt
    const targetRotX = -p * 0.05;

    camera.position.z += (targetZ - camera.position.z) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.rotation.x += (targetRotX - camera.rotation.x) * 0.06;
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
  // Sync scroll from React/Framer Motion into Three.js
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
