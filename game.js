import * as THREE from 'three';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js";
//import * as CANNON from "cannon";
import { process_score } from './process_score.js';
import { quantity_ghost } from './quantity_ghost.js';
import * as land_ from './land.js';
import * as vatpham_ from './vatpham.js'
import { music } from './music.js';
import { end_screen } from './end_screen.js';
window.loadContent = async function() {
  let landSet = [], ghosts = [], oldghosts = [], vatpham = [], movementSpeed = 0.03, flag = 1, disappearTime, ghostspecialActive = false, speed_j=0.06;
  let timing = 0; let specialTimeout; let ghostfall = false; let ghost_block=false;
  const boostedSpeed = 0.1; // Temporary speed boost
  let isBoosted = false;
  let animationFrameId;
  let isgameover = false;
  window.start_game = async function () {
    //process_score(scene);
    landSet = land_.land_random(scene,-2)
    let inghost = await load_ghost(scene, -2.0, -0.735, -0.2);
    ghosts.push(inghost);
    scene.add(inghost);
 
    let ing = await load_ghost(scene, -2.3, -0.735, -0.2);
    ghosts.push(ing);
    scene.add(ing);
    
    vatpham = await vatpham_.load_vatpham_random(scene,landSet);
    const { updateGhostCountDisplay } = quantity_ghost(scene);
    //vatpham = await vatpham_.load_vatpham_random(scene,landSet);
    
    async function update() {
      if (isgameover) {
        end_screen();
        return;
      }

      renderer.render(scene, camera);
      if (landSet[landSet.length-1].position.x < 8)
        {
          let land_tam =land_.land_random(scene, landSet[landSet.length-1].position.x + landSet[landSet.length-1].scale.x/2 + 5.5)
          let vatpham_tam =await vatpham_.load_vatpham_random(scene, land_tam)
          for (let i = 0; i < land_tam.length; i++) 
            {landSet.push(land_tam[i]);
              vatpham.push(vatpham_tam[i]);}
          //vatpham_.load_vatpham_random(scene,landSet);
        }
        while (landSet[0].position.x + landSet[0].scale.x / 2 < -8) {
          // Remove the first landSet item
          const removedLand = landSet.shift();
          scene.remove(removedLand);
      
          // Remove the corresponding vatpham item
         if (vatpham[0]&& vatpham[0].object.position.x < -8) {
            const removedVatpham = vatpham.shift();
            scene.remove(removedVatpham.object);
         }
        }
      
     

      land_.animation_land(landSet, movementSpeed);

      for (let i = vatpham.length - 1; i >= 0; i--) {
        if (vatpham[i] && vatpham[i].object.position.x < -8) {
          scene.remove(vatpham[i].object);
          vatpham.splice(i, 1);
        }
      }
      vatpham_.animation_vatpham(vatpham,movementSpeed);
      movementSpeed +=0.000005

      checkCollision();
      ghost_fall();
      if (ghostspecialActive!=true) oneJump(0.8,-0.735,-0.65, -0.735,15);
      else oneJump(1.5,-0.3, -0.2, -0.3, 15)
      updateGhostCountDisplay(ghosts.length);
      if ((ghosts.length == 0 && ghostspecialActive != true) || (ghostspecialActive == true && ghost_block ==true) )
      {
        
        setTimeout(function() {
          isgameover = true;
        }, 2000);
      }
      //check();
      controls.update();
      animationFrameId = requestAnimationFrame(update);
      
    }
    update();
    updateGhostCountDisplay(ghosts.length);
  }
  
  //load_donut lẻ

  //load_ghost
  async function load_ghost(scene, x, y, z) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('./model_3d/ghost1.glb');
    const ghost = gltf.scene;
    ghost.scale.set(0.15, 0.2, 0.15);
    ghost.position.set(x, y, z);
    ghost.rotation.y = Math.PI / 2 - 0.2;
    ghost. receiveShadow = true;
    ghost.castShadow = true;
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
  //chuyển động vatphamSet

  let isJumping = false;

  //let ghoststop = false;
  //chuyển động ma
  function animation_ghost(ghost, maxheight, minheight, speed) {
    //if (!ghost || !ghost.object ) return;
    
    if (ghost.isFrozen ) {
      ghost.position.x -= movementSpeed; // Stop animation if frozen
    }
    //nhảy lên 
    if (flag == 1) {
      if (ghost.position.y < maxheight) {
        ghost.position.y += speed;
      } else {
        flag = 2;
      }
     // if (ghost.isFrozen) ghost.position.x+=movementSpeed+0.005
    }
    //đáp xuống tiếp tục chuyển động
    if (flag == 2) {
      if (ghost.position.y > minheight) {
        ghost.position.y -= speed;
     
      } else {
        flag = 1;
        isJumping = false;
        speed_j=0.06;
      }
    }
  }


  function checkCollision() {
    if (ghosts && vatpham) {
      for (let i = 0; i < ghosts.length; i++) {
        const ghost = ghosts[i];
        if (ghost.isRemoving) continue; // Skip if ghost is being removed

        const ghostBox = new THREE.Box3().setFromObject(ghost);
        for (let j = 0; j < vatpham.length; j++) {
          const item = vatpham[j];
          if (!item || !item.object) continue; 
          const itemBox = new THREE.Box3().setFromObject(item.object);

          if (ghostBox.intersectsBox(itemBox) && item.name != "barrier") {
            //vật phẩm biến mất
            scene.remove(item.object);
            vatpham.splice(j, 1);
            j--;

            //đụng bomb thì ma bị out 
            if (!ghostspecialActive && item.name == "bomb") {
              // Flag the ghost for removal
              ghost.isRemoving = true;
              animateGhostRemoval(ghost,i);
              i--; 
              break;
            }
          

            //đụng vật phẩm thì ma tăng thêm
            if (ghostspecialActive == false && item.name == "donut") {
              
              const lastGhost = ghosts[ghosts.length - 1];
              const newGhostPositionX = lastGhost.position.x - 0.3;
              const newGhostPositionY = lastGhost.position.y;
              const newGhostPositionZ = lastGhost.position.z;

                // Add new ghost
                load_ghost(scene, newGhostPositionX, newGhostPositionY, newGhostPositionZ).then(newGhost => {
                  ghosts.push(newGhost);
                  scene.add(newGhost);
                });
              
            }
            // đang xử lý
            if (item.name == "donut_special") {
              let timing = 10000;
            
              if (!ghostspecialActive) {
                ghostspecialActive = true;
                oldghosts = [...ghosts];
            
                for (let j = 0; j < ghosts.length; j++) {
                  scene.remove(ghosts[j]);
                  ghosts.splice(j, 1);
                  j--;
                }
            
                load_ghost_big(scene, -2.0, -0.4, -0.2).then(specialGhost => {
                  ghosts.push(specialGhost);
                  scene.add(specialGhost);
            
                  if (specialTimeout) {
                    clearTimeout(specialTimeout);
                  }
            
                  specialTimeout = setTimeout(() => {
                    scene.remove(specialGhost);
            
                    if (ghosts.length > 0) ghosts = oldghosts;
                    for (let k = 0; k < ghosts.length; k++) {
                      scene.add(ghosts[k]);
                    }
                    ghostspecialActive = false;
                  }, timing);
                });
              } else {
                if (specialTimeout) {
                  clearTimeout(specialTimeout);
                }
            
                specialTimeout = setTimeout(() => {
                  if (ghosts.length > 0) {
                    const specialGhost = ghosts.pop();
                    scene.remove(specialGhost);
                  }
            
                  ghosts = oldghosts;
                  for (let k = 0; k < ghosts.length; k++) {
                    scene.add(ghosts[k]);
                  }
                  ghostspecialActive = false;
                }, timing);
              }
            }
            
        
        if ( ghostBox.intersectsBox(itemBox) && item.name == "donut" && ghostspecialActive == true)  {
          
            const lastGhost = oldghosts[oldghosts.length - 1];
            const newGhostPositionX = lastGhost.position.x - 0.3;
            const newGhostPositionY = lastGhost.position.y;
            const newGhostPositionZ = lastGhost.position.z;
            load_ghost(scene, newGhostPositionX, newGhostPositionY, newGhostPositionZ).then(newGhost => {
              oldghosts.push(newGhost);
            });
          
        }
      }
    
          //ma bị chặn lại
         /* if (ghostspecialActive==false && ghostBox.intersectsBox(itemBox) && item.name == "barrier") {
            if (!ghost.isFrozen) {
              ghost.isFrozen = true;
              setTimeout(() => {
                removeGhost(ghost);
              }, 3000);
            }
          }*/
          // special ma
          if( ghostBox.intersectsBox(itemBox) && item.name == "barrier")
            {
              if (!ghost.isFrozen) {
                ghost.isFrozen = true;
                ghost_block = true;
                ghost.position.x = itemBox.min.x - 0.1;
                setTimeout(() => {
                  removeGhost(ghost);
                }, ghostspecialActive ? 1000 : 1000);
              }
            }
        }
      }
    }
  }
  
  function animateGhostRemoval(ghost, ghostIndex) {
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
        //moveGhostsForward(ghostIndex); // Move the ghosts forward after removal
      } else {
        speed_j=0.0001
        oneJump(0.8,-0.78,-0.65, -0.75, ghostIndex);
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
  function oneJump(maxheight1, minheight1, maxheight2, minheight2, ghostIndex) {
    document.addEventListener('keydown', function (event) {
      if (event.keyCode === 32 && !isJumping) {
        isJumping = true;
        flag = 1;
      }
    });
    for (let i = 0; i < ghosts.length; i++) {
      if (!ghosts[i].isRemoving)
        {
          if (i > ghostIndex)
            {
              const targetPositionX = -2.0 - ((i-1) * 0.3);
              if (ghosts[i].position.x <targetPositionX ) 
                ghosts[i].position.x+=0.005
            }
          
          if (is_out_of_land(ghosts[i], landSet)) fall(ghosts[i])
          if (isJumping)
            {
              animation_ghost(ghosts[i], maxheight1 , minheight1, speed_j)
              if (flag==1) speed_j=Math.max(0.025, speed_j-0.003)
              else speed_j+=0.0002
            }
          if (!isJumping) animation_ghost(ghosts[i], maxheight2, minheight2, 0.005);
        }     
  }
  }

  function fall(ghost) {
    // Fixed initial velocity and gravity
    const fixedTime = 2;
    function animate() {
      let elapsedTime = (Date.now() - startTime) / 1000;
      if (elapsedTime > fixedTime) elapsedTime = fixedTime;

      ghost.position.y = ghost.position.y + 0.1*elapsedTime + 0.1 * (-9.81) * elapsedTime * elapsedTime;

      if (ghost.position.y < -10) {
        removeGhost(ghost);
      } else {
        requestAnimationFrame(animate);
      }
    }

    let startTime = Date.now();
    requestAnimationFrame(animate);
  }

  function is_out_of_land(ghost, landSet) 
  {
    if (isJumping || ghostspecialActive) return false;
    const ghost_left = ghost.position.x - ghost.scale.x/2;
    const ghost_right = ghost.position.x + ghost.scale.x/2;
    for (let j=0; j<3; j++)
      {
        const land_right = landSet[j].position.x +landSet[j].scale.x/2;
        const land_left = landSet[j].position.x - landSet[j].scale.x/2;
        if ((ghost_left>land_left && ghost_right<land_right))
          {
          return false;
          }
      }
    
    return true;
  }
  function ghost_fall()
  {
    let falling_ghost = []
    for (let i=0; i<ghosts.length; i++)
    {
      if (is_out_of_land(ghosts[i], landSet)) {
        falling_ghost.push(ghosts[i])
      }
    }
    falling_ghost.forEach(fall);
        for (let i = 0; i < ghosts.length; i++) {  
          const targetPositionX = -2.0 - ((i) * 0.3);
                  if (ghosts[i].position.x <targetPositionX ) 
                    ghosts[i].position.x+=0.005}
    
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
  
  /*function loadModel(ulr, x, y, z){
    loader.load(ulr, (gltf) => {
    const model = gltf.scene;
    let mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(x, y, z);
    model.rotation.set(0,4.5,0);
    scene.add(model);
    function animate() {
      requestAnimationFrame(animate);
      if (mixer) {
          mixer.update(0.01);
      }
      renderer.render(scene, camera);
    }
    animate();
    });
  }
  loadModel('./model_3d/vampire_bat.glb', -3, 1.3, -1.4);
  loadModel('./model_3d/vampire_bat.glb', -0.2, 2, -2.5);
  loadModel('./model_3d/vampire_bat.glb', 3.2, 0.7, -2);*/

  
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
  sphere.position.set(2.5, 1.5, -2);
  scene.add(sphere);

  var pointLight = new THREE.PointLight(0xffffff, 0.5, 50);
  pointLight.position.set(0, 0, 0); // Position the light at the center of the sphere
  sphere.add(pointLight);
  
  var light= new THREE.DirectionalLight(0xffffff,1.5);
  light.position.set(2, 7, 3);
  //light.position.y = 10;
  light.castShadow = true;

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

  const listener = new THREE.AudioListener();
  camera.add(listener);
  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('./LoonboonIngame-LauraShigihara-4870104.mp3', function(buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true); 
      sound.setVolume(1);
      sound.play();
  });

  const container = document.querySelector('.background-container');
  const buttonStart = document.querySelector('.button01');
  const buttonInstruction = document.querySelector('.button02');
  const closeInstructionButton = document.getElementById('close-instruction');
  const buttonMusic = document.querySelector('.button03');
  const turnoffMusic = document.getElementById('turn-off-music');

  buttonStart.addEventListener('click', async function () {
    console.log("Button Start clicked!");
    container.parentNode.removeChild(container);
    try {
      sound.pause();
      await start_game();
      console.log("Game started!");
    } catch (error) {
      console.error("Error:", error);
    }
    process_score(scene);
    music(scene, camera);
  });

  buttonInstruction.addEventListener('click', async function ()
  {
    const imageContainer = document.getElementById('instruction');
    imageContainer.style.display = 'block';
  });
  closeInstructionButton.addEventListener('click', function(){
    const instructionContainer = document.getElementById('instruction');
    instructionContainer.style.display = 'none';
  });

  buttonMusic.addEventListener('click', async function ()
  {
    const imageMusic = document.getElementById('music');
    imageMusic.style.display = 'block';
    sound.pause();
  });
  turnoffMusic.addEventListener('click', function(){
    const MusicContainer = document.getElementById('music');
    MusicContainer.style.display = 'none';
    sound.play();
  });
}
document.addEventListener('DOMContentLoaded', loadContent);