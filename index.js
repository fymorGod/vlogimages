const express = require("express");
const multer = require("multer");
const moment = require("moment");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3031;

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const currentDate = moment();
    const yearFolder = `./uploads/${currentDate.format("YYYY")}`;
    const monthFolder = `${yearFolder}/${currentDate.format("MM")}`;
    const dayFolder = `${monthFolder}/${currentDate.format("DD")}`;

    fs.mkdirSync(yearFolder, { recursive: true });
    fs.mkdirSync(monthFolder, { recursive: true });
    fs.mkdirSync(dayFolder, { recursive: true });

    cb(null, dayFolder);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage }).array("images", 10);

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Nenhuma imagem recebida." });
    }

    const fileNames = req.files.map((file) => file.filename);
    console.log('Imagens cadastradas no sistema!');
    res.status(201).json({
      message: "Imagens salvas com sucesso!",
      fileNames: fileNames,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
