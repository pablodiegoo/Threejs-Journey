import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from '../../three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {console.log('onStart')}
loadingManager.onProgress = () => {console.log('onProgress')}
loadingManager.onError = () => {console.log('onError')}
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

colorTexture.minFilter = THREE.NearestFilter

// Cursor
const cursor = {
  x: 0,
  y: 0
}
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
  // console.log(cursor.x+" : "+cursor.y)
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

// Object
// const group = new THREE.Group()
// scene.add(group)

// const cube1 = new THREE.Mesh(
//   new THREE.TorusKnotGeometry(),
//   new THREE.MeshPhongMaterial({ color: 0xff0000 })
// )
// cube1.position.set(-4, 0, 0)

// const cube2 = new THREE.Mesh(
//   new THREE.TorusKnotGeometry(),
//   new THREE.MeshStandardMaterial({ color: 0x00ff00 })
// )
// cube2.position.set(0, 0, 0)

// const cube3 = new THREE.Mesh(
//   new THREE.TorusKnotGeometry(),
//   new THREE.MeshBasicMaterial({ color: 0x0000ff })
// )
// cube3.position.set(4, 0, 0)

// group.add(cube3)
// group.add(cube2)
// group.add(cube1)[

// const geometry = new THREE.Geometry()

// for (let i = 0; i < 50; i++) {
//   for (let j = 0; j < 50; j++) {
//     geometry.vertices.push(new THREE.Vector3(
//       (Math.random() - 0.5) * 4,
//       (Math.random() - 0.5) * 4,
//       (Math.random() - 0.5) * 4
//     ))
//   }
//   const verticesIndex = i * 3
//   geometry.faces.push(new THREE.Face3(
//     verticesIndex, verticesIndex + 1, verticesIndex + 2
//   ))

// }

// const face = new THREE.Face3(0, 1, 2)
// geometry.faces.push(face)



// const geometry = new THREE.BufferGeometry()
// const count = 50
// const positionsArray = new Float32Array(count*3*3)
// for(let i=0;i<count*3*3;i++){positionsArray[i]=(Math.random()-0.5)*5}
// const positionsAttribute = new THREE.BufferAttribute(positionsArray,3)
// geometry.setAttribute('position',positionsAttribute)
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


// Axes helper
const axesHelter = new THREE.AxesHelper(2)
axesHelter.position.set(-1, 0, -1)
scene.add(axesHelter)

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

// gsap.to(group.position, {duration: 1,delay: 1,x:2})
// gsap.to(group.position, {duration: 1,delay: 2,x:0})

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2)*5
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2)*5
  // camera.position.y = (cursor.y * Math.PI * 2)
  camera.lookAt(mesh.position)
  // group.rotation.x = elapsedTime
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()