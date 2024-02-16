const dotenv = require("dotenv");
const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { Pinecone } = require("@pinecone-database/pinecone");
const { Document } = require("@langchain/core/documents");
const { PineconeStore } = require("@langchain/pinecone");

dotenv.config();

// console.log(process.env["OPENAI_API_KEY"]);
const loader = new PDFLoader("./ants/ants.pdf", {
  splitPages: false,
});

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });

const embeddings = new OpenAIEmbeddings();

const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

const chatModel = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a comedian. Whenever user asks a question, you answer in a funny way. But also provide facts from context."],
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

const test = async () => {
  let text = await loader.load();
  let chunks = await splitter.splitDocuments(text);
  let textFromChunks = chunks.map((chunk) => chunk.pageContent);
  console.log(textFromChunks);
  const documentRes = await embeddings.embedDocuments(textFromChunks);
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });

  const results = await vectorStore.similaritySearch("Are ants social insects", 1);

  // let res = await PineconeStore.fromDocuments(chunks, embeddings, {
  //   pineconeIndex,
  //   maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
  // });
  // let response = await chatModel.invoke("what is choke manifold?");
  // console.log(response.lc_kwargs.content);

  let res = await chain.invoke({
    context: results[0].pageContent,
    input: "What is the name substance ants pass when injured?",
  });

  console.log(res.content);
  // console.log(documentRes);
};

test();