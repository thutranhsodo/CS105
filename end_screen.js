export function end_screen(){
    var score = window.endGame();

    var endImage = document.createElement('img');
    endImage.src = './start_screen/end_screen-03.png';
    endImage.style.position = 'absolute';
    endImage.style.top = '50%';
    endImage.style.left = '50%';
    endImage.style.transform = 'translate(-50%, -50%)';
    endImage.style.width = '700px';
    endImage.style.height = 'auto';
    document.body.appendChild(endImage);

    var reload = document.createElement('img');
    reload.src = './start_screen/reload-03.png'; 
    reload.style.position = 'absolute';
    reload.style.top = '65%';
    reload.style.left = '45%';
    reload.style.transform = 'translate(-50%, -50%)';
    reload.style.width = '60px';
    reload.style.height = 'auto';
    reload.style.cursor = 'pointer';
    document.body.appendChild(reload);

    var home = document.createElement('img');
    home.src = './start_screen/home-03.png'; 
    home.style.position = 'absolute';
    home.style.top = '65%';
    home.style.right = '40%';
    home.style.transform = 'translate(-50%, -50%)';
    home.style.width = '60px';
    home.style.height = 'auto';
    home.style.cursor = 'pointer';
    document.body.appendChild(home);

    var textElement = document.createElement('div');
    textElement.style.position = 'absolute';
    textElement.textContent = `${score}`;
    textElement.style.top = '45%'; 
    textElement.style.left = '55%';
    textElement.style.color = '#000000';
    textElement.style.fontSize = '40px'; 
    textElement.style.fontFamily = 'Bookman, fantasy';
    document.body.appendChild(textElement);

    home.addEventListener('click', () => {
        location.reload(); 
    });

    reload.addEventListener('click', () => {
        endImage.remove();
        home.remove();
        reload.remove();
        textElement.remove();
        window.start_game();
    });
}