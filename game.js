import * as THREE from 'three';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js";
import { process_score } from './process_score.js';
//import * as CANNON from "cannon";

document.addEventListener('DOMContentLoaded', async function () {
  const world = new CANNON.World(); // Create a Cannon.js world
  let landSet = [], ghosts = [], vatpham = [], movementSpeed = 0.03, flag = 1,disappearTime;

  async function start_game() {
    landSet = await land_random(scene);
    let inghost = await load_ghost(scene, -2.0, -0.82, -0.2);
    ghosts.push(inghost);
    vatpham = await load_vatpham(scene);

    function update() {
      world.step(1 / 60); // Step the physics world
      // vatpham.forEach(item => syncObjectWithBody(item.object, item.body));
      //syncObjectWithBody(ghost.object, ghost.body);
      renderer.render(scene, camera);
      animation_land();
      animation_vatpham();
      checkCollision();
      oneJump();
      //check();
      controls.update();
      requestAnimationFrame(update);
    }

    update();
  }
  //load_land
  async function load_land(scene, model_scale_x, model_position_x) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('./model_3d/land.glb');
    const land = gltf.scene;
    land.scale.set(model_scale_x, 1, 1);
    land.position.set(model_position_x, -1.6, 0);

    var landShape = new CANNON.Box(new CANNON.Vec3(model_scale_x, 1, 1));
    var landBody = new CANNON.Body({ mass: 0 });
    landBody.addShape(landShape);
    landBody.position.set(model_position_x, -1.6, 0);

    world.addBody(landBody);
    return { object: land, body: landBody };
  }
  //load_donut lẻ
  async function load_bomb(scene, x, y, z) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('./model_3d/donut_1.glb');
    const donut = gltf.scene;
    donut.scale.set(0.2, 0.2, 0.2);
    donut.position.set(x, y, z);
    donut.rotation.x = 2 - Math.PI / 5;

    var donutShape = new CANNON.Box(new CANNON.Vec3(0.2, 0.2, 0.2));
    var donutBody = new CANNON.Body({ mass: 0 });
    donutBody.addShape(donutShape);
    donutBody.position.set(x, y, z);

    world.addBody(donutBody);
    return { object: donut, body: donutBody, name: "donut" };
  }
  //load land_random
  async function land_random(scene) {
    let model_position_x = 7.5;
    let land_set = [];

    let initialLand = await load_land(scene, 10, 1);
    land_set.push(initialLand);
    scene.add(initialLand.object);

    for (let i = 0; i < 8; i++) {
      const model_scale_x = Math.random() * (5 - 1) + 1;
      let land = await load_land(scene, model_scale_x, model_position_x);
      land_set.push(land);
      scene.add(land.object);
      model_position_x += model_scale_x + Math.random() * (3 - 1) + 1.5;
    }
    return land_set;
  }
  //load 1 loạt vật phẩm
  async function load_vatpham(scene) {
    let items = [];
    for (let i = 0; i < landSet.length; i++) {
      let donut = await load_bomb(scene, landSet[i].object.position.x, landSet[i].object.position.y + 1.3, landSet[i].object.position.z - 0.3);
      scene.add(donut.object);
      items.push(donut);
    }
    return items;
  }
  //load_ghost
  async function load_ghost(scene, x, y, z) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('./model_3d/ghost1.glb');
    const ghost = gltf.scene;
    ghost.scale.set(0.15, 0.2, 0.15);
    ghost.position.set(x, y, z);
    ghost.rotation.y = Math.PI / 2 - 0.2;
    scene.add(ghost);

    var ghostShape = new CANNON.Box(new CANNON.Vec3(0.15, 0.2, 0.15));
    var ghostBody = new CANNON.Body({ mass: 1 });
    ghostBody.addShape(ghostShape);
    ghostBody.position.set(x, y, z);
    ghostBody.addEventListener('collide', function (event) {
      console.log("Ghost collided with:", event.body);
    });

    world.addBody(ghostBody);
    return { object: ghost, body: ghostBody };
  }

  //load ghost_big
  async function load_ghost_big(scene, x, y, z) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('./model_3d/ghost_big.glb');
    const ghost = gltf.scene;
    ghost.scale.set(0.15, 0.2, 0.15);
    ghost.position.set(x, y, z);
    ghost.rotation.y = Math.PI / 2 - 0.2;
    scene.add(ghost);

    var ghostShape = new CANNON.Box(new CANNON.Vec3(0.15, 0.2, 0.15));
    var ghostBody = new CANNON.Body({ mass: 1 });
    ghostBody.addShape(ghostShape);
    ghostBody.position.set(x, y, z);
    ghostBody.addEventListener('collide', function (event) {
      console.log("Ghost collided with:", event.body);
    });

    world.addBody(ghostBody);
    return { object: ghost, body: ghostBody };
  }
  //chuyển động 1 landSet
  function animation_land() {
    for (let i = 0; i < landSet.length; i++) {
      if (landSet[i] && landSet[i].object && landSet[i].body) {
        landSet[i].object.position.x -= movementSpeed;
        landSet[i].body.position.x -= movementSpeed;
      }
    }
  }
  //chuyển động vatphamSet
  function animation_vatpham() {
    for (let i = 0; i < vatpham.length; i++) {
      if (vatpham[i] && vatpham[i].object && vatpham[i].body) {
        vatpham[i].object.position.x -= movementSpeed;
        vatpham[i].body.position.x -= movementSpeed;
      }
    }
  }
  let isJumping = false;

  //let ghoststop = false;
  //chuyển động ma
  function animation_ghost(ghost, maxheight, speed) {
    if (!ghost || !ghost.object || !ghost.body) return;
    if (ghost.isFrozen) {
     ghost.object.position.x -= movementSpeed;
     ghost.body.position.x -= movementSpeed; // Stop animation if frozen
    }
   //nhảy lên 
    if (flag == 1) {
      if (ghost.object.position.y < maxheight) {
        ghost.object.position.y += speed;
        ghost.body.position.y += speed;
      } else {
        flag = 2;
      }
    }
    //đáp xuống tiếp tục chuyển động
    if (flag == 2) {
      if (ghost.object.position.y > -0.84) {
        ghost.object.position.y -= (speed + 0.001);
        ghost.body.position.y -= (speed + 0.001);
      } else {
        flag = 1;
        isJumping = false;
      }
    }
    
  
  }

  // kiểm tra va chạm
  /*function checkCollision() {
    if (ghosts && vatpham) {
      for (let i = 0; i < ghosts.length; i++) {
        const ghost = ghosts[i];
        const ghostBox = new THREE.Box3().setFromObject(ghost.object);
        for (let j = 0; j < vatpham.length; j++) {
          const item = vatpham[j];
          const itemBox = new THREE.Box3().setFromObject(item.object);
          if (ghostBox.intersectsBox(itemBox) && item.name == "donut") {
            console.log('Collision detected:', item);
            scene.remove(item.object);
            world.remove(item.body);
            vatpham.splice(j, 1);
            j--;
            
        
            //const newGhostPositionX = -2.0 - (ghosts.length * 0.3);
            //const newGhostPositionY = -0.82;
            //const newGhostPositionZ = -0.2;
  
            // Add new ghost
            //load_ghost(scene,newGhostPositionX,newGhostPositionY,newGhostPositionZ).then(newGhost => {
             // ghosts.push(newGhost);
           // });
          }
        }
      }
    }
  }
  */
  function checkCollision() {
    if (ghosts && vatpham) {
      for (let i = 0; i < ghosts.length; i++) {
        const ghost = ghosts[i];
        const ghostBox = new THREE.Box3().setFromObject(ghost.object);
        for (let j = 0; j < vatpham.length; j++) {
          const item = vatpham[j];
          const itemBox = new THREE.Box3().setFromObject(item.object);
          let ghostCollided = false;// Flag to track if this ghost collided with a donut
          if (ghostBox.intersectsBox(itemBox) && item.name != "chan") {
            console.log('Collision detected:', item);
            scene.remove(item.object);
            world.remove(item.body);
            vatpham.splice(j, 1);
            j--;

            if (item.name == "donut") {
              // Thiết lập vận tốc ban đầu cố định
              const initialVelocity = new THREE.Vector3(1.3, 2, 2); // Vận tốc cố định trên các trục X, Y, Z

              // Gia tốc trọng trường
              const gravity = new THREE.Vector3(0, -9.81, 0);

              // Đặt thời gian cố định để con ma bay ra
              const fixedTime = 2; // Giá trị cố định cho thời gian trôi qua (giây)

              const initialPosition = ghost.object.position.clone();

              function animate() {
                let elapsedTime = (Date.now() - startTime) / 1000; // Tính thời gian đã trôi qua bằng giây

                // Giới hạn thời gian đã trôi qua để con ma bay theo hình parabol trong một khoảng thời gian cố định
                if (elapsedTime > fixedTime) {
                  elapsedTime = fixedTime;
                }

                // Tính toán vị trí mới theo công thức của chuyển động parabol
                ghost.object.position.x = initialPosition.x + initialVelocity.x * elapsedTime;
                ghost.object.position.y = initialPosition.y + initialVelocity.y * elapsedTime + 0.5 * gravity.y * elapsedTime * elapsedTime;
                ghost.object.position.z = initialPosition.z + initialVelocity.z * elapsedTime;

                // Thêm hiệu ứng xoay
                ghost.object.rotation.x += 0.1;
                ghost.object.rotation.y += 0.1;

                // Kiểm tra nếu con ma đã rơi xuống dưới một giá trị nhất định thì xóa nó
                if (ghost.object.position.y < -10) {
                  scene.remove(ghost.object);
                  if (ghost.body) {
                    world.remove(ghost.body);
                  }
                  ghosts.splice(i, 1);
                  return;
                }

                requestAnimationFrame(animate);
              }

              // Thiết lập thời gian bắt đầu và khởi động animate
              let startTime = Date.now();
              requestAnimationFrame(animate);

              // Điều chỉnh chỉ số để tiếp tục vòng lặp chính xác
              i--;
            }
            if (item.name == " pumkin") {
              const newGhostPositionX = -2.0 - (ghosts.length * 0.3);
              const newGhostPositionY = -0.82;
              const newGhostPositionZ = -0.2;

              // Add new ghost
              load_ghost(scene, newGhostPositionX, newGhostPositionY, newGhostPositionZ).then(newGhost => {
                ghosts.push(newGhost);
              });
            }

            //if(item.name ==" big_ghost")
             // {

            //  }
          }

          if(ghostBox.intersectsBox(itemBox) && item.name === "chan")
            {
             ghostCollided = true;
            if (!ghost.isFrozen) {
              ghost.isFrozen = true; // Freeze the ghost
              setTimeout(() => {
                removeGhost(ghost); // Remove the ghost after 3 seconds
              }, 3000);
            }
              
            }
        }
      }
    }
  }
  function removeGhost(ghost) {
    scene.remove(ghost.object);
    if (ghost.body) {
      world.remove(ghost.body);
    }
    ghosts.splice(ghosts.indexOf(ghost), 1);
  }
  console.log(world)
  // ma nhảy  
  function oneJump() {
    document.addEventListener('keydown', function (event) {
      if (event.keyCode === 32 && !isJumping) {
        isJumping = true;
        flag = 1;
      }
    });
    for (let i = 0; i < ghosts.length; i++) {
      if (isJumping) animation_ghost(ghosts[i], 0.3, 0.03);
      if (!isJumping) animation_ghost(ghosts[i], -0.75, 0.005)
    }

  }

  const scene = new THREE.Scene();
  world.gravity.set(0, -9.82, 0); // Set gravity
  const dracoLoader = new DRACOLoader();
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.load('./model_3d/background_cat.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(1.5, -0.7, -1.4);
    scene.add(model);
  });

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(2, 2, 5);
  scene.add(light);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
  camera.position.set(0, 0, 4);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer();
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(0x3f1f01);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;

  const container = document.querySelector('.background-container');
  const buttonStart = document.querySelector('.button01');
  buttonStart.addEventListener('click', async function () {
    console.log("Button Start clicked!");
    container.parentNode.removeChild(container);
    try {
      await start_game();
      console.log("Game started!");
    } catch (error) {
      console.error("Error:", error);
    }
    process_score();
  });
});
