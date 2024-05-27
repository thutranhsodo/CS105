import * as THREE from 'three';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js";
//import * as CANNON from "cannon";
import { process_score } from './process_score.js';
import { updateGhostCountDisplay } from './quantity_ghost.js';
import { quantity_ghost } from './quantity_ghost.js';

document.addEventListener('DOMContentLoaded', async function () {

  let landSet = [], ghosts = [], oldghosts = [], vatpham = [], movementSpeed = 0.03, flag = 1, disappearTime, ghostspecialActive = false;

  async function start_game() {
    landSet = await land_random(scene);
    let inghost = await load_ghost(scene, -2.0, -0.82, -0.2);
    ghosts.push(inghost);
    scene.add(inghost);
 
    let ing = await load_ghost(scene, -2.3, -0.82, -0.2);
    ghosts.push(ing);
    scene.add(ing);
    
    vatpham = await load_vatpham(scene);

    function update() {
 
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

    land.traverse(function (child) {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;  // Enable shadow casting
      }
  });
    land.receiveShadow=true;
    
    return land;
  }
  //load_donut lẻ
  async function load_bomb(scene, x, y, z) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('./model_3d/donut_1.glb');
    const donut = gltf.scene;
    donut.scale.set(0.2, 0.2, 0.2);
    donut.position.set(x, y, z);
    donut.rotation.x = 2 - Math.PI / 5;

    donut.traverse(function (child) {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;  // Enable shadow casting
      }
  });
    
    return { object: donut,  name: "donut" };
  }
  //load_donut_special
  async function load_bomb_special(scene, x, y, z) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('./model_3d/donut_special.glb');
    const donut = gltf.scene;
    donut.scale.set(0.2, 0.2, 0.2);
    donut.position.set(x, y, z);
    donut.rotation.x = 2 - Math.PI / 5;

    donut.traverse(function (child) {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;  // Enable shadow casting
      }
  });
    donut.receiveShadow = true;
    
    return { object: donut, name: "donut_special" };
  }
  //load land_random
  async function land_random(scene) {
    let model_position_x = 7.5;
    let land_set = [];

    let initialLand = await load_land(scene, 10, 1);
    land_set.push(initialLand);
    scene.add(initialLand);

    for (let i = 0; i < 8; i++) {
      const model_scale_x = Math.random() * (5 - 1) + 1;
      let land = await load_land(scene, model_scale_x, model_position_x);
      land_set.push(land);
      scene.add(land);
      model_position_x += model_scale_x + Math.random() * (3 - 1) + 1.5;
    }
    return land_set;
  }
  //load 1 loạt vật phẩm
  async function load_vatpham(scene) {
    let items = [];
    let donut;
    for (let i = 0; i < landSet.length; i++) {
      if (i % 2 == 0) { donut = await load_bomb(scene, landSet[i].position.x, landSet[i].position.y + 1.3, landSet[i].position.z - 0.3); }
      else { donut = await load_bomb_special(scene, landSet[i].position.x, landSet[i].position.y + 1.3, landSet[i].position.z - 0.3); }
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
    //scene.add(ghost);
    return ghost;
  }

  //load ghost_big
  async function load_ghost_big(scene, x, y, z) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('./model_3d/ghost_big.glb');
    const ghost = gltf.scene;
    ghost.scale.set(0.075, 0.05, 0.075);
    ghost.position.set(x, y, z);
    ghost.rotation.y = Math.PI / 2 - 0.2;
    //scene.add(ghost);

    
    return ghost;
  }
  //chuyển động 1 landSet
  function animation_land() {
    for (let i = 0; i < landSet.length; i++) {
      if (landSet[i] ) {
        landSet[i].position.x -= movementSpeed;
        
      }
    }
  }
  //chuyển động vatphamSet
  function animation_vatpham() {
    for (let i = 0; i < vatpham.length; i++) {
      if (vatpham[i] && vatpham[i].object) {
        vatpham[i].object.position.x -= movementSpeed;
      
      }
    }
  }
  let isJumping = false;

  //let ghoststop = false;
  //chuyển động ma
  function animation_ghost(ghost, maxheight, speed) {
    //if (!ghost || !ghost.object ) return;
    
    if (ghost.isFrozen) {
      ghost.position.x -= movementSpeed; // Stop animation if frozen
    }
    //nhảy lên 
    if (flag == 1) {
      if (ghost.position.y < maxheight) {
        ghost.position.y += speed;
      } else {
        flag = 2;
      }
    }
    //đáp xuống tiếp tục chuyển động
    if (flag == 2) {
      if (ghost.position.y > -0.84) {
        ghost.position.y -= (speed + 0.001);
     
      } else {
        flag = 1;
        isJumping = false;
      }
    }
  }

  let ghostCount = ghosts.length;

  function checkCollision() {
    if (ghosts && vatpham) {
      for (let i = 0; i < ghosts.length; i++) {
        const ghost = ghosts[i];
        if (ghost.isRemoving) continue; // Skip if ghost is being removed

        const ghostBox = new THREE.Box3().setFromObject(ghost);
        for (let j = 0; j < vatpham.length; j++) {
          const item = vatpham[j];
          const itemBox = new THREE.Box3().setFromObject(item.object);
          if (ghostBox.intersectsBox(itemBox) && item.name !== "chan") {
            console.log('Collision detected:', item);
            //vật phẩm biến mất
            scene.remove(item.object);
            vatpham.splice(j, 1);
            j--;

            //đụng bomb thì ma bị out 
            if (!ghostspecialActive && item.name === "bomb") {
              // Flag the ghost for removal
              ghost.isRemoving = true;
              animateGhostRemoval(ghost);
              i--; // Adjust index to account for removal
              ghostCount = ghosts.length;
              updateGhostCountDisplay(ghostCount);
              break;
            }

            //đụng vật phẩm thì ma tăng thêm
            if (item.name === "donut") {
              if (!ghostspecialActive) {
                const newGhostPositionX = -2.0 - (ghosts.length * 0.3);
                const newGhostPositionY = -0.82;
                const newGhostPositionZ = -0.2;

                // Add new ghost
                load_ghost(scene, newGhostPositionX, newGhostPositionY, newGhostPositionZ).then(newGhost => {
                  ghosts.push(newGhost);
                  scene.add(newGhost);
                  ghostCount = ghosts.length;
                  updateGhostCountDisplay(ghostCount);
                });
              }
            }
            /* đang xử lý
            if (item.name == "donut_special") {
              if (!ghostspecialActive) {
                ghostspecialActive = true;
                oldghosts = [...ghosts];
                for (let j = 0; j < ghosts.length; j++) {
                  
                  scene.remove(ghosts[j].object);
                  if (ghosts[j].body) { 
                    world.remove(ghosts[j].body); 
                  }
                  ghosts.splice(j, 1);
                  j--;
              }
             // ghosts = [];
              load_ghost_big(scene, -2.0, -0.82, -0.2).then(specialGhost => {
                ghosts.push(specialGhost);
                scene.add(specialGhost.object);
                
               // world.addBody(specialGhost.body);
                setTimeout(() => {
                  scene.remove(specialGhost.object);
                  if (specialGhost.body) {
                    world.remove(specialGhost.body);
                  }
                  if (ghosts.length == oldghosts.length) ghosts = oldghosts;
                  for (let k = 0; k < ghosts.length; k++) {
                    scene.add(ghosts[k].object);
                    if (ghosts[k].body) {
                      world.add(ghosts[k].body);
                    }
                  }
                  ghostspecialActive = false;
                }, 10000);

              });
            }
          }*/
        }
        if (ghostspecialActive && ghostBox.intersectsBox(itemBox)) {
          if (item.name === "donu") {
            const newGhostPositionX = -2.0 - (oldghosts.length * 0.3);
            const newGhostPositionY = -0.82;
            const newGhostPositionZ = -0.2;
            load_ghost(scene, newGhostPositionX, newGhostPositionY, newGhostPositionZ).then(newGhost => {
              oldghosts.push(newGhost);
             
              
            });
          }
        
          // Skip removal of special ghost on "chan" and "bomb"
          //if (item.name ==="chan")
          //  {

           // }
      }
          //ma bị chặn lại
          if (!ghostspecialActive && ghostBox.intersectsBox(itemBox) && item.name === "chan") {
            if (!ghost.isFrozen) {
              ghost.isFrozen = true;
              setTimeout(() => {
                removeGhost(ghost);
              }, 3000);
            }
          }
          // special ma
          if(ghostspecialActive && ghostBox.intersectsBox(itemBox) && item.name === "chan")
            {
              if (!ghost.isFrozen) {
                ghost.isFrozen = true;
                setTimeout(() => {
                  removeGhost(ghost);
                }, 3000);
              }
            }
        }
      }
    }
  }
  
  function animateGhostRemoval(ghost) {
    // Fixed initial velocity and gravity
    const initialVelocity = new THREE.Vector3(1.3, 2, 2);
    const gravity = new THREE.Vector3(0, -9.81, 0);
    const fixedTime = 2;
    const initialPosition = ghost.position.clone();

    function animate() {
      let elapsedTime = (Date.now() - startTime) / 1000;
      if (elapsedTime > fixedTime) elapsedTime = fixedTime;

      ghost.position.x = initialPosition.x + initialVelocity.x * elapsedTime;
      ghost.position.y = initialPosition.y + initialVelocity.y * elapsedTime + 0.5 * gravity.y * elapsedTime * elapsedTime;
      ghost.position.z = initialPosition.z + initialVelocity.z * elapsedTime;

      ghost.rotation.x += 0.1;
      ghost.rotation.y += 0.1;

      if (ghost.position.y < -10) {
        removeGhost(ghost);
      } else {
        requestAnimationFrame(animate);
      }
    }

    let startTime = Date.now();
    requestAnimationFrame(animate);
  }

  function removeGhost(ghost) {
    scene.remove(ghost);
  
    const index = ghosts.indexOf(ghost);
    if (index > -1) ghosts.splice(index, 1);
  }


  // ma nhảy  
  function oneJump() {
    document.addEventListener('keydown', function (event) {
      if (event.keyCode === 32 && !isJumping) {
        isJumping = true;
        flag = 1;
      }
    });
    for (let i = 0; i < ghosts.length; i++) {
      if (isJumping) animation_ghost(ghosts[i], 0.8, 0.03);
      if (!isJumping) animation_ghost(ghosts[i], -0.75, 0.005)
    }

  }

  const scene = new THREE.Scene();

  const dracoLoader = new DRACOLoader();
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.load('./model_3d/background_cat.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(1.5, -0.7, -1.4);
    scene.add(model);
  });

  //const light = new THREE.DirectionalLight(0xffffff, 1);
  //light.position.set(2, 2, 5);
  //scene.add(light);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  function getSphere(size) {
    var sphereGeometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshStandardMaterial({
        color: 0xFDC554,
        emissive: 0xFDC554,
        emissiveIntensity: 2,
    });
    var sphere = new THREE.Mesh(sphereGeometry, material);
    sphere.castShadow = true;
    return sphere;
}
  var sphere = getSphere(0.3);
  sphere.position.x = 2.5;
  sphere.position.y = 1.5;
  sphere.position.z = -2;
  scene.add(sphere);

  var pointLight = new THREE.PointLight(0xffffff, 0.5, 50);
  pointLight.position.set(0, 0, 0); // Position the light at the center of the sphere
  sphere.add(pointLight);
  
  var light= new THREE.DirectionalLight(0xffffff,1.5);
  light.position.set(2, 2, 2);
  //light.position.y = 10;
  light.castShadow = true;

  light.shadow.camera.near = 0.1; // Adjust near plane
  light.shadow.camera.far = 25; // Adjust far plane
  light.shadow.camera.fov = 30; // Adjust field of view for spot light
  scene.add(light)

    light.shadow.camera.near = 0.1; // Adjust near plane
    light.shadow.camera.far = 25; // Adjust far plane
    light.shadow.camera.fov = 30; // Adjust field of view for spot light
    scene.add(light)
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
  camera.position.set(0, 0, 4);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use a softer shadow map type
  light.shadow.mapSize.width = 2048; // Increase shadow map width
  light.shadow.mapSize.height = 2048; // Increase shadow map height
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
    quantity_ghost();
  });
});