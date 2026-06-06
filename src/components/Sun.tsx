import * as THREE from "three";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import sunTexturePath from "../assets/gunes.png";

const HaloMaterial = shaderMaterial(
  {
    uTexture: null,
    uTime: 0,
  },
  `
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  uniform sampler2D uTexture;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
    
    float blurOffset = 0.05; 
    vec4 texColor = texture2D(uTexture, vUv);
    texColor += texture2D(uTexture, vUv + vec2(blurOffset, 0.0));
    texColor += texture2D(uTexture, vUv - vec2(blurOffset, 0.0));
    texColor += texture2D(uTexture, vUv + vec2(0.0, blurOffset));
    texColor += texture2D(uTexture, vUv - vec2(0.0, blurOffset));
    texColor /= 5.0;
    
    gl_FragColor = vec4(texColor.rgb, intensity * 0.7);
  }
  `
);

extend({ HaloMaterial });

export default function Sun({ onClick }: { onClick: () => void }) {
  const texture = useTexture(sunTexturePath);
  const haloRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (haloRef.current) {
      haloRef.current.uTime = clock.getElapsedTime();
    }
  });

  return (
    <group onPointerDown={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial map={texture} /> 
      </mesh>
      
      <mesh scale={[1.4, 1.4, 1.4]}>
        <sphereGeometry args={[5, 64, 64]} />
        {/* @ts-ignore */}
        <haloMaterial 
          ref={haloRef}
          uTexture={texture}
          transparent 
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      <pointLight intensity={1500} distance={1000} decay={1.5} castShadow />
    </group>
  );
}
