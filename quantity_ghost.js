export function quantity_ghost()
{
    function createQuantityGhost() {
        let ghost_q = document.getElementById('ghostCount');
        if (!ghost_q) {
            ghost_q = document.createElement('div');
            ghost_q.id = 'ghostCount';
            ghost_q.style.position = 'absolute';
            ghost_q.style.top = '10px';
            ghost_q.style.left = '150px';
            ghost_q.style.color = 'black';
            ghost_q.style.fontSize = '24px';
            ghost_q.innerHTML = 'Ghost: 2';
            document.body.appendChild(ghost_q);
        }
        return ghost_q;
    }
    createQuantityGhost();
    document.addEventListener('DOMContentLoaded', (event) => {
        createQuantityGhost();        
    });
}
export function updateGhostCountDisplay(ghostCount) {
    const ghostCountElement = document.getElementById("ghostCount");
    ghostCountElement.textContent = "Ghost: " + ghostCount;
  }