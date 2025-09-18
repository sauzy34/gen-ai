import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadDocs } from "./loadDocs";

export async function splitDocs(docs: Document[]) {
  console.log("Docs split starting...");

  const spitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const chunks = await spitter.splitDocuments(docs);

  console.log(`${docs.length} documents split into ${chunks.length} chunks`);

  return chunks;
}
