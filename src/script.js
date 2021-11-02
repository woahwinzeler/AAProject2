import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


// // Materials

// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0xff0000)



// // Lights

// const pointLight = new THREE.PointLight(0xffffff, 0.1)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

// /**
//  * Sizes
//  */
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }



/**
 * Camera
 */
// Base camera


// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */


/**
 * Animate
 */

// const clock = new THREE.Clock()

// const tick = () =>
// {

//     const elapsedTime = clock.getElapsedTime()

//     // Update objects
//     sphere.rotation.y = .5 * elapsedTime

//     // Update Orbital Controls
//     // controls.update()

//     // Render
//     renderer.render(scene, camera)

//     // Call tick again on the next frame
// //     window.requestAnimationFrame(tick)
// // }

// tick()



export default class Sketch {
  constructor(){

    this.sizes = {
          width: window.innerWidth,
          height: window.innerHeight
      }

    //SCENE
    this.canvas = document.querySelector('canvas.webgl')
    this.scene = new THREE.Scene()

    //RENDER 
   this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //DEBUG GUI
    this.gui = new dat.GUI()  


    //CAMERA
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 2;

    //ADDING CAMERA TO SCENE 
    this.scene.add(this.camera);

    //ADJUSTS window, render, and sizes, 
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

    //render meshed objects
    this.addMesh();
    this.time = 0; 
    this.render();
  }
  
  addMesh(){
    this.geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
    this.material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.scene.add(this.mesh);
  }

  render(){
    this.time += 1;
    this.mesh.rotation.x = this.time / 2000;
    this.mesh.rotation.y = this.time / 1000;


	  this.renderer.render( this.scene, this.camera );

  
    console.log(this.time);
    window.requestAnimationFrame(this.render.bind(this))
  }
}

new Sketch(); 