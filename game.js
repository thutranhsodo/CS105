import * as THREE from 'three';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js"
    
    const scene = new THREE.Scene();

    const dracoLoader = new DRACOLoader();
    const loader = new GLTFLoader();
    loader.setDRACOLoader( dracoLoader )

    loader.load('./model_3d/background_cat.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.2,0.2,0.2)
        model.position.set(1.5,-0.7,-1.4)
        scene.add(model);
      }
);
var path = '/model_3d/';
var format = '.jpg';

var urls = [
  path + 'pz' + format, path + 'pz' + format,
  path + 'pz' + format, path + 'pz' + format,
  path + 'pz' + format, path + 'pz' + format
];

var reflectionCube = new THREE.CubeTextureLoader().load(urls);
reflectionCube.format = THREE.RGBFormat;

scene.background = reflectionCube;
let model1= new THREE.Mesh()
var group =new THREE.Group()

loader.load('./model_3d/land.glb', (gltf) => {
  const model1 = gltf.scene;
  model1.scale.set(0.3,0.5,1)
  model1.position.set(-3,-1.1,0)
    for (let i = 0; i<10; i++)
      {
        const modelClone = model1.clone();
        modelClone.position.x+=i*0.3;
        scene.add(modelClone)
        //x+=0.3
      }  
  }
);

loader.load('./model_3d/land.glb', (gltf) => {
  const model1 = gltf.scene;
  model1.scale.set(0.3,0.5,1)
  model1.position.set(0.7,-1.1,0)
    for (let i = 0; i<10; i++)
      {
        const modelClone = model1.clone();
        modelClone.position.x+=i*0.3;
        scene.add(modelClone)
        //x+=0.3
      }  
  }
);

loader.load('./model_3d/ghost1.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.15,0.2,0.15)
  model.position.set(-2.0,-0.8,-0.2)
 // model.rotation.y=Math.PI/2
  scene.add(model);
}
);
loader.load('./model_3d/ghost2.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.15,0.2,0.15)
  model.position.set(-0.5,-0.6,0)
  model.rotation.y=Math.PI/2-0.5
  scene.add(model);
}
);
loader.load('./model_3d/ghost3.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.15,0.17,0.15)
  model.position.set(-2.3,-0.55,0.27)
  model.rotation.y=-Math.PI
  scene.add(model);
}
);
    const light = new THREE.DirectionalLight(0xffffff,1)
    light.position.set(2,2,5)
    scene.add(light)
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height,0.1,1000);
    camera.position.set(0,0.5,3)
    scene.add(camera)
    const renderer = new THREE.WebGLRenderer(
        {antialias: true}
    )

    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.shadowMap.enabled = true
    renderer.setClearColor('#333333')
    document.body.appendChild(renderer.domElement)
    
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false;

    const animate = () => {
       requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();