import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import './style.css'
import { FontLoader } from 'three'


/* scenes */
const scene=new THREE.Scene()
const gui=new dat.GUI()

/* canvas */
const canvas=document.getElementById('webgl')

/* textures */
const textureLoader = new THREE.TextureLoader()
const particleTexture=textureLoader.load('/textures/particles/9.png')

/* variables */
let size={
width:window.innerWidth,
height:window.innerHeight
}

window.addEventListener('resize',()=>{
    size.width=window.innerWidth
    size.height=window.innerHeight

    camera.aspect=size.width/size.height
    camera.updateProjectionMatrix()

    renderer.setSize(size.width,size.height)
    renderer.setPixelRatio(Math.min(devicePixelRatio,2))
})
window.addEventListener('dblclick',e=>{
    if(!document.fullscreenElement)
    {
        canvas.requestFullscreen()
    }
    else
    {
        document.exitFullscreen()
    }
})

/* text related */
let textMesh,text
const textMaterial=new THREE.MeshNormalMaterial()
textMaterial.wireframe=false
const textLoader=new THREE.FontLoader()
// textLoader.load('/fonts/helvetiker_regular.typeface.json',(font)=>{
textLoader.load('/fonts/saurav.json',(font)=>{
    console.log(font)
    text=new THREE.TextBufferGeometry("Saurav's World ",
    {
        font:font,
        size:1.2,
        height:0.7,
        curveSegments:5,
        bevelEnabled:true,
        bevelOffset:0,
        bevelSegments:2,
        bevelThickness:0.03,
        bevelSize:0.02

    })
    text.center()
    textMesh=new THREE.Mesh(text,textMaterial)
    scene.add(textMesh)  
})
const material=new THREE.MeshNormalMaterial()
const boxGeometry=new THREE.BoxBufferGeometry(1,1,1)
const torusGeometry=new THREE.TorusBufferGeometry(0.5,0.5,32,10,6.3)
const count=500
let box
let torus
let boxGroup=new THREE.Group()
let torusGroup=new THREE.Group()
for(let i=0;i<count;i++)
{
    box=new THREE.Mesh(boxGeometry,material)
    torus=new THREE.Mesh(torusGeometry,material)
    let random=Math.abs(Math.random()-0.2)
    let scale=Math.abs(random-0.15)
    box.scale.set(scale,scale,scale)
    torus.scale.set(scale,scale,scale)
    box.position.set(
        (Math.random()-0.5)*40,
        (Math.random()-0.5)*35,
        (Math.random()-0.5)*30
    )
    torus.position.set(
        (Math.random()-0.5)*30,
        (Math.random()-0.5)*35,
        (Math.random()-0.5)*40
    )
    box.rotation.x=Math.PI*Math.random()
    torus.rotation.x=Math.PI*Math.random()
    box.rotation.y=Math.PI*Math.random()
    torus.rotation.y=Math.PI*Math.random()
    // box.rotation.z=Math.PI*Math.random()
    // torus.rotation.z=Math.PI*Math.random()
    boxGroup.add(box)
    torusGroup.add(torus)
}
scene.add(boxGroup,torusGroup)
// gui.add(text,'bevelSegments').min(0).max(5).step(0.05)
// gui.add(text,'bevelSize').min(0).max(5).step(0.001)
// gui.add(text,'bevelThickness').min(0).max(5).step(0.001)
// gui.add(text,'curveSegments').min(0).max(20).step(0.5)
// gui.add(text,'size').min(0).max(5).step(0.001)
// gui.add(text,'height').min(0).max(5).step(0.001)
// gui.add(text,'bevelEnabled')
gui.add(textMaterial,'wireframe')
/* controls */

/* particles */
const particleGeometry=new THREE.BufferGeometry()
const particleCount=1000
const vertices=new Float32Array(particleCount*3)
const colors=new Float32Array(particleCount*3)
for(let i=0;i<particleCount*3;i++)
{
    vertices[i]=(Math.random()-0.5)*30
    colors[i]=Math.random()
}
particleGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3))
particleGeometry.setAttribute( 'color',new THREE.Float32BufferAttribute(colors,3))
const particleMaterial=new THREE.PointsMaterial({
    size:0.5,
    sizeAttenuation:true
})
particleMaterial.transparent=true
particleMaterial.alphaMap=particleTexture
particleMaterial.depthWrite=false
particleMaterial.vertexColors=true
particleMaterial.blending=THREE.AdditiveBlending
const particle=new THREE.Points(particleGeometry,particleMaterial)
scene.add(particle)

/* camera */
const camera=new THREE.PerspectiveCamera(75,size.width/size.height,0.1,100)
camera.position.set(0,0,5)
scene.add(camera)
const controls=new OrbitControls(camera,canvas)
controls.enableDamping=true
/* renderer */
const renderer=new THREE.WebGLRenderer({
    canvas:canvas
})
const parameters={}
parameters.color=0x000000
renderer.setSize(size.width,size.height)
renderer.setClearColor(parameters.color)
gui.addColor(parameters,'color').onChange(()=>{
    renderer.setClearColor(parameters.color)})

const time=new THREE.Clock()
// let prevTime=0
const animate=()=>
{
//     if(mouseMove)
// {
//     console.log('mouse moved')
//     mouseMove=
// }
// else
// {
//     console.log('mouse stopped')
// }
    const ellapsedTime=time.getElapsedTime()

    /* controls */
    controls.update()

    /* camera */
    if(textMesh)
    {
    textMesh.rotation.z=Math.sin(ellapsedTime)
    // textMesh.rotation.x=Math.cos(ellapsedTime)
    camera.lookAt(textMesh.position)
    }
    
   boxGroup.rotation.x=Math.PI*ellapsedTime*0.08
   torusGroup.rotation.y=Math.PI*ellapsedTime*0.08
    // if(!window.addEventListener('mousemove',()=>{
        
    // }))
    camera.position.x=Math.sin(ellapsedTime)*5
    // camera.position.y=Math.cos(ellapsedTime)*5
    camera.lookAt(new THREE.Vector3(0,0,0))
    /* renderer */
    renderer.render(scene,camera)

    window.requestAnimationFrame(animate)
}
animate()