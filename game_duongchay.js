import * as THREE from 'three';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js"





var landBoxArray = new Array();
var ghostBoxArray = new Array();

//function load_land load một khối đường chạy với vị trí và độ dài được truyền vào
async function load_land(scene, model_scale_x, model_position_x) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync('./model_3d/land.glb');
  const land = gltf.scene;
  land.scale.set(model_scale_x, 1, 1);
  land.position.set(model_position_x, -1.6, 0);

  //thêm land vào box
  var landBox = new THREE.Box3();
  landBox.setFromObject(land);
  landBoxArray.push(landBox);

  return land; 
}

//Tạo đường chạy
async function land_random(scene)
{
  let num =4
  let model_position_x=7.5
  let land_set=[]

  let land = await load_land(scene, 10, 1)
  land_set.push(land)
  scene.add(land)

  for (let i = 0; i < 8; i++) {
    const model_scale_x = Math.random() * (5 - 1) + 1;
    let land = await load_land(scene, model_scale_x, model_position_x);
    land_set.push(land)
    scene.add(land)
    model_position_x += model_scale_x + Math.random() * (3 - 1) + 1.5;
  }
  return land_set
}

//tải ghost và thêm ghost vào box
async function load_ghost(scene)
{
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync('./model_3d/ghost1.glb');
  const ghost = gltf.scene;


  ghost.scale.set(0.15,0.2,0.15)
  ghost.position.set(-2.0,-0.82,-0.2)
  ghost.rotation.y=Math.PI/2-0.2

  scene.add(ghost)

  var ghostBox = new THREE.Box3();
  ghostBox.setFromObject(ghost);
  ghostBoxArray.push(ghostBox);

  return ghost; 
}

//cho đường chạy chuyển động
function animation_land()
{
  for (let i = 0; i < landSet.length; i++) 
    {
      landSet[i].position.x -= movementSpeed ;
    }
}

// cho ghost chuyển động (maxheight và speed lớn thì ghost nhảy)
function animation_ghost(maxheight, speed)
{
  if (flag==1)
    {
      if (ghost.position.y<maxheight ) 
        {ghost.position.y +=speed}
      else flag=2
    }
  else if (flag==2)
    {
      if (ghost.position.y>-0.84)
        ghost.position.y-=(speed+0.001)
      else { flag=1; isJumping=false}
    }
}

let isJumping=false

//Nhận dữ liệu từ bàn phím, nếu nhấn space thì ghost nhảy
function oneJump()
{
  document.addEventListener('keydown', function(event) 
  {
    if (event.keyCode === 32 ) { isJumping = true; flag=1}
  });
  if (isJumping)
    animation_ghost(0.3, 0.03)
  if (!isJumping) animation_ghost(-0.75, 0.005);
}

function update(renderer, scene, camera,controls)
{
  renderer.render(scene, camera);
  animation_land();
  //animation_ghost();
  oneJump();
  controls.update()
    requestAnimationFrame(function()
    {
        update(renderer,scene,camera,controls);
    }
)
}

const scene = new THREE.Scene();

const dracoLoader = new DRACOLoader();
const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader )

loader.load('./background_cat.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2,0.2,0.2)
    model.position.set(1.5,-0.7,-1.4)
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
    camera.position.set(0,0,4)
    scene.add(camera)
    var renderer= new THREE.WebGLRenderer();

    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.shadowMap.enabled = true
    renderer.setClearColor(0x3f1f01)
    document.body.appendChild(renderer.domElement)
    
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false;


    const landSet = await land_random(scene);
    const ghost = await load_ghost(scene);
    let movementSpeed = 0.03;
    var flag = 1 
    //setInterval(animation_ghost, 20);

    update(renderer, scene, camera,controls)
