import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error("Missing Supabase configuration in environment variables");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/puzzles', async (_req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase
        .from("puzzle_definitions")
        .select("*")
        .order("created_at")

    if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }

    res.json(data);
})

app.get('/daily', async (_req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase
        .from("daily_puzzle")
        .select("*")
        .order("date")

    if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }

    res.json(data);
})

app.listen(port, () => {
    console.log(`Puzzle server running on port ${port}`)
})