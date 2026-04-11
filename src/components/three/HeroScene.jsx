import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ─── LED Pixel Grid on the Panel ─── */
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
        pos[idx * 3] = (i / density - 0.5) * width * 0.9;
        pos[idx * 3 + 1] = (j / density - 0.5) * height * 0.9;
        pos[idx * 3 + 2] = 0.06;

        const r = Math.random();
        const c = r < 0.5 ? purple : r < 0.8 ? blue : white;
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
    const purple = new THREE.Color('#9333EA');
    const bright = new THREE.Color('#C084FC');

    for (let i = 0; i < count; i++) {
      const wave = Math.sin(t * 2 + positions[i * 3] * 3 + positions[i * 3 + 1] * 2) * 0.5 + 0.5;
      const c = purple.clone().lerp(bright, wave * scales[i]);
      colAttr.setXYZ(i, c.r, c.g, c.b);
    }
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors sizeAttenuation transparent opacity={0.9} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ─── The LED Display Panel ─── */
function LEDPanel() {
  const groupRef = useRef();
  const glowRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = useCallback((e) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetRotY = mouse.current.x * 0.15;
    const targetRotX = mouse.current.y * 0.1;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
  });

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    glowRef.current.material.opacity = 0.15 + Math.sin(clock.getElapsedTime() * 1.5) * 0.05;
  });

  return (
    <group ref={groupRef} onPointerMove={handlePointerMove}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        {/* Panel body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2, 1.8, 0.1]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Screen surface */}
        <mesh position={[0, 0, 0.051]}>
          <planeGeometry args={[3, 1.6]} />
          <meshStandardMaterial color="#09090b" metalness={0.5} roughness={0.3} emissive="#4c1d95" emissiveIntensity={0.1} />
        </mesh>

        {/* LED pixels on screen */}
        <group position={[0, 0, 0]}>
          <LEDPixels width={3} height={1.6} density={28} />
        </group>

        {/* Bezel glow edges */}
        <mesh position={[0, 0, 0.052]}>
          <planeGeometry args={[3.22, 1.82]} />
          <meshBasicMaterial color="#9333EA" transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>

        {/* Glow behind panel */}
        <mesh ref={glowRef} position={[0, 0, -0.15]}>
          <planeGeometry args={[4.5, 3]} />
          <meshBasicMaterial color="#7C3AED" transparent opacity={0.15} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Panel stand / bottom bar */}
        <mesh position={[0, -1.05, 0]}>
          <boxGeometry args={[1, 0.08, 0.15]} />
          <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -1.1, 0.2]}>
          <boxGeometry args={[0.6, 0.04, 0.4]} />
          <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

/* ─── Floating Particles ─── */
function ParticleField({ count = 800 }) {
  const meshRef = useRef();

  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      sizes[i] = Math.random() * 0.03 + 0.005;
      speeds[i] = Math.random() * 0.5 + 0.2;
    }
    return { positions: pos, sizes, speeds };
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.getAttribute('position');
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      posAttr.array[ix + 1] += Math.sin(t * particles.speeds[i] + i) * 0.001;
      posAttr.array[ix] += Math.cos(t * particles.speeds[i] * 0.5 + i) * 0.0005;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={particles.positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#A855F7" transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/* ─── Floating Glass Shapes ─── */
function FloatingShapes() {
  const shapes = useMemo(() => [
    { pos: [-5, 2, -4], scale: 0.4, speed: 0.6, geo: 'octahedron' },
    { pos: [5.5, -1.5, -3], scale: 0.3, speed: 0.8, geo: 'icosahedron' },
    { pos: [-4, -2.5, -5], scale: 0.5, speed: 0.4, geo: 'dodecahedron' },
    { pos: [4, 3, -6], scale: 0.35, speed: 0.7, geo: 'octahedron' },
    { pos: [-6, 0, -7], scale: 0.25, speed: 0.9, geo: 'tetrahedron' },
    { pos: [6, 1.5, -5], scale: 0.2, speed: 1, geo: 'icosahedron' },
  ], []);

  return shapes.map((s, i) => (
    <Float key={i} speed={s.speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={s.pos} scale={s.scale}>
        {s.geo === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
        {s.geo === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
        {s.geo === 'dodecahedron' && <dodecahedronGeometry args={[1, 0]} />}
        {s.geo === 'tetrahedron' && <tetrahedronGeometry args={[1, 0]} />}
        <MeshDistortMaterial
          color="#7C3AED"
          transparent
          opacity={0.12}
          wireframe
          distort={0.2}
          speed={2}
        />
      </mesh>
    </Float>
  ));
}

/* ─── Ambient Lights ─── */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 5]} intensity={1} color="#A855F7" />
      <pointLight position={[-5, 3, 2]} intensity={0.5} color="#7C3AED" />
      <pointLight position={[5, -3, 2]} intensity={0.3} color="#9333EA" />
      <spotLight position={[0, 5, 5]} angle={0.5} penumbra={1} intensity={0.8} color="#C084FC" />
    </>
  );
}

/* ─── Main Hero Scene ─── */
export default function HeroScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Lighting />
        <LEDPanel />
        <ParticleField count={600} />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
