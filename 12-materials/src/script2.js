import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from '../../three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const cursor = {
  x: 0,
  y: 0
}
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
})

const gui = new dat.GUI({closed: true, width: 400})
const parameters = {
  color: 0xbb3b3b,
  spin: ()=>{gsap.to(mesh.rotation,{duration:1,y: mesh.rotation.y+10})}
}
gui
  .addColor(parameters,'color')
  .onChange(()=>{material.color.set(parameters.color)})

gui
  .add(parameters,'spin')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  } else {
    document.exitFullscreen()
  }
})

// Scene
const scene = new THREE.Scene()

// Light
const light = new THREE.AmbientLight(0x606060)
const dLight = new THREE.DirectionalLight(0xffffff, 0.5)
light.add(dLight);
scene.add(light)

const geometry = new THREE.BoxBufferGeometry(2, 2, 2, 4, 4, 4)
const material = new THREE.MeshStandardMaterial({
  map: colorTexture,
});

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
gui
  .add(mesh.position, 'y')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('elevation')
gui
  .add(mesh,'visible')
gui
  .add(material, 'wireframe')




const aspRatio = sizes.width / sizes.height
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// const camera = new THREE.OrthographicCamera(-4*aspRatio,4*aspRatio,4,-4,0.1,100)
camera.position.set(0, 0, 8)
camera.lookAt(mesh.position)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()


const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  camera.lookAt(mesh.position)
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()