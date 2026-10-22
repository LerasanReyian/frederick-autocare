import { Suspense, useCallback, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Html, OrbitControls, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { ArrowUpRight, X } from 'lucide-react'
import servicesData from '../data/servicesData.js'

const bodySections = [
  [-1.94, 0.12, 0.75, 0.82],
  [-1.82, 0.62, 0.67, 0.96],
  [-1.52, 0.82, 0.57, 1.08],
  [-0.92, 0.86, 0.55, 1.12],
  [0.94, 0.86, 0.55, 1.12],
  [1.48, 0.8, 0.57, 1.05],
  [1.82, 0.58, 0.64, 0.92],
  [1.96, 0.08, 0.73, 0.8],
]

const cabinSections = [
  [-0.99, 0.14, 1.01, 1.12],
  [-0.83, 0.56, 1.02, 1.46],
  [-0.55, 0.7, 1.02, 1.7],
  [0.24, 0.7, 1.02, 1.7],
  [0.53, 0.62, 1.01, 1.47],
  [0.84, 0.43, 1.01, 1.12],
]

function createBodyGeometry(sections, radialSegments = 24) {
  const vertices = []
  const indices = []
  const smoothSections = []

  for (let index = 0; index < sections.length - 1; index += 1) {
    const previous = sections[Math.max(index - 1, 0)]
    const start = sections[index]
    const end = sections[index + 1]
    const next = sections[Math.min(index + 2, sections.length - 1)]

    for (let step = 0; step < 8; step += 1) {
      const t = step / 8
      const t2 = t * t
      const t3 = t2 * t
      smoothSections.push(start.map((value, field) => (
        0.5 * (
          (2 * value)
          + (-previous[field] + end[field]) * t
          + (2 * previous[field] - 5 * value + 4 * end[field] - next[field]) * t2
          + (-previous[field] + 3 * value - 3 * end[field] + next[field]) * t3
        )
      )))
    }
  }
  smoothSections.push(sections[sections.length - 1])

  smoothSections.forEach(([z, width, bottom, top]) => {
    const centerY = (bottom + top) / 2
    const halfHeight = (top - bottom) / 2
    for (let segment = 0; segment <= radialSegments; segment += 1) {
      const angle = (segment / radialSegments) * Math.PI * 2
      const sin = Math.sin(angle)
      const cos = Math.cos(angle)
      vertices.push(
        width * Math.sign(sin) * Math.abs(sin) ** 0.82,
        centerY + halfHeight * Math.sign(cos) * Math.abs(cos) ** 0.72,
        z,
      )
    }
  })

  for (let section = 0; section < smoothSections.length - 1; section += 1) {
    for (let segment = 0; segment < radialSegments; segment += 1) {
      const current = section * (radialSegments + 1) + segment
      const next = current + radialSegments + 1
      indices.push(current, next, current + 1, current + 1, next, next + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function BodyMesh({ sections, isCabin = false }) {
  const geometry = useMemo(() => createBodyGeometry(sections), [sections])

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={isCabin ? '#c31923' : '#ad0c16'}
        metalness={0.58}
        roughness={0.22}
        clearcoat={1}
        clearcoatRoughness={0.14}
      />
    </mesh>
  )
}

BodyMesh.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  isCabin: PropTypes.bool,
}

function GlassPane({ vertices }) {
  const geometry = useMemo(() => {
    const meshGeometry = new THREE.BufferGeometry()
    meshGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices.flat(), 3))
    meshGeometry.setIndex([0, 1, 2, 0, 2, 3])
    meshGeometry.computeVertexNormals()
    return meshGeometry
  }, [vertices])

  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial
        color="#182331"
        metalness={0.4}
        roughness={0.16}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

GlassPane.propTypes = {
  vertices: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
}

function Wheel({ x, z }) {
  const side = Math.sign(x)

  return (
    <group position={[x, 0.43, z]} rotation={[0, 0, side * Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.37, 0.37, 0.24, 40]} />
        <meshStandardMaterial color="#17191c" roughness={0.78} />
      </mesh>
      <mesh position={[0, -side * 0.126, 0]}>
        <cylinderGeometry args={[0.255, 0.255, 0.025, 40]} />
        <meshStandardMaterial color="#aeb5bb" metalness={0.82} roughness={0.23} />
      </mesh>
      <mesh position={[0, -side * 0.145, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.022, 8, 40]} />
        <meshStandardMaterial color="#e2e5e8" metalness={0.8} roughness={0.2} />
      </mesh>
      {Array.from({ length: 10 }, (_, index) => (
        <mesh
          key={index}
          position={[
            Math.sin((index / 10) * Math.PI * 2) * 0.13,
            -side * 0.146,
            Math.cos((index / 10) * Math.PI * 2) * 0.13,
          ]}
          rotation={[0, (index / 10) * Math.PI * 2, 0]}
        >
          <boxGeometry args={[0.025, 0.018, 0.18]} />
          <meshStandardMaterial color="#e2e5e8" metalness={0.78} roughness={0.22} />
        </mesh>
      ))}
      <mesh position={[0, -side * 0.152, 0]}>
        <cylinderGeometry args={[0.064, 0.064, 0.035, 24]} />
        <meshStandardMaterial color="#7b838a" metalness={0.7} roughness={0.28} />
      </mesh>
    </group>
  )
}

function SedanDetails() {
  const bodyPaint = '#b80f19'
  const windowTint = '#17212c'

  return (
    <>
      <BodyMesh sections={bodySections} />
      <BodyMesh sections={cabinSections} isCabin />

      {[-1, 1].map((side) => (
        <group key={side}>
          <GlassPane vertices={[
            [side * 0.686, 1.12, -0.79],
            [side * 0.725, 1.12, -0.51],
            [side * 0.725, 1.59, -0.43],
            [side * 0.588, 1.39, -0.79],
          ]} />
          <GlassPane vertices={[
            [side * 0.726, 1.12, -0.46],
            [side * 0.726, 1.12, -0.02],
            [side * 0.726, 1.61, -0.02],
            [side * 0.726, 1.61, -0.39],
          ]} />
          <GlassPane vertices={[
            [side * 0.726, 1.12, 0.03],
            [side * 0.706, 1.12, 0.48],
            [side * 0.596, 1.4, 0.48],
            [side * 0.726, 1.61, 0.03],
          ]} />
          <mesh position={[side * 0.82, 1.17, 0.7]} rotation={[0, side * 0.12, 0]} castShadow>
            <RoundedBox args={[0.22, 0.11, 0.32]} radius={0.045} smoothness={3}>
              <meshStandardMaterial color={bodyPaint} metalness={0.28} roughness={0.22} />
            </RoundedBox>
          </mesh>
          <mesh position={[side * 0.92, 1.16, 0.72]}>
            <RoundedBox args={[0.045, 0.065, 0.21]} radius={0.02} smoothness={3}>
              <meshStandardMaterial color={windowTint} metalness={0.35} roughness={0.18} />
            </RoundedBox>
          </mesh>

          {[-1.55, 1.05].map((z) => (
            <mesh key={z} position={[side * 0.867, 0.43, z]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.39, 0.024, 8, 40]} />
              <meshStandardMaterial color="#30353b" metalness={0.35} roughness={0.42} />
            </mesh>
          ))}
          {[-0.88, 0.03, 1.03].map((z) => (
            <mesh key={z} position={[side * 0.865, 0.93, z]}>
              <boxGeometry args={[0.014, 0.43, 0.018]} />
              <meshStandardMaterial color="#c7cbd0" metalness={0.35} roughness={0.35} />
            </mesh>
          ))}
          {[-0.47, 0.42].map((z) => (
            <mesh key={z} position={[side * 0.883, 1.04, z]}>
              <RoundedBox args={[0.045, 0.035, 0.21]} radius={0.012} smoothness={3}>
                <meshStandardMaterial color="#a8adb3" metalness={0.7} roughness={0.24} />
              </RoundedBox>
            </mesh>
          ))}
          <mesh position={[side * 0.868, 0.68, -0.32]}>
            <boxGeometry args={[0.018, 0.012, 0.68]} />
            <meshStandardMaterial color="#d7dade" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      ))}

      <GlassPane vertices={[
        [-0.56, 1.42, -0.86],
        [0.56, 1.42, -0.86],
        [0.63, 1.12, -1.02],
        [-0.63, 1.12, -1.02],
      ]} />
      <GlassPane vertices={[
        [-0.58, 1.45, 0.45],
        [0.58, 1.45, 0.45],
        [0.45, 1.12, 0.85],
        [-0.45, 1.12, 0.85],
      ]} />

      <mesh position={[0, 1.71, -0.16]} castShadow>
        <RoundedBox args={[1.1, 0.035, 0.63]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={bodyPaint} metalness={0.28} roughness={0.2} />
        </RoundedBox>
      </mesh>

      <mesh position={[0, 0.76, 1.925]}>
        <RoundedBox args={[1.02, 0.25, 0.045]} radius={0.055} smoothness={4}>
          <meshStandardMaterial color="#171a1e" roughness={0.38} />
        </RoundedBox>
      </mesh>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={index} position={[0, 0.68 + index * 0.027, 1.951]}>
          <boxGeometry args={[0.9, 0.009, 0.012]} />
          <meshStandardMaterial color="#9ba1a5" metalness={0.63} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.51, 1.87]}>
        <RoundedBox args={[1.28, 0.15, 0.13]} radius={0.055} smoothness={4}>
          <meshStandardMaterial color="#970811" metalness={0.45} roughness={0.29} />
        </RoundedBox>
      </mesh>
      <mesh position={[0, 0.69, 1.973]}>
        <boxGeometry args={[0.53, 0.12, 0.018]} />
        <meshStandardMaterial color="#f7f7f5" roughness={0.3} />
      </mesh>
      {[-0.68, 0.68].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.96, 1.77]} rotation={[0.08, 0, -x * 0.1]}>
            <RoundedBox args={[0.42, 0.19, 0.12]} radius={0.07} smoothness={5}>
              <meshStandardMaterial color="#dce7f0" metalness={0.35} roughness={0.16} />
            </RoundedBox>
          </mesh>
          <mesh position={[x, 0.955, 1.84]}>
            <boxGeometry args={[0.29, 0.045, 0.025]} />
            <meshStandardMaterial color="#fff5da" emissive="#fff1c2" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[x, 0.57, 1.9]}>
            <RoundedBox args={[0.27, 0.045, 0.03]} radius={0.018} smoothness={3}>
              <meshStandardMaterial color="#202328" />
            </RoundedBox>
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.77, -1.93]}>
        <RoundedBox args={[0.76, 0.16, 0.04]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#f7f7f5" roughness={0.3} />
        </RoundedBox>
      </mesh>
      <mesh position={[0, 0.53, -1.83]}>
        <RoundedBox args={[1.3, 0.15, 0.13]} radius={0.055} smoothness={4}>
          <meshStandardMaterial color="#303338" roughness={0.48} />
        </RoundedBox>
      </mesh>
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0.94, -1.77]}>
          <RoundedBox args={[0.3, 0.2, 0.09]} radius={0.065} smoothness={4}>
            <meshStandardMaterial color="#a92128" emissive="#7f1d1d" emissiveIntensity={0.12} roughness={0.3} />
          </RoundedBox>
        </mesh>
      ))}
      {[-0.82, 0.82].flatMap((x) => [
        <Wheel key={`${x}-front`} x={x} z={1.05} />,
        <Wheel key={`${x}-rear`} x={x} z={-1.55} />,
      ])}
    </>
  )
}

