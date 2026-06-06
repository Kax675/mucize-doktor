import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, shaderMaterial, useTexture } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

const AtmosphereMaterial = shaderMaterial(
  { uColor: new THREE.Color("#ffffff") },
  `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  uniform vec3 uColor;
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
    gl_FragColor = vec4(uColor, intensity);
  }
  `
);

extend({ AtmosphereMaterial });

interface PlanetProps {
  name: string;
  color: string;
  size: number;
  distance: number;
  orbitSpeed: number;
  rotationSpeed: number;
  textureUrl?: string;
  onClick: (name: string, position: THREE.Vector3, size: number) => void;
}

export default function Planet({ name, color, size, distance, orbitSpeed, rotationSpeed, textureUrl, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Note: Textures are handled by user now, keeping the hook but respecting their setup
  const texture = textureUrl ? useTexture(textureUrl) : null;

  const SLOW_FACTOR = 0.2;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orbitRef.current) orbitRef.current.rotation.y = t * orbitSpeed * SLOW_FACTOR;
    if (meshRef.current) meshRef.current.rotation.y = t * rotationSpeed;
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (meshRef.current) {
      const worldPosition = new THREE.Vector3();
      meshRef.current.getWorldPosition(worldPosition);
      onClick(name, worldPosition, size);
    }
  };

  return (
    <group ref={orbitRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.05, distance + 0.05, 128]} />
        <meshBasicMaterial color="white" opacity={0.03} transparent side={THREE.DoubleSide} />
      </mesh>

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[distance, 0, 0]}>
          <mesh 
            ref={meshRef} 
            castShadow 
            receiveShadow
            onPointerDown={handlePointerDown}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <sphereGeometry args={[size, 64, 64]} />
            <meshStandardMaterial 
              map={texture}
              color={texture ? "white" : color} 
              roughness={0.8} 
              metalness={0.1}
              emissive={hovered ? color : "black"}
              emissiveIntensity={hovered ? 0.2 : 0}
            />
          </mesh>
          
          <mesh scale={[1.15, 1.15, 1.15]}>
            <sphereGeometry args={[size, 64, 64]} />
            {/* @ts-ignore */}
            <atmosphereMaterial 
              uColor={new THREE.Color(color)} 
              transparent 
              side={THREE.BackSide} 
              blending={THREE.AdditiveBlending}
              opacity={0.4}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}
