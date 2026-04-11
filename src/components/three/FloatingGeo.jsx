import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function GlassShape({ position, scale, speed, geo, color, opacity }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.5;
    ref.current.rotation.z = Math.cos(t * 0.3) * 0.3;
  });

  const Geo = () => {
    switch (geo) {
      case 'torus': return <torusGeometry args={[1, 0.4, 12, 32]} />;
      case 'torusKnot': return <torusKnotGeometry args={[0.8, 0.25, 64, 12]} />;
      case 'octahedron': return <octahedronGeometry args={[1, 0]} />;
      case 'icosahedron': return <icosahedronGeometry args={[1, 0]} />;
      case 'cone': return <coneGeometry args={[0.8, 1.5, 6]} />;
      default: return <dodecahedronGeometry args={[1, 0]} />;
    }
  };

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={position} scale={scale}>
        <Geo />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={opacity}
          wireframe
          distort={0.15}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

function Particles({ count = 200 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#9333EA" transparent opacity={0.4} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

export default function FloatingGeo({ variant = 'default' }) {
  const configs = useMemo(() => ({
    default: [
      { pos: [-4, 1.5, -3], scale: 0.3, speed: 0.5, geo: 'octahedron', color: '#7C3AED', opacity: 0.15 },
      { pos: [4.5, -1, -4], scale: 0.25, speed: 0.7, geo: 'icosahedron', color: '#9333EA', opacity: 0.12 },
      { pos: [-3, -2, -5], scale: 0.35, speed: 0.4, geo: 'dodecahedron', color: '#A855F7', opacity: 0.1 },
      { pos: [3, 2.5, -6], scale: 0.2, speed: 0.8, geo: 'torus', color: '#7C3AED', opacity: 0.1 },
    ],
    tech: [
      { pos: [-5, 1, -3], scale: 0.4, speed: 0.3, geo: 'torusKnot', color: '#9333EA', opacity: 0.12 },
      { pos: [5, -1.5, -4], scale: 0.3, speed: 0.6, geo: 'icosahedron', color: '#7C3AED', opacity: 0.1 },
      { pos: [0, 2.5, -5], scale: 0.25, speed: 0.5, geo: 'octahedron', color: '#A855F7', opacity: 0.15 },
      { pos: [-4, -2, -6], scale: 0.35, speed: 0.4, geo: 'cone', color: '#C084FC', opacity: 0.08 },
      { pos: [4, 2, -7], scale: 0.2, speed: 0.9, geo: 'torus', color: '#9333EA', opacity: 0.1 },
    ],
  }), []);

  const shapes = configs[variant] || configs.default;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#9333EA" />
        {shapes.map((s, i) => (
          <GlassShape key={i} position={s.pos} scale={s.scale} speed={s.speed} geo={s.geo} color={s.color} opacity={s.opacity} />
        ))}
        <Particles count={150} />
      </Canvas>
    </div>
  );
}
