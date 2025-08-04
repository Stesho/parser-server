import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = "/app/data";
const FILE_NAME = "rates.txt";
const FILE_PATH = path.join(DATA_DIR, FILE_NAME);

app.get("/rates.txt", async (req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const textFiles = files
      .filter(file => file.endsWith(".txt") && file !== FILE_NAME);

    const contents = await Promise.all(
      textFiles.map(async (file) => {
        const fullPath = path.join(DATA_DIR, file);
        return await fs.readFile(fullPath, "utf-8");
      })
    );

    const result = contents.join("\n");
    await fs.writeFile(FILE_PATH, result, "utf-8");

    res.sendFile(FILE_PATH);
  } catch (err) {
    console.error("[ERROR] Failed to generate rates.txt:", err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});
