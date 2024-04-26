import * as THREE from 'three'
import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Environment, Float, ContactShadows, OrbitControls } from '@react-three/drei'
import { LayerMaterial, Base, Depth, Noise } from 'lamina'

function useCompressedLoaders(file) {
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  // dracoLoader.setDecoderPath('../nodes_modules/three/examples/jsm/libs/draco/') // Укажите путь к декодеру Draco
  // dracoLoader.setDecoderPath('../nodes_modules/three/examples/jsm/libs/draco/versioned/decoders/1.5.5/') // Укажите путь к декодеру Draco
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/')
  dracoLoader.setDecoderConfig({ type: 'js' })
  loader.setDRACOLoader(dracoLoader)

  const [model, setModel] = useState(null) // Начальное состояние должно быть null

  useEffect(() => {
    loader.load(
      file,
      (gltf) => {
        setModel(gltf)
      },
      undefined,
      (error) => {
        console.error('An error happened during loading model:', error)
        console.error(error)
      }
    )
  }, [file])

  return model
}

export default function App() {
  const obj1 = useCompressedLoaders('/3dmeshes/compressed/car_retrod.glb')
  const obj2 = useCompressedLoaders('/3dmeshes/compressed/car_truck.glb')

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainContent obj1={obj1} obj2={obj2} />
    </Suspense>
  )
}

function MainContent({ obj1, obj2 }) {
  if (!obj1 || !obj1.scene || !obj2 || !obj2.scene) {
    return (
      <>
        <code>
          Сайт загружается... <br></br>Весит много ~ 155 Mb <br></br>Так что если у вас не подключен WiFi Прямо сейчас, <br></br>И слабый
          интернет, <br></br>То для экономии Мобильного трафика <br></br>Лучше закрыть этот сайт<br></br>А потом открыть, когда будет доступ
          к WiFi
        </code>
        <br></br>
        <br></br>
        <code>
          Loading MainContent... <br></br>It's about ~ 155 Mb <br></br>So if you have not WiFi Right now, <br></br>And weak connection
          <br></br>So better close this site <br></br>To save mobile traffic.<br></br>And open later when WiFi will be available
        </code>
      </>
    )
  }

  return (
    <Suspense fallback={<div>Loading MainContent...</div>}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 2, 7] }}>
        <OrbitControls autoRotate autoRotateSpeed={0.3} minPolarAngle={Math.PI / 10} maxPolarAngle={Math.PI / 1.8} />
        <pointLight position={[20, 20, 5]} />
        <pointLight position={[-20, -20, -5]} />
        <ambientLight intensity={0.01} />

        <group position={[0, -1.5, 0]}>
          <primitive
            castShadow
            receiveShadow
            object={obj1.scene}
            scale={1}
            position={[1, 1, 3]}
            rotation={[0, -2, 0]}
            speed={1}
            rotationIntensity={1}
            floatIntensity={1}></primitive>
          <primitive
            castShadow
            receiveShadow
            object={obj2.scene}
            scale={1}
            position={[1, 1, -3]}
            rotation={[0, -2, 0]}
            speed={1}
            rotationIntensity={1}
            floatIntensity={1}></primitive>
          <ContactShadows scale={20} blur={1} opacity={0.5} far={10} />
        </group>

        {/* We're building a cube-mapped environment declaratively.
          Anything you put in here will be filmed (once) by a cubemap-camera
          and applied to the scenes environment, and optionally background. */}
        <Environment background resolution={64}>
          <Striplight position={[10, 2, 0]} scale={[1, 3, 10]} />
          <Striplight position={[-10, 2, 0]} scale={[1, 3, 10]} />
          <mesh scale={100}>
            <sphereGeometry args={[1, 64, 64]} />
            <LayerMaterial side={THREE.BackSide}>
              <Base color="#468eb3" alpha={0.75} mode="normal" />
              <Depth colorA="#00ffff" colorB="#ff8f00" alpha={0.01} mode="normal" near={0} far={300} origin={[100, 100, 100]} />
              <Noise mapping="local" type="cell" scale={0.3} mode="softlight" />
            </LayerMaterial>
          </mesh>
        </Environment>
      </Canvas>
    </Suspense>
  )
}

function Striplight(props) {
  return (
    <mesh {...props}>
      <boxGeometry />
      <meshBasicMaterial color="white" />
    </mesh>
  )
}
