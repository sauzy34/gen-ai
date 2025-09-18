import dotenv from "dotenv";
import { splitDocs } from "./splitDocs";
import { loadDocs } from "./loadDocs";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import cliProgress from "cli-progress";

dotenv.config();

const docs = await loadDocs();

const chunks = await splitDocs(docs);

const embeddingLlm = new OllamaEmbeddings({
  model: "nomic-embed-text",
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY ?? "",
});

const pineconeIndex = pinecone.index("langchain-docs");

console.log("Vectorization...");
const progress = new cliProgress.SingleBar({});

progress.start(chunks.length, 0);
for (let i = 0; i < chunks.length; i = i + 100) {
  const batch = chunks.slice(i, i + 100);
  await PineconeStore.fromDocuments(batch, embeddingLlm, {
    pineconeIndex,
  });
  progress.increment(batch.length);
}

progress.stop();
console.log("Chunked docs stored in Pinecone");
