import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";
import { PromptTemplate } from "@langchain/core/prompts";
import * as bedrock from "@langchain/aws";
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

  const llm = new bedrock.ChatBedrockConverse({
    model: "amazon.titan-text-lite-v1",
    maxTokens: 150,
    temperature: 0,
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET ?? "",
    },
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
