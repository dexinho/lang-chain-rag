const { Pinecone } = require("@pinecone-database/pinecone");
const dotenv = require("dotenv");
dotenv.config();

const deleteIndex = async (indexName) => {
  try {
    const pinecone = new Pinecone();
    await pinecone.deleteIndex(indexName);

    console.log("Index deleted!");
  } catch (error) {
    console.error("Error deleting index:", error);
  }
};

module.exports = deleteIndex;
