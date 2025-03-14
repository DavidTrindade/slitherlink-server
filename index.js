const express = require('express');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const app = express();
const port = process.env.PORT || 3000;


app.use(express.static('public'));
app.use(express.json());

app.post('/createPuzzle', async (req, res) => {
    const { puzzleId, cols, rows, clues } = req.body

    if (!puzzleId || !cols || !rows || !clues) {
        return res.status(400).json({ error: 'Invalid puzzle data' });
    }

    const { data, error } = await supabase
        .from("puzzle_definitions")
        .insert({
            puzzleId,
            cols,
            rows,
            clues
        })
        .select()

    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, puzzle: data[0] });

})

app.listen(port, () => {
    console.log(`Puzzle server running on port ${port}`)
})