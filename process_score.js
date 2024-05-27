export function process_score () {
    function createScoreElement() {
        let scoreElement = document.getElementById('score');
        if (!scoreElement) {
            scoreElement = document.createElement('div');
            scoreElement.id = 'score';
            scoreElement.style.position = 'absolute';
            scoreElement.style.top = '10px';
            scoreElement.style.left = '10px';
            scoreElement.style.color = 'black';
            scoreElement.style.fontSize = '24px';
            scoreElement.innerHTML = 'Score: 0';
            document.body.appendChild(scoreElement);
        }
        return scoreElement;
    }
    createScoreElement();

    let score = 0;
    let intervalId = null; // Biến này để lưu ID của setInterval để có thể dừng nó sau này

    const highScoreKey = 'highScore';

    function startGame() {
        score = 0; // Reset điểm khi bắt đầu game
        updateScoreDisplay();
        intervalId = setInterval(incrementScore, 1000); // Bắt đầu tính điểm sau mỗi giây
    }

    function endGame() {
        clearInterval(intervalId); // Dừng tính điểm khi game kết thúc
        checkHighScore(); // Kiểm tra điểm cao
    }

    function incrementScore() {
        score += 1;
        updateScoreDisplay();
    }

    function updateScoreDisplay() {
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = `Score: ${score}`;
    }

    function checkHighScore() {
        const highScore = localStorage.getItem(highScoreKey) || 0;
        if (score > highScore) {
            localStorage.setItem(highScoreKey, score);
            updateHighScoreDisplay();
        }
    }

    function updateHighScoreDisplay() {
        const highScore = localStorage.getItem(highScoreKey) || 0;
        const highScoreElement = document.getElementById('highScore');
        highScoreElement.textContent = `High Score: ${highScore}`;
    }
    startGame();
    document.addEventListener('DOMContentLoaded', (event) => {
        createScoreElement();
        updateHighScoreDisplay();
        
    });


    // Bắt đầu game khi nhấn vào nút hoặc sự kiện khác
    //document.querySelector('button01').addEventListener('click', startGame);

    // Kết thúc game khi cần
    // Ví dụ: Khi người chơi chết hoặc kết thúc level
    // Đặt hàm endGame() ở đây
}