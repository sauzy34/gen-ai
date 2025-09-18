import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
import { createRetreiever } from "./retriever";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "human",
    `You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
Question: {question}
Context: {context}
Answer:`,
  ],
]);

const llm = new ChatOllama({ model: "phi3", temperature: 0 });

const parser = new StringOutputParser();

const retreiver = await createRetreiever;

const retreivalChain = RunnableSequence.from([
  (input) => input.question,
  retreiver,
  formatDocumentsAsString,
]);

const generationChain = RunnableSequence.from([
  { question: (input) => input.question, context: retreivalChain },
  prompt,
  llm,
  parser,
]);
