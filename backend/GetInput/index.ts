import { AzureFunction, Context } from "@azure/functions";
import {
  TextAnalyticsClient,
  AzureKeyCredential,
} from "@azure/ai-text-analytics";
import { AIResult } from "../types";
import { processKeyPhrases, processSentiment } from "./cognitiveServices";

type QueueInput = {
  id: string;
  tweet: {
    text: string;
    user: string;
    url: string;
    id: string;
    originalText: string;
  };
  location: {
    lat: string;
    lon: string;
  };
};

const queueTrigger: AzureFunction = async function (
  context: Context,
  input: QueueInput | string
): Promise<void> {
  context.log("Processing input", input);

  let parsedInput: QueueInput;
  if (typeof input === "string") {
    try {
      parsedInput = JSON.parse(input.split("\n").join(" "));
    } catch (e) {
      console.error(e);
      console.error(input);
    }
  } else {
    parsedInput = input;
  }

  const endpoint = process.env.AiEndpoint;
  const key = process.env.AiApiKey;
  const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

  const text = parsedInput.tweet.originalText || parsedInput.tweet.text;

  const [sentimentResult, keyPhraseResult] = await Promise.all([
    processSentiment(client, parsedInput.tweet.id, parsedInput.tweet.user, parsedInput.tweet.url, text, context.log),
    processKeyPhrases(client, parsedInput.tweet.id, parsedInput.tweet.user, parsedInput.tweet.url, text, context.log),
  ]);

  context.bindings.sentimentDoc = sentimentResult;
  context.bindings.keyPhrasesDoc = keyPhraseResult;

  context.bindings.rawDoc = {
    ...parsedInput.tweet,
    id: `${parsedInput.tweet.id}`,
    type: "raw",
  };

  const results = {
    id: parsedInput.tweet.id,
    keyPhrases: context.bindings.keyPhrasesDoc.keyPhrases,
    sentimentLabel: context.bindings.sentimentDoc.sentiment[0].sentiment,
    sentimentRating: context.bindings.sentimentDoc.sentiment[0].confidence,
  } as AIResult;

  context.bindings.queuedResults = results;

  context.log(results);

  context.done();
};

export default queueTrigger;
