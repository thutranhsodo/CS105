export function music (scene, camera){
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // Tạo một đối tượng Audio và kết nối nó với AudioListener
    const sound = new THREE.Audio(listener);

    // Tạo AudioLoader và tải tệp âm thanh
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('./LoonboonIngame-LauraShigihara-4870104.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true); // Đặt âm thanh lặp lại nếu muốn
        sound.setVolume(1); // Đặt âm lượng
        sound.play();
    });

    function getPlane(size) {
        var plane = new THREE.CircleGeometry(size, 24);
        var loader = new THREE.TextureLoader();
        const texture1 = loader.load('/start_screen/music-03.png');
        const texture2 = loader.load('/start_screen/turn_off_music-03.png');
        var material = new THREE.MeshBasicMaterial({map: texture1});
        var mesh = new THREE.Mesh(plane, material);
        mesh.userData = { texture1, texture2, isTexture1: true };
        return mesh;
    }
    var plane = getPlane(0.15);
    plane.position.set(4, 1.75, -1);
    scene.add(plane);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
        // Chuyển tọa độ chuột sang tọa độ chuẩn hóa của Three.js
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Thiết lập raycaster với camera và tọa độ chuột
        raycaster.setFromCamera(mouse, camera);

        // Tìm các đối tượng bị giao cắt bởi raycaster
        const intersects = raycaster.intersectObjects(scene.children);

        // Nếu plane bị nhấp
        if (intersects.length > 0 && intersects[0].object === plane) {
            // Lấy đối tượng plane
            const mesh = intersects[0].object;

            // Chuyển đổi texture
            if (mesh.userData.isTexture1) {
                mesh.material.map = mesh.userData.texture2;
                sound.pause();
            } else {
                mesh.material.map = mesh.userData.texture1;
                sound.play();
            }

            // Cập nhật trạng thái texture
            mesh.userData.isTexture1 = !mesh.userData.isTexture1;

            // Cập nhật material để phản ánh thay đổi
            mesh.material.needsUpdate = true;
        }
    }

    // Lắng nghe sự kiện nhấp chuột
    window.addEventListener('click', onMouseClick);
}