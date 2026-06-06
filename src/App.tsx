import { Canvas } from "@react-three/fiber";
import SolarSystem from "./components/SolarSystem";
import * as THREE from "three";
import { useState, useRef } from "react";

export default function App() {
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startExperience = () => {
    setStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black", position: "relative" }}>
      {/* Native HTML Audio */}
      <audio 
        ref={audioRef}
        src="music.mp3" 
        loop 
        style={{ display: "none" }}
      />

      {/* Entry Dialog */}
      {!started && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "'Inter', sans-serif"
        }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "2rem", letterSpacing: "0.2rem" }}>Berhayat Sistemi</h1>
          <button 
            onClick={startExperience}
            style={{
              padding: "1rem 3rem",
              fontSize: "1.2rem",
              backgroundColor: "transparent",
              color: "white",
              border: "2px solid white",
              cursor: "pointer",
              transition: "all 0.3s ease",
              borderRadius: "4px"
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "white", e.currentTarget.style.color = "black")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent", e.currentTarget.style.color = "white")}
          >
            Başla!
          </button>
          <p style={{ marginTop: "2rem", opacity: 0.6 }}>Mucize Doktor evrenini keşfet!</p>
        </div>
      )}
      
      <Canvas
        shadows
        camera={{ position: [0, 50, 120], fov: 45 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
      >
        <ambientLight intensity={0.4} />
        <hemisphereLight 
          intensity={0.3} 
          color="#ffffff" 
          groundColor="#000000" 
        />
        <SolarSystem />
      </Canvas>
    </div>
  );
}
