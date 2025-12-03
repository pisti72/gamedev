document.addEventListener('DOMContentLoaded', () => {
    const gridSize = 5;
    const grid = document.querySelector('.grid');
    const rowClues = document.querySelector('.row-clues');
    const columnClues = document.querySelector('.column-clues');
    const checkBtn = document.getElementById('check-btn');
    const message = document.getElementById('message');

    // Példa nonogram megoldás (1 = fekete, 0 = üres)
    const solution = [
        [1, 1, 0, 1, 1],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [1, 1, 0, 1, 1]
    ];

    // Sor- és oszlop-tippek generálása a megoldásból
    function generateClues() {
        // Sor tippek
        for (let i = 0; i < gridSize; i++) {
            const row = solution[i];
            const clue = [];
            let count = 0;

            for (let j = 0; j < gridSize; j++) {
                if (row[j] === 1) {
                    count++;
                } else if (count > 0) {
                    clue.push(count);
                    count = 0;
                }
            }
            if (count > 0) clue.push(count);
            if (clue.length === 0) clue.push(0);

            const rowClueDiv = document.createElement('div');
            rowClueDiv.textContent = clue.join(' ');
            rowClues.appendChild(rowClueDiv);
        }

        // Oszlop tippek
        for (let j = 0; j < gridSize; j++) {
            const clue = [];
            let count = 0;

            for (let i = 0; i < gridSize; i++) {
                if (solution[i][j] === 1) {
                    count++;
                } else if (count > 0) {
                    clue.push(count);
                    count = 0;
                }
            }
            if (count > 0) clue.push(count);
            if (clue.length === 0) clue.push(0);

            const columnClueDiv = document.createElement('div');
            columnClueDiv.textContent = clue.join('\n');
            columnClues.appendChild(columnClueDiv);
        }
    }

    // Rács létrehozása
    function createGrid() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement('div');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => {
                    cell.classList.toggle('filled');
                });
                grid.appendChild(cell);
            }
        }
    }

    // Ellenőrzés gomb
    checkBtn.addEventListener('click', () => {
        let isCorrect = true;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const cell = document.querySelector(`.grid div[data-row="${i}"][data-col="${j}"]`);
                const isFilled = cell.classList.contains('filled');
                if ((solution[i][j] === 1 && !isFilled) || (solution[i][j] === 0 && isFilled)) {
                    isCorrect = false;
                    break;
                }
            }
            if (!isCorrect) break;
        }

        if (isCorrect) {
            message.textContent = 'Gratulálok, helyes megoldás! 🎉';
            message.style.color = 'green';
        } else {
            message.textContent = 'Nem teljesen jó, próbáld újra! ❌';
            message.style.color = 'red';
        }
    });

    // Inicializálás
    generateClues();
    createGrid();
});