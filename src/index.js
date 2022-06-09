import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import fragmentShader from './shader.frag';
import vertexShader from './shader.vert';

/**
 * GUI Controls
 */
// import * as dat from 'dat.gui'
// const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvasLeft = document.querySelector('canvas.webgl.left')
const canvasRight = document.querySelector('canvas.webgl.right')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.IcosahedronGeometry(20, 1)
const material = new THREE.ShaderMaterial({
  uniforms: {
    envMap: { value: null },
  },
  vertexShader,
  fragmentShader,
})
// Material Props.
// material.wireframe = true
// Create Mesh & Add To Scene
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const scene2 = scene.clone(true);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth / 2,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth / 2;
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer2.setSize(sizes.width, sizes.height)
  renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.001,
  5000
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 50
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, document.body);
controls.enableDamping = true
controls.autoRotate = true
// controls.enableZoom = false
controls.enablePan = false
controls.dampingFactor = 0.05
controls.maxDistance = 1000
controls.minDistance = 30
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_PAN,
}
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvasLeft,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const renderer2 = new THREE.WebGLRenderer({
  canvas: canvasRight,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Generate PMREM
 */

function loadEnvMap() {
  console.log("starting hrd load");
  new RGBELoader()
    .setPath('./textures/')
    .load('venice_sunset_1k.hdr', texture => {
      console.log("=== loaded hdr")
      const radianceMap = pmremGenerator.fromEquirectangular(texture).texture;
      pmremGenerator.dispose();

      console.log("=== compiled pmrem")
      scene.background = radianceMap;
      material.envMap = radianceMap;
      material.uniforms.envMap.value = radianceMap;
    });

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
}
loadEnvMap();

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  //mesh.rotation.y += 0.01 * Math.sin(1)
  //mesh.rotation.y += 0.01 * Math.sin(1)
  mesh.rotation.z += 0.01 * Math.sin(1)

  // Update controls
  controls.update()
  // Render
  renderer.render(scene, camera);
  renderer2.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
