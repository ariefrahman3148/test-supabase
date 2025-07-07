import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    const {
      team_name,
      captain_index,
      player_names,
      player_wa_numbers,
      player_ml_ids,
      player_ml_usernames,
      player_employee_ids
    } = req.body;

    // Validasi dasar
    if (
      !team_name ||
      captain_index === undefined ||
      !Array.isArray(player_names) ||
      player_names.length !== 5 ||
      player_wa_numbers.length !== 5 ||
      player_ml_ids.length !== 5 ||
      player_ml_usernames.length !== 5 ||
      player_employee_ids.length !== 5
    ) {
      return res.status(400).json({ error: "Invalid or incomplete data" });
    }

    const { error } = await supabase.from("ml_teams").insert({
      team_name,
      captain_index,
      player_names,
      player_wa_numbers,
      player_ml_ids,
      player_ml_usernames,
      player_employee_ids
    });

    if (error) throw error;

    return res.status(200).json({ success: true, message: "Data saved!" });
  } catch (err) {
    console.error("Error inserting:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.send("MLBB Form Webhook is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
