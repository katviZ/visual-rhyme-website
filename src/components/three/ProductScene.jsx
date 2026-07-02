import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* Module footprints per product type (aspect + pixel density).
   - MicroLED: 192 × 192 mm square module, very fine pitch
   - Outdoor MiniLED: 320 × 160 mm (2:1), chunky pitch for billboards
   - Indoor MiniLED: 640 × 480 mm (4:3), medium pitch                      */
const MODULES = {
  microled: { width: 2.0, height: 2.0, cols: 80, rows: 80, pixelSize: 0.025 },
  outdoor:  { width: 2.6, height: 1.3, cols: 48, rows: 24, pixelSize: 0.065 },
  indoor:   { width: 2.4, height: 1.8, cols: 64, rows: 48, pixelSize: 0.038 },
};

/* ─── Animated LED Grid — breathing + wave brightness ─── */
function ScreenPixels({ width, height, cols, rows, pixelSize, gradient }) {
  const ref = useRef();
  const count = cols * rows;
  const colorA = useMemo(() => new THREE.Color(gradient[0]), [gradient]);
  const colorB = useMemo(() => new THREE.Color(gradient[1]), [gradient]);

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    const stepX = width * 0.92 / cols;
    const stepY = height * 0.92 / rows;
    for (let iy = 0; iy < rows; iy++) {
      for (let ix = 0; ix < cols; ix++) {
        const idx = iy * cols + ix;
        pos[idx * 3]     = (ix - (cols - 1) / 2) * stepX;
        pos[idx * 3 + 1] = (iy - (rows - 1) / 2) * stepY;
        pos[idx * 3 + 2] = 0.05;
        ph[idx] = Math.random() * Math.PI * 2;
      }
    }
    return { positions: pos, phases: ph };
  }, [width, height, cols, rows, count]);

  const colors = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const colAttr = ref.current.geometry.getAttribute('color');
    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const wave1 = Math.sin(t * 1.4 + x * 3.2 + y * 2.4 + phases[i] * 0.3);
      const wave2 = Math.sin(t * 0.7 - x * 1.5 + y * 3.0);
      const w = (wave1 * 0.7 + wave2 * 0.3) * 0.5 + 0.5;
      const brightness = 0.55 + w * 0.85;
      const c = colorA.clone().lerp(colorB, w);
      colAttr.setXYZ(i, c.r * brightness, c.g * brightness, c.b * brightness);
    }
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={pixelSize}
        vertexColors
        sizeAttenuation
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/* ─── The Display Unit — lit module with breathing halo ─── */
function DisplayUnit({ moduleType, gradient }) {
  const groupRef = useRef();
  const screenRef = useRef();
  const glowRef = useRef();

  const m = MODULES[moduleType] || MODULES.indoor;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.08;
    }
    const breathe = 0.7 + Math.sin(t * 1.1) * 0.25;
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = 0.35 + breathe * 0.3;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.14 + breathe * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.0} rotationIntensity={0.04} floatIntensity={0.18}>
        {/* Module frame — metallic bezel */}
        <mesh>
          <boxGeometry args={[m.width + 0.08, m.height + 0.08, 0.08]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.92} roughness={0.08} />
        </mesh>

        {/* Emissive screen surface */}
        <mesh ref={screenRef} position={[0, 0, 0.041]}>
          <planeGeometry args={[m.width, m.height]} />
          <meshStandardMaterial
            color="#09090b"
            emissive={gradient[0]}
            emissiveIntensity={0.45}
            toneMapped={false}
          />
        </mesh>

        {/* Close-range additive glow */}
        <mesh ref={glowRef} position={[0, 0, 0.042]}>
          <planeGeometry args={[m.width, m.height]} />
          <meshBasicMaterial
            color={gradient[1]}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* LED pixels */}
        <ScreenPixels
          width={m.width}
          height={m.height}
          cols={m.cols}
          rows={m.rows}
          pixelSize={m.pixelSize}
          gradient={gradient}
        />

        {/* Top bezel accent strip */}
        <mesh position={[0, m.height / 2 + 0.015, 0.042]}>
          <boxGeometry args={[m.width + 0.06, 0.015, 0.004]} />
          <meshBasicMaterial color="#BB50EE" transparent opacity={0.75} toneMapped={false} />
        </mesh>
        {/* Bottom bezel accent strip */}
        <mesh position={[0, -m.height / 2 - 0.015, 0.042]}>
          <boxGeometry args={[m.width + 0.06, 0.015, 0.004]} />
          <meshBasicMaterial color="#9D20D6" transparent opacity={0.45} toneMapped={false} />
        </mesh>
      </Float>
    </group>
  );
}

/* ─── Product Scene ─── */
export default function ProductScene({ gradient = ['#9D20D6', '#BB50EE'], moduleType = 'indoor' }) {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Canvas
        camera={{ position: [0, 0, moduleType === 'microled' ? 4 : 3.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[3, 2, 4]} intensity={1.2} color="#BB50EE" />
        <pointLight position={[-3, -1, 3]} intensity={0.5} color="#9D20D6" />
        <pointLight position={[0, 0, 2.5]} intensity={0.8} color={gradient[1]} />
        <DisplayUnit moduleType={moduleType} gradient={gradient} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.5}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
