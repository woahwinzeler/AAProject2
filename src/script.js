
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import imageGraphic from '../static/img/ALEXSGRAPHIC.png'
import paintingGraphic from '../static/img/Painting.png'
import purplePaintingGraphic from '../static/img/PurplePainting.png'
import './style.css'



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

    //IMAGE 

    this.textures = [
      new THREE.TextureLoader().load(imageGraphic),
      new THREE.TextureLoader().load(paintingGraphic),
      new THREE.TextureLoader().load(purplePaintingGraphic)
    ]
   


    //CAMERA
    this.camera = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 0.1, 3000)
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 400;

    //ADDING CAMERA TO SCENE 
    this.scene.add(this.camera);

    //USER CONTROLS
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    //ADJUSTS window, render, and sizes 
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
    // this.addPaintingMesh();
    this.time = 0; 

    const loader = new THREE.FontLoader();

    loader.load( '/fonts/gentilis_bold.typeface.json', function ( font ) {

    this.textgeometry = new THREE.TextGeometry( 'Hello three.js!', {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      } );
    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

    var mesh = new THREE.Mesh( this.textgeometry, textMaterial );
    mesh.position.set( 100, 100, 100 );

    this.scene.add( mesh );



    //window.requestAnimationFrame runs in here, allowing for rotation
    //this is also where we handle any re-renders
    this.step = 1000;
    this.addMesh();
    this.render();


    this.paintingRendered = false;

    //toggles between renderings 
    window.addEventListener('keydown', (e) =>{
        if (e.code === 'ArrowUp'){
          if(!this.paintingRendered){
            //Rendering
            this.removeMesh();
            this.addPaintingMesh();

            //toggles
            this.paintingRendered = true;
          } else {
             //Rendering
              this.removePaintingMesh();
              this.addMesh();

              this.paintingRendered = false;
          }

        } else if (e.code === 'ArrowDown'){
          if (this.paintingRendered){
            //Rendering
            this.removePaintingMesh();
            this.addMesh();

            this.paintingRendered = false;
          } else {
            //Rendering
            this.removeMesh();
            this.addPaintingMesh();

            this.paintingRendered = true;
          }

        } else if (e.code === 'ArrowLeft'){
          this.step += 50;
        } else if (e.code === 'ArrowRight'){
          this.step -= 50; 
        } else {
          console.log(e.code)
        }
      });
  }
  
  //Wheel Mesh
  addMesh(offset=0){

    //MATERIAL 
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

    //The code from here to line 117 can be done more simply if you don't use glsl 

    this.geometry = new THREE.BufferGeometry();

    let particles = 512**2; 
    this.positions = new THREE.BufferAttribute(new Float32Array(particles * 3), 3);
    this.coordinates = new THREE.BufferAttribute(new Float32Array(particles * 3), 3);

    //SET POSITION OF PARTICLES 
    let index = 0;
    for (let i = 0; i < 512; i++) {
      let xPos = i - 256 + offset;
      for (let j = 0; j < 512; j++) {
        let yPos = j - 256 + offset;
        this.positions.setXYZ(index, xPos, yPos, 0);
        //OVERLAY TEXTURES
        this.coordinates.setXYZ(index, i, j, 0);
        index++;
        
      }
      
    }

    this.geometry.setAttribute("position", this.positions)
    this.geometry.setAttribute("aCoordinates", this.coordinates)
    
    this.mesh = new THREE.Points( this.geometry, this.material );
    this.mesh.callback = function() { console.log( this.name ); }
    this.scene.add(this.mesh);
    this.mesh.position.z += offset;
    // this.mesh.position.x += offset;
    // this.mesh.position.y += offset;
  }

  //Remove Wheel Mesh
  removeMesh(){
    this.geometry.dispose();
    this.material.dispose();
    this.scene.remove(this.mesh);
  }

  removePaintingMesh(){
    this.PaintingGeometry.dispose();
    this.PaintingMaterial[0].dispose();
    this.PaintingMaterial[1].dispose();
    
    this.scene.remove(this.PaintingMesh);
    this.scene.remove(this.PaintingMeshBack);
  }

  addPaintingMesh(){
    this.PaintingMaterial= [new THREE.MeshBasicMaterial({map: this.textures[1], side: THREE.FrontSide, transparent: true}), 
    new THREE.MeshBasicMaterial({map: this.textures[2], side: THREE.BackSide, transparent: true})]
    
    this.PaintingGeometry = new THREE.PlaneBufferGeometry(1250, 1000);

    this.PaintingMesh = new THREE.Mesh(this.PaintingGeometry, this.PaintingMaterial[0]);
    this.PaintingMeshBack = new THREE.Mesh(this.PaintingGeometry, this.PaintingMaterial[1]);

    this.scene.add(this.PaintingMesh);
    this.scene.add(this.PaintingMeshBack);
  }


  render(){
    this.time += 1;

    this.mesh.rotation.z = this.time / this.step; 

	  this.renderer.render( this.scene, this.camera );

    this.requestId = window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch(); 