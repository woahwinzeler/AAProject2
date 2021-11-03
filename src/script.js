import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import { Uniform } from 'three'


export default class Sketch {
  constructor(){

    //SETS SIZES SO WE HAVE REFRENCE 
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
      this.sizes.width = window.innerWidth
      this.sizes.height = window.innerHeight

      // Update camera
      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })  

    //render meshed objects
    this.addMesh();
    this.time = 0; 
    this.render();
  }
  
  addMesh(){
    this.geometry = new THREE.PlaneBufferGeometry( 1, 1 );
    this.material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
    this.material = new THREE.ShaderMaterial({
      uniforms:{
        progress: {type: "f", value: 0}
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide 

    });
    this.mesh = new THREE.Points( this.geometry, this.material );
    this.scene.add(this.mesh);
  }

  render(){
    this.time += 1;
    this.mesh.rotation.x = this.time / 200;
    this.mesh.rotation.y = this.time / 100;


	  this.renderer.render( this.scene, this.camera );

  
    console.log(this.time);
    window.requestAnimationFrame(this.render.bind(this))
  }
}

new Sketch(); 