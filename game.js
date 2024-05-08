
import * as THREE from 'three';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
    
    const scene = new THREE.Scene();

    const loader = new GLTFLoader();


    loader.load('smol_holomyth_halloween_costumes.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5,0.5,0.5)
        model.position.set(0,-0.5,-1)
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
    camera.position.set(0,0.5,2)
    scene.add(camera)
    const renderer = new THREE.WebGLRenderer(
        {antialias: true}
    )

    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.shadowMap.enabled = true
    renderer.setClearColor(0xffffff);
    document.body.appendChild(renderer.domElement)
    
    const controls = new OrbitControls(camera, renderer.domElement)
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();