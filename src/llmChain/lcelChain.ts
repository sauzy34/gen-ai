import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";

dotenv.config();

interface Props {
  course: string;
  role: string;
  wordLimit: number;
}

async function personalised({ course, role, wordLimit }: Props) {
  const promptTemplate = new PromptTemplate({
    template:
      "Describe the importance of {course} for a {role}. Limit the output to {wordLimit} words.",
    inputVariables: ["course", "role", "wordLimit"],
  });

  const llm = new ChatOllama({
    model: "phi3",
    temperature: 0,
  });
  const outputParser = new StringOutputParser();

  const leclChain = RunnableSequence.from([promptTemplate, llm, outputParser]);
  const answer = await leclChain.invoke({
    course,
    role,
    wordLimit,
  });

  return answer;
}

const ans = await personalised({
  course: "Generative AI",
  role: "Javascript Developer",
  wordLimit: 100,
});

console.log({ ans });
