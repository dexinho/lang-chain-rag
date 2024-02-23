const { Pinecone } = require("@pinecone-database/pinecone");
const dotenv = require("dotenv");
dotenv.config();

const createIndex = async (indexName) => {
  try {
    const pinecone = new Pinecone();

    await pinecone.createIndex({
      name: indexName,
      dimension: 1536,
      metric: "cosine",
      spec: {
        pod: {
          environment: "gcp-starter",
          podType: 'gcp'
        },
      },
    });

    console.log("Index created!");
  } catch (error) {
    console.error("Error creating index:", error);
  }
};

module.exports = createIndex;
