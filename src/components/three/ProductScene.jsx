import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Animated LED Grid on display face ─── */
function ScreenPixels({ width, height, density, gradient }) {
  const ref = useRef();
  const count = density * density;
  const colorA = useMemo(() => new THREE.Color(gradient[0]), [gradient]);
  const colorB = useMemo(() => new THREE.Color(gradient[1]), [gradient]);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < density; i++) {
      for (let j = 0; j < density; j++) {
        const idx = i * density + j;
        pos[idx * 3] = (i / density - 0.5) * width * 0.92;
        pos[idx * 3 + 1] = (j / density - 0.5) * height * 0.92;
        pos[idx * 3 + 2] = 0.04;
      }
    }
    return pos;
  }, [width, height, density, count]);

  const colors = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const colAttr = ref.current.geometry.getAttribute('color');
    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const wave = Math.sin(t * 1.5 + x * 4 + y * 3) * 0.5 + 0.5;
      const c = colorA.clone().lerp(colorB, wave);
      colAttr.setXYZ(i, c.r, c.g, c.b);
    }
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors sizeAttenuation transparent opacity={0.95} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ─── Single Display Unit ─── */
function DisplayUnit({ gradient }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.2}>
        {/* Panel frame */}
        <mesh>
          <boxGeometry args={[2.6, 1.5, 0.08]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.05} />
        </mesh>

        {/* Screen */}
        <mesh position={[0, 0, 0.041]}>
          <planeGeometry args={[2.4, 1.35]} />
          <meshStandardMaterial color="#09090b" emissive={gradient[0]} emissiveIntensity={0.05} />
        </mesh>

        {/* LED pixels */}
        <ScreenPixels width={2.4} height={1.35} density={22} gradient={gradient} />

        {/* Top bezel accent */}
        <mesh position={[0, 0.78, 0.041]}>
          <boxGeometry args={[2.62, 0.02, 0.005]} />
          <meshBasicMaterial color="#9333EA" transparent opacity={0.6} />
        </mesh>

        {/* Glow */}
        <mesh position={[0, 0, -0.12]}>
          <planeGeometry args={[3.5, 2.2]} />
          <meshBasicMaterial color={gradient[0]} transparent opacity={0.08} blending={THREE.AdditiveBlending} />
        </mesh>
      </Float>
    </group>
  );
}

/* ─── Product Scene ─── */
export default function ProductScene({ gradient = ['#9333EA', '#A855F7'] }) {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 2, 4]} intensity={0.8} color="#A855F7" />
        <pointLight position={[-3, -1, 3]} intensity={0.4} color="#7C3AED" />
        <DisplayUnit gradient={gradient} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.5}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}
