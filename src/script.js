import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import { Uniform } from 'three'
import imageGraphic from '../static/img/ALEXSGRAPHIC.png'


export default class Sketch {
  constructor(){

    //SETS SIZES SO WE  HAVE REFRENCE 
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

    //OVERLAY IMAGE 
    this.textures = [
      new THREE.TextureLoader().load(imageGraphic)
    ]
   


    //CAMERA
    this.camera = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 0.1, 3000)
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 400;

    //ADDING CAMERA TO SCENE 
    this.scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

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
    this.material = new THREE.ShaderMaterial({
      uniforms:{
        progress: {type: "f", value: 0},
        imageGraphic: {type: "t", value: this.textures[0]}
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false,

    });

    this.geometry = new THREE.BufferGeometry()

    let particles = 512**2; 
    this.positions = new THREE.BufferAttribute(new Float32Array(particles * 3), 3);
    this.coordinates = new THREE.BufferAttribute(new Float32Array(particles * 3), 3);

    //SET POSITION OF PARTICLES 
    let index = 0;
    for (let i = 0; i < 512; i++) {
      let xPos = i - 256;
      for (let j = 0; j < 512; j++) {
        let yPos = j - 256;
        this.positions.setXYZ(index, xPos, yPos, 0);
        //OVERLAY TEXTURES
        this.coordinates.setXYZ(index, i, j, 0);
        index++;
        
      }
      
    }

    this.geometry.setAttribute("position", this.positions)
    this.geometry.setAttribute("aCoordinates", this.coordinates)
    console.log(this.positions);
    
    this.mesh = new THREE.Points( this.geometry, this.material );
    this.scene.add(this.mesh);
  }

  render(){
    this.time += 1;
    // this.mesh.rotation.x = this.time / 200;
    // this.mesh.rotation.y = this.time / 100;
    this.mesh.rotation.z = this.time / 100; 


	  this.renderer.render( this.scene, this.camera );

  
    // console.log(this.time);
    window.requestAnimationFrame(this.render.bind(this))
  }
}

new Sketch(); 