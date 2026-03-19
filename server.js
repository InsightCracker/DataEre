const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdf = require("pdf-parse");
const XLSX = require("xlsx");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/api/convert", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).send("No file uploaded.");

    // Read PDF buffer
    const dataBuffer = fs.readFileSync(file.path);

    // Parse PDF text
    const data = await pdf(dataBuffer);

    // Very simple table parsing (split by lines & columns)
    const lines = data.text.split("\n");
    const table = lines.map((line) => line.split(/\s{2,}/)); // split by 2+ spaces

    // Get output format from query param
    const format = req.query.format || "csv";

    let outputPath;
    if (format === "csv") {
      outputPath = `output/${Date.now()}.csv`;
      const csvContent = table.map((row) => row.join(",")).join("\n");
      fs.writeFileSync(outputPath, csvContent);
    } else if (format === "xlsx") {
      outputPath = `output/${Date.now()}.xlsx`;
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(table);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, outputPath);
    } else if (format === "json") {
      outputPath = `output/${Date.now()}.json`;
      fs.writeFileSync(outputPath, JSON.stringify(table, null, 2));
    } else {
      return res.status(400).send("Invalid format");
    }

    // Send file for download
    res.download(path.resolve(outputPath), (err) => {
      fs.unlinkSync(file.path); // delete uploaded PDF
      fs.unlinkSync(outputPath); // delete generated file
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Conversion failed");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));