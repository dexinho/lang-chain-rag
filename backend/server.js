const express = require("express");
const cors = require("cors");
const multer = require("multer");
const chatbot = require("./chatbot");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./pdfs");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(cors());

app.post("/pdf", upload.single("pdfFile"), (req, res) => {
  chatbot(req.file.path)
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
