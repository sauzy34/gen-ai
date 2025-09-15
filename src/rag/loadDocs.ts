import { Document } from "langchain/document";
import { crawlLangchainDocsUrls } from "./crawDocs";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import cliProgress from "cli-progress";

const progress = new cliProgress.SingleBar({});

export async function loadDocs(): Promise<Document[]> {
  const langchainDocsUrls = await crawlLangchainDocsUrls();

  console.log(`Start doc download. ${langchainDocsUrls.length} total docs.`);
  progress.start(langchainDocsUrls.length, 0);
  const rawDocs: Document[] = [];

  for (const url of langchainDocsUrls) {
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();
    rawDocs.push(...docs);
    progress.increment();
  }

  progress.stop();
  console.log(`${rawDocs} docs loaded.`);
  return rawDocs;
}

const rawDocs = await loadDocs();
console.log({ rawDocs: rawDocs.slice(0, 4) });
