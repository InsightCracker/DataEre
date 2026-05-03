import express from "express";
import multer from "multer";
// import fs from "fs";
// import pdf from "pdf-parse";
// import XLSX from "xlsx";
import cors from "cors";
// import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// // ================= PDF CONVERTER =================
// app.post("/api/convert", upload.single("file"), async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) return res.status(400).send("No file uploaded.");

//     const dataBuffer = fs.readFileSync(file.path);
//     const data = await pdf(dataBuffer);

//     const lines = data.text.split("\n");
//     const table = lines.map((line) => line.split(/\s{2,}/));

//     const format = req.query.format || "csv";

//     let outputPath;

//     if (format === "csv") {
//       outputPath = `output/${Date.now()}.csv`;
//       const csvContent = table.map((row) => row.join(",")).join("\n");
//       fs.writeFileSync(outputPath, csvContent);
//     } 
//     else if (format === "xlsx") {
//       outputPath = `output/${Date.now()}.xlsx`;
//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.aoa_to_sheet(table);
//       XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
//       XLSX.writeFile(wb, outputPath);
//     } 
//     else if (format === "json") {
//       outputPath = `output/${Date.now()}.json`;
//       fs.writeFileSync(outputPath, JSON.stringify(table, null, 2));
//     } 
//     else {
//       return res.status(400).send("Invalid format");
//     }

//     res.download(path.resolve(outputPath), () => {
//       fs.unlinkSync(file.path);
//       fs.unlinkSync(outputPath);
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Conversion failed");
//   }
// });


// ================= AI SETUP =================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use a valid text generation model
const AI_MODEL = "text-bison-001"; // Replace with the correct model name for your account

// ================= GENERATE QUESTIONS =================
app.post("/api/generate", async (req, res) => {
  const { topic = "General Knowledge", difficulty = "Beginner" } = req.body;

  const prompt = `
    Generate 5 ${difficulty} level quiz questions on ${topic}.
    Return ONLY JSON in this format:
    [
      {
        "question": "",
        "options": ["", "", "", ""],
        "answer": ""
      }
    ]
  `;

  try {
    const model = genAI.getGenerativeModel({ model: AI_MODEL });
    const result = await model.generateContent(prompt);

    let resultText = result.response.text();
    // Remove ```json or ``` if AI wraps it
    resultText = resultText.replace(/```json|```/g, "").trim();

    // Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(resultText);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    res.json(parsed);

  } catch (error) {
    console.error("Gemini AI error:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

// ================= TEST ENDPOINT =================
app.get("/api/test-ai", async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.json(models);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to list models");
  }
});



// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));