function ServiceHotspots({ activeServiceId, onSelect, portalRef }) {
  return (
    <Html position={[0, 1.25, 0]} center distanceFactor={7} zIndexRange={[20, 0]} portal={portalRef}>
      <div className="car-hotspot-cluster">
        {servicesData.map((service) => (
          <button
            key={service.id}
            type="button"
            className={`car-hotspot${activeServiceId === service.id ? ' is-active' : ''}`}
            style={{
              gridColumn: service.hotspotPosition[0],
              gridRow: service.hotspotPosition[1],
            }}
            aria-label={`View ${service.title}`}
            aria-pressed={activeServiceId === service.id}
            title={service.title}
            onClick={(event) => {
              event.stopPropagation()
              onSelect(service)
            }}
          >
            <span />
          </button>
        ))}
      </div>
    </Html>
  )
}

ServiceHotspots.propTypes = {
  activeServiceId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  portalRef: PropTypes.shape({ current: PropTypes.object }),
}

function CarModel({ activeServiceId, onSelect, portalRef }) {
  return (
    <group position={[0, 0, 0]} rotation={[0, -0.24, 0]}>
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <cylinderGeometry args={[2.42, 2.5, 0.09, 96]} />
        <meshStandardMaterial color="#152235" metalness={0.62} roughness={0.34} />
      </mesh>
      <mesh position={[0, 0.052, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.36, 0.018, 8, 96]} />
        <meshStandardMaterial
          color="#8f1a24"
          emissive="#690c14"
          emissiveIntensity={0.35}
          metalness={0.7}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, 0.39, 0]} castShadow receiveShadow>
        <RoundedBox args={[1.48, 0.2, 3.35]} radius={0.09} smoothness={4}>
          <meshStandardMaterial color="#26292d" roughness={0.55} />
        </RoundedBox>
      </mesh>
      <SedanDetails />
      <ServiceHotspots activeServiceId={activeServiceId} onSelect={onSelect} portalRef={portalRef} />
    </group>
  )
}

