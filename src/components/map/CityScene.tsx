import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { MonitorPoint } from '../../types';

interface CitySceneProps {
  points: MonitorPoint[];
  selectedPoint: string | null;
  onPointClick: (id: string) => void;
}

function Building({ position, size, color }: { position: [number, number, number]; size: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

function MonitorPointMarker({
  point,
  isSelected,
  onClick,
}: {
  point: MonitorPoint;
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = 3 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  const color = useMemo(() => {
    switch (point.status) {
      case 'normal':
        return '#2ed573';
      case 'warning':
        return '#ffa502';
      case 'error':
        return '#ff4757';
      default:
        return '#a0aec0';
    }
  }, [point.status]);

  return (
    <group position={[point.position.lng * 10 - 121.5, 0, point.position.lat * 10 - 31.2]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <sphereGeometry args={[isSelected ? 0.5 : 0.3, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 2 : 0.5}
        />
      </mesh>
      {(isSelected || point.status !== 'normal') && (
        <Html distanceFactor={15} position={[0, 2, 0]}>
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid #00d4ff',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'white',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{point.name}</div>
            <div style={{ fontSize: '10px', opacity: 0.8 }}>
              {point.type === 'traffic' ? '交通' : point.type === 'pipeline' ? '管网' : point.type === 'environment' ? '环境' : '视频'}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function City() {
  const buildings = useMemo(() => {
    const result = [];
    const colors = ['#1e3a5f', '#2d4a6f', '#0a1628', '#132744', '#1a2744'];

    for (let i = 0; i < 50; i++) {
      const x = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 30;
      const height = 2 + Math.random() * 8;
      const width = 1 + Math.random() * 2;
      const depth = 1 + Math.random() * 2;

      result.push({
        position: [x, height / 2, z] as [number, number, number],
        size: [width, height, depth] as [number, number, number],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return result;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0a1628" />
      </mesh>

      {buildings.map((building, i) => (
        <Building key={i} {...building} />
      ))}

      <gridHelper args={[60, 30, '#00d4ff', '#0a1628']} position={[0, 0.01, 0]} />
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#2ed573" />
    </>
  );
}

export default function CityScene({ points, selectedPoint, onPointClick }: CitySceneProps) {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[20, 15, 20]} fov={60} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.2}
      />
      <Lights />
      <City />

      {points.map((point) => (
        <MonitorPointMarker
          key={point.id}
          point={point}
          isSelected={selectedPoint === point.id}
          onClick={() => onPointClick(point.id)}
        />
      ))}
    </Canvas>
  );
}
