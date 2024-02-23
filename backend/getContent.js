const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { PineconeStore } = require("@langchain/pinecone");
const { Pinecone } = require("@pinecone-database/pinecone");

const getContent = async (input) => {
  const chatModel = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
  const embeddings = new OpenAIEmbeddings();
  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

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

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
  });

  const similaritySearchRes = await vectorStore.similaritySearch(
    `Find data for ${input}`,
    1
  );

  const chainRes = await chain.invoke({
    context: similaritySearchRes[0]?.pageContent,
    input,
  });

  console.log("--- chainRes ---", chainRes.content);

  return chainRes;
};

module.exports = getContent;
