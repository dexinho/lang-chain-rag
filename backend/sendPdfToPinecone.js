const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { PineconeStore } = require("@langchain/pinecone");
const { Pinecone } = require("@pinecone-database/pinecone");
const { OpenAIEmbeddings } = require("@langchain/openai");
const dotenv = require("dotenv");

dotenv.config();

const sendPDFToPinecone = async (filePath) => {
  console.log(filePath);
  try {
    const loader = new PDFLoader(filePath, {
      splitPages: false,
    });
    const text = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const chunks = await splitter.splitDocuments(text);
    const textChunks = chunks.map((chunk) => chunk.pageContent);

    const embeddings = new OpenAIEmbeddings();
    const embeddingsArray = await embeddings.embedDocuments(textChunks);

    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

    const chunksResponse = await PineconeStore.fromDocuments(
      chunks,
      embeddings,
      {
        pineconeIndex,
        maxConcurrency: 5,
      }
    );

    console.error("Uploaded PDF file to Pinecone database!");
  } catch (error) {
    console.error("Error sending PDF file to Pinecone database:", error);
  }
};

module.exports = sendPDFToPinecone;
