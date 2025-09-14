import dotenv from "dotenv";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { LLMChain } from "langchain/chains";

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

  // const formattedPrompt = await promptTemplate.format({
  //   course,
  //   role,
  //   wordLimit,
  // });

  const llm = new ChatOllama({
    model: "phi3",
  });
  const outputParser = new StringOutputParser();

  const legacyChain = new LLMChain({
    prompt: promptTemplate,
    llm,
    outputParser,
  });

  const answer = await legacyChain.invoke({
    course,
    role,
    wordLimit,
  });

  return answer;
}

const ans = await personalised({
  course: "AWS Cloud",
  role: "Javascript Developer",
  wordLimit: 100,
});

console.log({ ans });
