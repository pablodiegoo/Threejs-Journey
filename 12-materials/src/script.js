import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DoubleSide, PointLight } from 'three'
import * as dat from 'dat.gui'

// Textures
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



//Objects
// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0xff0000)
// material.map = doorColorTexture;
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.7;
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide

// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture


// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.45
material.roughness = 0.65
// material.wireframe=true

gui.add(material,'metalness').min(0).max(1).step(0.0001)
// gui.add(material,'roughness').min(0).max(1).step(0.0001)

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,16,16),
    material
)

sphere.position.set(-1.5,0,0)
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1),
    material
)
plane.position.set(1.5,0,0)

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3,0.2,16,32),
    material
)

scene.add(sphere)
scene.add(plane)
scene.add(torus)


const ambientLight = new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff,0.5)
pointLight.position.set(2,3,4)
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1,1,2)
scene.add(camera)

// Axes helper
const axesHelter = new THREE.AxesHelper(2)
axesHelter.position.set(-1, 0, -1)
scene.add(axesHelter)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    // camera.lookAt(mesh.position)

    // update controls
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime
    
    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()