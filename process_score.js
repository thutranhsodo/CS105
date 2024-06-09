import * as THREE from 'three';

export function process_score (scene) 
{
    function createScoreElement(scene) {
        // Khởi tạo canvas và context để vẽ điểm số và điểm số cao
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 600; //càng to thì càng nhỏ
        canvas.height = 500;
        context.font = 'Bold 40px Arial';//px: độ rõ/mờ của chữ
        context.fillStyle = 'white';
        context.fillText('Score: 0', 10, 30);
    
        // Tạo texture cho điểm số
        const scoreTexture = new THREE.CanvasTexture(canvas);
    
        // Tạo vật liệu sử dụng texture
        const scoreMaterial = new THREE.MeshBasicMaterial({ map: scoreTexture, transparent: true });
    
        // Tạo geometry và mesh cho điểm số
        const scoreGeometry = new THREE.PlaneGeometry(4, 2);
        const scoreMesh = new THREE.Mesh(scoreGeometry, scoreMaterial);
        scoreMesh.position.set(-2.5, 1, -1); // Đặt vị trí của mesh
    
        // Thêm mesh vào scene
        scene.add(scoreMesh);
    
        return { canvas, context, scoreTexture, scoreMesh };
    }
    
    const { canvas, context, scoreTexture } = createScoreElement(scene);
    let score = 0;
    let intervalId = null; // Biến này để lưu ID của setInterval để có thể dừng nó sau này

    const highScoreKey = document.getElementById('highScore');

    function startGame() {
        score = 0; // Reset điểm khi bắt đầu game
        updateScoreDisplay();
        intervalId = setInterval(incrementScore, 1000); // Bắt đầu tính điểm sau mỗi giây
    }

    window.endGame = function() {
        clearInterval(intervalId); // Dừng tính điểm khi game kết thúc
        checkHighScore(); // Kiểm tra điểm cao
        return score;
    }

    function incrementScore() {
        score += 1;
        updateScoreDisplay();
    }

    function updateScoreDisplay() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillText(`Score: ${score}`, 10, 30);
        scoreTexture.needsUpdate = true;
    }

    function checkHighScore() {
        const highScore = localStorage.getItem(highScoreKey) || 0;
        if (score > highScore) {
            localStorage.setItem(highScoreKey, score);
        }
        //highScoreKey.textContent = `High Score: ${highScore}`;
    }

    startGame();
    checkHighScore();
}