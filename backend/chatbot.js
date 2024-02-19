const dotenv = require("dotenv");
const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { Pinecone } = require("@pinecone-database/pinecone");
const { PineconeStore } = require("@langchain/pinecone");
// const { Document } = require("@langchain/core/documents");

dotenv.config();

const chatbot = (filePath) => {
  const loader = new PDFLoader(filePath, {
    splitPages: false,
  });

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const embeddings = new OpenAIEmbeddings();

  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

  const chatModel = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Provide facts from context."],
    [
      "user",
      `Answer the following question based only on the provided context:
  
    <context>
    {context}
    </context>
    
    Question: {input}`,
    ],
  ]);

  const chain = prompt.pipe(chatModel);

  const search = async () => {
    let text = await loader.load();
    let chunks = await splitter.splitDocuments(text);
    let textFromChunks = chunks.map((chunk) => chunk.pageContent);
    console.log(textFromChunks);
    const documentRes = await embeddings.embedDocuments(textFromChunks);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });

    const results = await vectorStore.similaritySearch(
      "How do birds make homes",
      1
    );

    // let chunksResponse = await PineconeStore.fromDocuments(chunks, embeddings, {
    //   pineconeIndex,
    //   maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    // });
    // let response = await chatModel.invoke("what is choke manifold?");
    // console.log(response.lc_kwargs.content);

    let res = await chain.invoke({
      context: results[0].pageContent,
      input: "Tell me about birds.",
    });

    console.log(res.content);
    // console.log(documentRes);
  };

  search();
};

module.exports = chatbot;