CarModel.propTypes = {
  activeServiceId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  portalRef: PropTypes.shape({ current: PropTypes.object }),
}

function CarVisualizer({ onInquire }) {
  const [activeService, setActiveService] = useState(null)
  const canvasEventSourceRef = useRef(null)
  const attachCanvas = useCallback((canvas) => {
    canvasEventSourceRef.current = canvas?.parentElement ?? null
  }, [])

  return (
    <div className="car-canvas" aria-label="Interactive 3D car and service hotspots">
      <Canvas
        shadows
        ref={attachCanvas}
        eventSource={canvasEventSourceRef}
        dpr={[1, 1.5]}
        camera={{ position: [4.35, 2.35, 5.7], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.72} />
          <hemisphereLight args={['#f4f7ff', '#142033', 1.15]} />
          <directionalLight position={[-4, 7, 5]} intensity={3.2} castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[4, 4, 1]} intensity={1.75} color="#e6edff" />
          <spotLight
            position={[-3, 6, -3]}
            angle={0.68}
            penumbra={0.8}
            intensity={24}
            color="#ffffff"
          />
          <pointLight position={[1, 3, 4]} intensity={10} color="#ffb8b8" />
          <CarModel
            activeServiceId={activeService?.id}
            onSelect={setActiveService}
            portalRef={canvasEventSourceRef}
          />
          <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={8} blur={2.8} far={4} />
          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={3}
            maxDistance={8}
            minPolarAngle={Math.PI / 3.5}
            maxPolarAngle={Math.PI / 2.05}
            autoRotate
            autoRotateSpeed={0.45}
          />
        </Suspense>
      </Canvas>
      <span className="canvas-hint">Drag to explore · Tap a point</span>
      {activeService && (
        <aside className="hotspot-card" aria-live="polite">
          <button
            className="hotspot-card-close"
            type="button"
            aria-label="Close service details"
            onClick={() => setActiveService(null)}
          >
            <X size={15} />
          </button>
          <span className="hotspot-category">{activeService.category}</span>
          <h3>{activeService.title}</h3>
          <p>{activeService.description}</p>
          <div className="hotspot-card-bottom">
            <strong>{activeService.priceEstimate}</strong>
            <button type="button" onClick={() => onInquire(activeService.title)}>
              Inquire now <ArrowUpRight size={15} />
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}

CarVisualizer.propTypes = {
  onInquire: PropTypes.func.isRequired,
}

export default CarVisualizer
