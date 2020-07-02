import { AzureFunction, Context } from "@azure/functions";
import {
  TextAnalyticsClient,
  AzureKeyCredential,
  AnalyzeSentimentSuccessResult,
  ExtractKeyPhrasesSuccessResult,
} from "@azure/ai-text-analytics";

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
  input: QueueInput
): Promise<void> {
  context.log("Processing input", input);
  const endpoint = process.env.AiEndpoint;
  const key = process.env.AiApiKey;
  const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

  const text = input.tweet.originalText || input.tweet.text;

  const [sentimentResult, keyPhraseResult] = await Promise.all([
    client.analyzeSentiment([text]),
    client.extractKeyPhrases([text]),
  ]);

  context.log("Response from sentiment analysis", sentimentResult);
  context.log("Response from key phrase analysis", keyPhraseResult);

  context.bindings.sentimentDoc = {
    id: `sentiment-${input.tweet.id}`,
    type: "sentiment",
    tweetId: input.tweet.id,
    tweet: text,
    sentiment: sentimentResult.map((doc: AnalyzeSentimentSuccessResult) => {
      return {
        sentiment: doc.sentiment,
        sentences: doc.sentences,
        confidence: doc.confidenceScores,
      };
    }),
  };

  context.bindings.keyPhrasesDoc = {
    id: `keyPhrases-${input.tweet.id}`,
    type: "keyPhrases",
    tweetId: input.tweet.id,
    tweet: text,
    keyPhrases: keyPhraseResult
      .map((doc: ExtractKeyPhrasesSuccessResult) => doc.keyPhrases)
      .reduce((arr, kp) => arr.concat(kp), []),
  };

  context.bindings.rawDoc = {
    ...input.tweet,
    id: `${input.tweet.id}`,
    type: "raw",
  };
};

export default queueTrigger;
