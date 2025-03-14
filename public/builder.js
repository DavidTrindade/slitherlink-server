let clues = [];

console.log("Builder script loaded");

document.getElementById("generateGridBtn").addEventListener("click", () => {

    console.log("Generating grid...");

    const cols = parseInt(document.getElementById("cols").value);
    const rows = parseInt(document.getElementById("rows").value);

    clues = Array.from({ length: cols }, () => Array.from({ length: rows }, () => null));

    renderGrid(cols, rows);
});

function renderGrid(cols, rows) {
    const container = document.getElementById("gridContainer");

    let oldTable = document.getElementById("gridTable");

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

    jsonOutput.textContent = puzzleJson;
    console.log(puzzleJson);

    jsonOutput.style.height = 'auto';
    const scrollHeight = jsonOutput.scrollHeight;
    jsonOutput.style.height = scrollHeight + 'px';

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