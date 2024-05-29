import * as THREE from 'three';

export function quantity_ghost(scene)
{
    let ghostCount;
    function createGhostElement(scene) {
        // Khởi tạo canvas và context để vẽ điểm số và điểm số cao
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 600; //càng to thì càng nhỏ
        canvas.height = 500;
        // context.fillStyle = '#000000'; // Màu nền (đen)
        // context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'Bold 40px Arial';//px: độ rõ/mờ của chữ
        context.fillStyle = 'white';
    
        // Tạo texture cho điểm số
        const ghostTexture = new THREE.CanvasTexture(canvas);
    
        // Tạo vật liệu sử dụng texture
        const ghostMaterial = new THREE.MeshBasicMaterial({ map: ghostTexture, transparent: true });
    
        // Tạo geometry và mesh cho điểm số
        const ghostGeometry = new THREE.PlaneGeometry(4, 2);
        const ghostMesh = new THREE.Mesh(ghostGeometry, ghostMaterial);
        ghostMesh.position.set(-1, 1, -1); // Đặt vị trí của mesh
    
        // Thêm mesh vào scene
        scene.add(ghostMesh);
    
        return { canvas, context, ghostTexture, ghostMesh };
    }
    const { canvas, context, ghostTexture } = createGhostElement(scene);

    function updateGhostCountDisplay(ghostCount) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillText("Ghost: " + ghostCount, 10, 30);
        ghostTexture.needsUpdate = true;
    }
    return {updateGhostCountDisplay};
}

const scene = new THREE.Scene();
export const { updateGhostCountDisplay } = quantity_ghost(scene);