import * as THREE from 'three';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js"

const container = document.querySelector('.background-container');
const button = document.querySelector('.button01'); // Assuming you want to hide on the first button click

button.addEventListener('click', () => {
  container.parentNode.removeChild(container);
  //container.classList.toggle('hidden'); // Toggle hidden class on click
  //GameScript();

  //class GameScript{
  //constructor(){

  const scene = new THREE.Scene();
  const dracoLoader = new DRACOLoader();
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader)

  function background_scene() {
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
  };

  function load_background() {
    loader.load('./model_3d/background_cat.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.2, 0.2, 0.2)
      model.position.set(1.5, -0.7, -1.4)
      scene.add(model);
    }
    );
  };


  function load_land(scene, model_scale_x, model_position_x) {
    const loader = new GLTFLoader();

    console.log(model_scale_x, model_position_x)

    loader.load('./model_3d/land.glb', (gltf) => {
      const model1 = gltf.scene;
      model1.scale.set(model_scale_x, 1, 1);
      model1.position.set(model_position_x, -1.6, 0);
      scene.add(model1)
    });
  };
  function land_random(scene) {
    let num = 3
    let model_position_x = -3
    let position_array = []
    position_array.push(model_position_x)
    for (let i = 0; i < 4; i++) {
      let model_scale_x = Math.random() * (5 - 1) + 1
      load_land(scene, model_scale_x, model_position_x)
      let position = {
        x: model_position_x,
        y: -0.2, // Bạn cần chỉ định giá trị y cho vị trí của bomb tùy theo yêu cầu của ứng dụng
        z: -0.2, // Tương tự như y, bạn cần chỉ định giá trị z tùy theo yêu cầu của ứng dụng
        //scale: model_scale_x
      };
      position_array.push(position)
      model_position_x += model_scale_x + Math.random(3 - 1) + 1.5
      console.log(model_position_x, model_scale_x)
    }
    return position_array;
  }
  function bomb(a, b, c) {
    loader.load('./model_3d/pumkin_1.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.2, 0.2, 0.2)
      model.position.set(a, b, c)
      //model.rotation.y = -Math.PI
      scene.add(model);
    }
    );
  }
  //land_random(scene)
  let positions = land_random(scene);
  positions.forEach((position) => {bomb(position.x, position.y, position.z);});
  function load_ghost_1() {
    loader.load('./model_3d/ghost1.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.15, 0.2, 0.15)
      model.position.set(-2.0, -0.8, -0.2)
      // model.rotation.y=Math.PI/2
      scene.add(model);
    }
    );
  };
  
  function load_ghost_2() {
    loader.load('./model_3d/ghost2.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.15, 0.2, 0.15)
      model.position.set(-0.5, -0.6, 0)
      model.rotation.y = Math.PI / 2 - 0.5
      scene.add(model);
    }
    );
  }
  function load_ghost_3() {
    loader.load('./model_3d/ghost3.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.15, 0.17, 0.15)
      model.position.set(-2.3, -0.55, 0.27)
      model.rotation.y = -Math.PI
      scene.add(model);
    }
    );
  }


 

  load_background();
  var a = load_ghost_1();
  var b = load_ghost_2();
  var c = load_ghost_3();
  window.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyA':
        console.log('we pressed A')
        break;
    }
  })



  background_scene();




  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(2, 2, 5)
  scene.add(light)
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
  camera.position.set(0, 0.5, 3)
  scene.add(camera)
  const renderer = new THREE.WebGLRenderer(
    { antialias: true }
  )

  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
  //}

});  
