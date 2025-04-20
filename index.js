const express = require('express');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/puzzles', async (_req, res) => {
    const { data, error } = await supabase
        .from("puzzle_definitions")
        .select("*")
        .order("created_at")

    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

    return res.json(data);
})

app.get('/daily', async (_req, res) => {
    const { data, error } = await supabase
        .from("daily_puzzle")
        .select("*")
        .order("date")

    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

    return res.json(data);
})

app.listen(port, () => {
    console.log(`Puzzle server running on port ${port}`)
})