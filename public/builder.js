let clues = [];

console.log("Builder script loaded");

document.getElementById("generateGridBtn").addEventListener("click", () => {

    console.log("Generating grid...");

    const cols = parseInt(document.getElementById("cols").value);
    const rows = parseInt(document.getElementById("rows").value);

    if (isNaN(cols) || isNaN(rows) || cols <= 0 || rows <= 0) {
        alert("Please enter valid positive integers for cols and rows.");
        return;
    }

    clues = Array.from({ length: cols }, () => Array.from({ length: rows }, () => null));

    renderGrid(cols, rows);
});

function renderGrid(cols, rows) {
    const container = document.getElementById("gridContainer");

    const oldTable = document.getElementById("gridTable");

    container.removeChild(oldTable)

    table = document.createElement("table");
    table.id = "gridTable";

    for (let row = 0; row < rows; row++) {
        const rowTableRow = document.createElement("tr");

        for (let col = 0; col < cols; col++) {
            const cellTableData = document.createElement("td");

            cellTableData.textContent = formatClue(clues[col][row])

            cellTableData.addEventListener("click", () => {
                clues[col][row] = cycleClue(clues[col][row]);
                cellTableData.textContent = formatClue(clues[col][row]);
            });

            rowTableRow.appendChild(cellTableData);
        }

        table.appendChild(rowTableRow);
    }

    container.appendChild(table);
}

function formatClue(clue) {
    return clue === null ? " " : clue;
}

function cycleClue(clue) {
    switch (clue) {
        case null:
            return 3;
        case 0:
            return null;
        default:
            return clue - 1;
    }
}

document.getElementById("showJsonBtn").addEventListener("click", () => {
    const puzzleJson = JSON.stringify(buildPuzzleObject(), null, 2);

    const jsonOutput = document.getElementById("jsonOutput");

    jsonOutput.value = puzzleJson;
    console.log(puzzleJson);

    jsonOutput.style.height = 'auto';
    jsonOutput.style.height = jsonOutput.scrollHeight + 'px';

});

function buildPuzzleObject() {
    // Construct an object that matches puzzle definition format
    const cols = parseInt(document.getElementById('cols').value);
    const rows = parseInt(document.getElementById('rows').value);

    return {
        puzzleId: "puzzle_" + Date.now(),
        cols: cols,
        rows: rows,
        clues: clues
    };
}

document.getElementById("saveServerBtn").addEventListener("click", () => {
    const puzzleObj = buildPuzzleObject();

    fetch('/createPuzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(puzzleObj)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert("Puzzle saved to server");
        })
        .catch(error => {
            console.error('Error saving puzzle to server:', error);
            alert(`Failed to save puzzle to server: ${error.message}`);
        });
});