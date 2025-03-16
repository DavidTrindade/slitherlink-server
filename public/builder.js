let clues = [];
let gridCols = null;
let gridRows = null;

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

    gridCols = cols
    gridRows = rows
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

    if (!gridCols || !gridRows) {
        alert('Please generate a grid first');
        return;
    }

    let puzzleId = document.getElementById("puzzleId").value;

    if (!puzzleId) {
        puzzleId = "puzzle_" + Date.now()
    }

    return {
        puzzleId: puzzleId,
        cols: gridCols,
        rows: gridRows,
        clues: clues
    };
}

document.getElementById("saveServerBtn").addEventListener("click", async () => {
    const puzzleObj = buildPuzzleObject();

    res = await fetch('/createPuzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(puzzleObj)
    })

    data = await res.json()

    if (!res.ok) {
        alert(`Failed to save puzzle to server: ${data.error}`);
        return
    }

    alert(`Puzzle saved to server with ID: ${data.puzzle.puzzleId}`);

    refreshPuzzleList();
});


document.getElementById('refreshPuzzleListBtn').addEventListener('click', () => {
    refreshPuzzleList();
})

async function refreshPuzzleList() {
    try {
        const response = await fetch('/puzzles');

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const puzzles = await response.json();

        const puzzleListContainer = document.getElementById('puzzleListContainer');
        puzzleListContainer.innerHTML = '';

        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';

        const headerRow = document.createElement('tr');

        const thPuzzleId = document.createElement('th');
        thPuzzleId.textContent = 'Puzzle ID';
        thPuzzleId.style.padding = '8px';
        headerRow.appendChild(thPuzzleId);

        const thActions = document.createElement('th');
        thActions.textContent = 'Actions';
        thActions.style.padding = '8px';
        headerRow.appendChild(thActions);

        table.appendChild(headerRow);

        for (let puzzle of puzzles) {
            const row = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = puzzle.puzzleId;
            tdId.style.padding = '8px';
            row.appendChild(tdId);

            const tdActions = document.createElement('td');
            tdActions.style.padding = '8px';

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                deletePuzzle(puzzle.puzzleId);
            });

            tdActions.appendChild(deleteBtn);
            row.appendChild(tdActions);

            table.appendChild(row);
        }
        puzzleListContainer.appendChild(table);

    } catch (error) {
        console.error('Error loading puzzle list:', error);
        alert(`Failed to load puzzle list: ${error.message}`);
    }
}

async function deletePuzzle(puzzleId) {
    try {
        const response = await fetch(`/puzzle/${puzzleId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        refreshPuzzleList();
    } catch (error) {
        console.error('Error deleting puzzle:', error);
        alert(`Failed to delete puzzle: ${error.message}`);
    }
}