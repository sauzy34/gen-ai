import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { OllamaEmbeddings } from "@langchain/ollama";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

export async function createRetreiever(): Promise<VectorStoreRetriever> {
  const embeddingLlm = new OllamaEmbeddings({
    model: "nomic-embed-text",
  });

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY ?? "",
  });

  const pineconeIndex = pinecone.index("langchain-docs");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddingLlm, {
    pineconeIndex,
  });

  return vectorStore.asRetriever();
}

const retriever = await createRetreiever();
const result = await retriever.invoke("What is langchain");
console.log({ result });
