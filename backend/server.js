const express = require("express");
const cors = require("cors");
const multer = require("multer");
const chatbot = require("./chatbot");
const sendPDFToPinecone = require("./sendPdfToPinecone");
const getContent = require("./getContent");
const retrieveAllRecords = require("./deleteRecords");
const deleteIndex = require("./deleteIndex");
const createIndex = require("./createIndex");

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
app.use(express.json());

app.post("/message", async (req, res) => {
  const { input } = req.body;

  const content = await getContent(input);

  res.status(200).json(content);
});

app.post("/pdf", upload.single("pdfFile"), async (req, res) => {
  try {
    await deleteIndex("test");
    await createIndex("test");
    console.log("-------------");
    await sendPDFToPinecone(req.file.path);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
