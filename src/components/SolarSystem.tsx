import { Suspense, useState, useRef } from "react";
import { Stars, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Sun from "./Sun";
import Planet from "./Planet";

// Import all custom textures from assets based on git history
import belizTexture from "../assets/beliz.png";
import fermanTexture from "../assets/ferman.png";
import aliTexture from "../assets/ali.png";
import nazliTexture from "../assets/nazli.png";
import adilTexture from "../assets/adil.png";
import tanjuTexture from "../assets/tanju.png";
import demirTexture from "../assets/demir.png";
import acelyaTexture from "../assets/acelya.png";

const PLANETS_DATA = [
  {
    name: "Beliz",
    color: "#A5A5A5",
    textureUrl: belizTexture,
    size: 0.5,
    distance: 10,
    orbitSpeed: 0.47,
    rotationSpeed: 0.1,
  },
  {
    name: "Ferman",
    color: "#E3BB76",
    textureUrl: fermanTexture,
    size: 0.9,
    distance: 15,
    orbitSpeed: 0.35,
    rotationSpeed: 0.08,
  },
  {
    name: "Ali Vefa",
    color: "#2271B3",
    textureUrl: aliTexture,
    size: 1,
    distance: 20,
    orbitSpeed: 0.29,
    rotationSpeed: 0.15,
  },
  {
    name: "Nazlı",
    color: "#E27B58",
    textureUrl: nazliTexture,
    size: 0.7,
    distance: 25,
    orbitSpeed: 0.24,
    rotationSpeed: 0.12,
  },
  {
    name: "Adil Hoca",
    color: "#D39C7E",
    textureUrl: adilTexture,
    size: 2.5,
    distance: 35,
    orbitSpeed: 0.13,
    rotationSpeed: 0.3,
  },
  {
    name: "Tanju",
    color: "#C5AB6E",
    textureUrl: tanjuTexture,
    size: 2.1,
    distance: 45,
    orbitSpeed: 0.09,
    rotationSpeed: 0.28,
  },
  {
    name: "Demir",
    color: "#B5E3E3",
    textureUrl: demirTexture,
    size: 1.5,
    distance: 55,
    orbitSpeed: 0.06,
    rotationSpeed: 0.2,
  },
  {
    name: "Açelya",
    color: "#4B70DD",
    textureUrl: acelyaTexture,
    size: 1.5,
    distance: 65,
    orbitSpeed: 0.05,
    rotationSpeed: 0.18,
  },
];

export default function SolarSystem() {
  const [target, setTarget] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const [selectedSize, setSelectedSize] = useState<number>(5); // Default to Sun size
  const [isZooming, setIsZooming] = useState(false);
  const controlsRef = useRef<any>(null);

  const handlePlanetClick = (_name: string, position: THREE.Vector3, size: number) => {
    setTarget(position);
    setSelectedSize(size);
    setIsZooming(true); // Trigger auto-zoom
  };

  const handleSunClick = () => {
    setTarget(new THREE.Vector3(0, 0, 0));
    setSelectedSize(15); // Large zoom out for the whole system
    setIsZooming(true);
  };

  useFrame((state) => {
    if (controlsRef.current && target) {
      // Always track the target (smoothly)
      controlsRef.current.target.lerp(target, 0.05);

      // Only force the zoom distance immediately after a click
      if (isZooming) {
        const idealDistance = selectedSize * 5;
        const currentDistance = state.camera.position.distanceTo(target);
        
        const direction = new THREE.Vector3().subVectors(state.camera.position, target).normalize();
        const zoomPosition = new THREE.Vector3().addVectors(target, direction.multiplyScalar(idealDistance));
        
        state.camera.position.lerp(zoomPosition, 0.05);

        // Once we are close to the target distance, release manual control
        if (Math.abs(currentDistance - idealDistance) < 0.2) {
          setIsZooming(false);
        }
      }

      controlsRef.current.update();
    }
  });

  return (
    <>
      <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
      
      <Suspense fallback={null}>
        <Sun onClick={handleSunClick} />
        {PLANETS_DATA.map((planet) => (
          <Planet 
            key={planet.name} 
            {...planet} 
            onClick={handlePlanetClick}
          />
        ))}
        </Suspense>

      <OrbitControls 
        ref={controlsRef}
        makeDefault 
        enablePan={false} 
        minDistance={2} 
        maxDistance={300} 
      />
    </>
  );
}
