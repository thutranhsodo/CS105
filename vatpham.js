import * as THREE from 'three';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

async function load_donut(scene,x,y,z) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('./model_3d/donut_1.glb');
    const donut = gltf.scene;
    donut.scale.set(0.2, 0.2, 0.2);
    donut.position.set(x, y, z);
    //donut.rotation.x = 2 - Math.PI / 5;

    donut.traverse(function (child) {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;  // Enable shadow casting
      }
  });
    
    return { object: donut,  name: "donut" };
  }
  //load_donut_special
  async function load_donut_special(scene,x,y,z) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('./model_3d/donut_special.glb');
    const donut = gltf.scene;
    donut.scale.set(0.15, 0.15, 0.15);
    donut.position.set(x, y, z);
    //donut.rotation.x = 2 - Math.PI / 5;

    donut.traverse(function (child) {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;  // Enable shadow casting
      }
  });
    donut.receiveShadow = true;
    
    return { object: donut, name: "donut_special" };
  }
  //load_Bomb
  function load_Bomb(scene,x,y,z)
  {
    function getBomb(size) {
      var sphereGeometry = new THREE.SphereGeometry(size, 24, 24);
      var loader = new THREE.TextureLoader();
      var texture = loader.load('/model_3d/Bomb.jpg');
      var material = new THREE.MeshBasicMaterial({ map: texture });
      var sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.castShadow = true;
      return sphere;
    }
    var bomb = getBomb(0.2);
    bomb.position.set(x, y, z);
    //bomb.rotation.x = 2 - Math.PI / 5;

    return {object: bomb, name: "bomb"};
  }
  //load vật cản
  function load_barrier(scene,x,y,z)
  {
    function getBox(w, h, d){
      var geometry = new THREE.BoxGeometry(w, h, d, 8);
      var loader = new THREE.TextureLoader();
      var material = [
        new THREE.MeshBasicMaterial({ map: loader.load('/model_3d/pumskin.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('/model_3d/pumskin.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('/model_3d/pumskin.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('/model_3d/pumskin.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('/model_3d/pumskin.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('/model_3d/pumskin.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('/model_3d/pumskin.jpg') })
      ]
      var mesh = new THREE.Mesh(
          geometry,
          material
      );
      mesh.castShadow = true;  
      return mesh;}
    
    var box = getBox(0.5, 0.5, 0.5);
    box.position.set(x, y, z);
    //box.rotation.x = 2 - Math.PI / 5;
    
    return {object: box, name: "barrier"};
  }
  //load 1 loạt vật phẩm
  export  async function load_vatpham_random(scene,landSet) {
    let items = [];
    let itemLoaders = [load_donut,load_Bomb, load_donut_special,  load_barrier];

    // Ensure each item loader is used at least once
    for (let i = 0; i < itemLoaders.length ; i++) {
        let loader = itemLoaders[i];
        let item = await loader(scene, landSet[i].position.x, landSet[i].position.y + 0.7, landSet[i].position.z);
        scene.add(item.object);
        items.push(item);
    }

    // Fill the rest of the slots
    for (let i = itemLoaders.length; i < 8; i++) {
        let randomLoader = itemLoaders[Math.floor(Math.random() * itemLoaders.length)];
        let item = await randomLoader(scene, landSet[i].position.x, landSet[i].position.y + 0.7, landSet[i].position.z);
        scene.add(item.object);           
        items.push(item);
    }

    return items;
}

export function animation_vatpham(vatpham,movementSpeed) {
    for (let i = 0; i < vatpham.length; i++) {
      if (vatpham[i] && vatpham[i].object) {
        vatpham[i].object.position.x -= movementSpeed;
        vatpham[i].object.rotation.y += 0.03
      }
    }
  }
  /*export async function load_vatpham_random(scene,landSet) {
    let items = [];
    let donut;
    for (let i = 0; i < landSet.length; i++) {
      if (i % 2 == 0) { donut = await load_donut(scene); }
      else { donut = await load_donut_special(scene); }
    
      
      console.log("Donut position:", donut.object.position);
      donut.object.position.y = 1.3;
      donut.object.position.x = 0;
      donut.object.position.z = -0.2;

      const landSetPosition = landSet[i].position.clone();

      landSet[i].add(donut.object);
      donut.object.position.copy(landSetPosition);

      donut.object.position.y = 1.3;
      donut.object.position.x = 0;
      donut.object.position.z = -0.2;
      items.push(donut);
    }
    return items;
  }*/
/*export  async function load_vatpham_random(scene,landSet) {
    let items = [];
    let itemLoaders = [load_donut, load_donut_special, load_Bomb, load_barrier];

    // Ensure each item loader is used at least once
    for (let i = 0; i < itemLoaders.length ; i++) {
        let loader = itemLoaders[i];
        let item = await loader(scene, landSet[i].position.x, landSet[i].position.y + 1.3, landSet[i].position.z - 0.3);
        landSet[i].add(item.object);
        items.push(item);
    }

    // Fill the rest of the slots
    for (let i = itemLoaders.length; i < 8; i++) {
        let randomLoader = itemLoaders[Math.floor(Math.random() * itemLoaders.length)];
        let item = await randomLoader(scene, landSet[i].position.x, landSet[i].position.y + 1.3, landSet[i].position.z - 0.3);
        scene.add(item.object);           
        items.push(item);
    }

    return items;
}*/

/*export function animation_vatpham(vatpham,movementSpeed) {
    for (let i = 0; i < vatpham.length; i++) {
      if (vatpham[i] && vatpham[i].object) {
        vatpham[i].object.position.x -= movementSpeed; 
      }
    }
  }*/