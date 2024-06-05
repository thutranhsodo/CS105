//load_land
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

function getland() {
  var landGeometry = new THREE.BoxGeometry(1,1,1);
  const material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('/model_3d/land.png')
  });
  var land = new THREE.Mesh(landGeometry, material);
  return land;
}

function load_land(scene, model_scale_x, model_position_x) {
    const land = getland()
    land.scale.set(model_scale_x, 1, 1);
    land.position.set(model_position_x, -1, 0);

    land.traverse(function (child) {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;  // Enable shadow casting
      }
  });
    land.receiveShadow=true;
    land.castShadow= true;
    return land;
  }


//load land_random
export function land_random(scene, model_position_x) 
{
  let land_set = [];

  let initialLand = load_land(scene, 10, model_position_x)
  model_position_x += 5
  land_set.push(initialLand);
  scene.add(initialLand);

  for (let i = 0; i < 8; i++) {
      var model_scale_x = Math.random() * (10 - 1) + 1;
      var distance = Math.random() * (3- 1) +0.7
      model_position_x+=model_scale_x/2+distance;
      let land = load_land(scene, model_scale_x, model_position_x );
      land_set.push(land)
      scene.add(land)
      model_position_x+=model_scale_x/2;
    }
    return land_set
}

//animation_land
export function animation_land(landSet, movementSpeed) {
    console.log(landSet.length)
    for (let i = 0; i < landSet.length; i++) {
      if (landSet[i] ) {
        landSet[i].position.x -= movementSpeed;
        movementSpeed +=0.00001
      }
    }
  }

  