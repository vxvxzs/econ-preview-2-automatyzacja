'use client'

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  ContactShadows, 
  Environment,
} from '@react-three/drei'
import * as THREE from 'three'

type VisualizerProps = {
  roofType: string
  area: number
}

// Helper to create a grid of panels
function SolarPanels({ count, width, depth, rotation = 0 }: { count: number, width: number, depth: number, rotation?: number }) {
  const panels = useMemo(() => {
    const positions = []
    const cols = Math.ceil(Math.sqrt(count * (width / depth)))
    const rows = Math.ceil(count / cols)
    
    const spacingX = width / (cols + 1)
    const spacingZ = depth / (rows + 1)

    for (let i = 0; i < count; i++) {
      const r = Math.floor(i / cols)
      const c = i % cols
      positions.push([
        (c - (cols - 1) / 2) * spacingX,
        0.02,
        (r - (rows - 1) / 2) * spacingZ
      ])
    }
    return positions
  }, [count, width, depth])

  return (
    <group rotation={[rotation, 0, 0]}>
      {panels.map((pos, i) => (
        <mesh key={i} position={[pos[0] as number, pos[1] as number, pos[2] as number]} castShadow>
          <boxGeometry args={[0.7 * (width / 5), 0.01, 1.2 * (depth / 5)]} />
          <meshStandardMaterial 
            color="#1e3a8a" 
            metalness={0.8} 
            roughness={0.1} 
          />
        </mesh>
      ))}
    </group>
  )
}

function GroundScene() {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Base Pedestal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>

      {/* Lawn Accent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#f1f5f9" roughness={1} />
      </mesh>

      {/* Driveway Accent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7, 0.02, 3]} receiveShadow>
        <planeGeometry args={[5, 18]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>
    </group>
  )
}

function House({ roofType, area, rotationTrigger }: VisualizerProps & { rotationTrigger: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const rotationProgress = useRef(0)
  
  // Fixed dimensions for the clay model
  const houseWidth = 6
  const houseDepth = 8
  const houseHeight = 3.5

  const isSkośny = roofType === 'Skośny'
  const isPłaski = roofType === 'Płaski'
  const isGrunt = roofType === 'Grunt'

  const panelsCount = Math.max(4, Math.floor(area / 3.5))

  useFrame((state, delta) => {
    if (rotationProgress.current > 0) {
      if (groupRef.current) {
        groupRef.current.rotation.y += delta * 10
        rotationProgress.current -= delta * 10
        if (rotationProgress.current <= 0) {
          groupRef.current.rotation.y = 0
          rotationProgress.current = 0
        }
      }
    }
  })

  useEffect(() => {
    if (rotationTrigger > 0) {
      rotationProgress.current = Math.PI * 2
    }
  }, [rotationTrigger])

  return (
    <group ref={groupRef} position={isGrunt ? [0, 0, -4] : [0, 0, 0]}>
      {/* Main Building Body */}
      <mesh position={[0, houseHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[houseWidth, houseHeight, houseDepth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.05} />
      </mesh>

      {/* Decorative Recess/Windows for makieta look */}
      <mesh position={[0, houseHeight * 0.6, houseDepth / 2 + 0.01]}>
        <boxGeometry args={[houseWidth * 0.8, 1, 0.05]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </mesh>

      {/* Roof Variants */}
      {isSkośny && (
        <group position={[0, houseHeight, 0]}>
          {/* Gable Roof (Triangular Prism) */}
          <mesh rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[2.8, 2.8, houseWidth, 3]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.2} />
          </mesh>
          {/* Panels on Pitch */}
          <group position={[0, 1.4, houseDepth * 0.2]} rotation={[-Math.PI / 4, 0, 0]}>
             <SolarPanels count={panelsCount} width={houseWidth * 0.8} depth={houseDepth * 0.45} />
          </group>
        </group>
      )}

      {isPłaski && (
        <group position={[0, houseHeight, 0]}>
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[houseWidth, 0.2, houseDepth]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[houseWidth - 0.4, 0.1, houseDepth - 0.4]} />
            <meshStandardMaterial color="#f1f5f9" />
          </mesh>
          {/* Panels Flat */}
          <group position={[0, 0.2, 0]}>
            <SolarPanels count={panelsCount} width={houseWidth * 0.85} depth={houseDepth * 0.85} />
          </group>
        </group>
      )}

      {isGrunt && (
        <group position={[0, 0, 10]}>
          {/* Rack structure */}
          <mesh position={[0, 0.8, 0]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
            <boxGeometry args={[houseWidth * 1.3, 0.05, 3.5]} />
            <meshStandardMaterial color="#f1f5f9" />
          </mesh>
          {/* Support legs */}
          <mesh position={[-houseWidth * 0.6, 0.4, 0]} castShadow>
            <boxGeometry args={[0.05, 0.8, 0.05]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
          <mesh position={[houseWidth * 0.6, 0.4, 0]} castShadow>
            <boxGeometry args={[0.05, 0.8, 0.05]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
          {/* Panels on Rack */}
          <group position={[0, 1, 0]} rotation={[-Math.PI / 6, 0, 0]}>
            <SolarPanels count={panelsCount} width={houseWidth * 1.2} depth={3} />
          </group>
        </group>
      )}
    </group>
  )
}

export default function HouseVisualizer3D({ roofType, area }: VisualizerProps) {
  const [rotationTrigger, setRotationTrigger] = useState(0)
  
  // Map roofType to standard labels
  const normalizedRoofType = useMemo(() => {
    if (roofType === 'pitched') return 'Skośny'
    if (roofType === 'flat') return 'Płaski'
    if (roofType === 'ground') return 'Grunt'
    return roofType
  }, [roofType])

  // Trigger rotation on area change
  useEffect(() => {
    setRotationTrigger(prev => prev + 1)
  }, [area])

  return (
    <div className="w-full h-full min-h-[500px] bg-[#f8fafc] rounded-xl overflow-hidden relative group border border-zinc-200/50 shadow-sm">
      {/* Apple-style Technical Overlay */}
      <div className="absolute top-8 left-8 z-10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <div className="text-[11px] font-bold text-zinc-900 uppercase tracking-[0.25em]">
            Digital Twin Configurator
          </div>
        </div>
        <div className="text-[10px] font-medium text-zinc-400 bg-white shadow-sm px-4 py-2 rounded-full w-fit border border-zinc-100">
          Wariant: <span className="text-zinc-900">{normalizedRoofType}</span> | <span className="text-zinc-900">{area} m²</span>
        </div>
      </div>

      <Canvas shadows dpr={[1, 2]} camera={{ position: [14, 10, 14], fov: 30 }}>
        <color attach="background" args={['#f8fafc']} />
        
        <OrbitControls 
          enablePan={false} 
          minDistance={12} 
          maxDistance={30} 
          maxPolarAngle={Math.PI / 2.2} 
        />

        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        
        <House roofType={normalizedRoofType} area={area} rotationTrigger={rotationTrigger} />
        <GroundScene />

        <ContactShadows 
          position={[0, 0, 0]} 
          opacity={0.15} 
          scale={30} 
          blur={2.5} 
          far={10} 
        />
        
        <Environment preset="city" />
      </Canvas>

      {/* Minimalist corner guides */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-zinc-200/50 rounded-tl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-zinc-200/50 rounded-br-2xl pointer-events-none" />
    </div>
  )
}
