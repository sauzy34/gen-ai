import dotenv from "dotenv";
import { OllamaEmbeddings } from "@langchain/ollama";

dotenv.config();

const embeddingsLlm = new OllamaEmbeddings({ model: "phi3" });

const query = await embeddingsLlm.embedQuery("What is vector embedding?");
console.log({ query });
console.log({ length: query.length });
