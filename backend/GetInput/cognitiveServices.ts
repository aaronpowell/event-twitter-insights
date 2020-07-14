import {
  TextAnalyticsClient,
  AnalyzeSentimentSuccessResult,
  ExtractKeyPhrasesSuccessResult,
} from "@azure/ai-text-analytics";
import { SentimentModel, KeyPhraseModel } from "../types";

const processSentiment = async (
  client: TextAnalyticsClient,
  tweetId: string,
  user: string,
  url: string,
  text: string,
  log: (...args: any) => void
): Promise<SentimentModel> => {
  const sentimentResult = await client.analyzeSentiment([text]);

  log("Response from sentiment analysis", sentimentResult);

  return {
    id: `sentiment-${tweetId}`,
    type: "sentiment",
    tweetId,
    user,
    url,
    tweet: text,
    sentiment: sentimentResult.map((doc: AnalyzeSentimentSuccessResult) => {
      return {
        sentiment: doc.sentiment,
        sentences: doc.sentences,
        confidence: doc.confidenceScores,
      };
    }),
  };
};

const processKeyPhrases = async (
  client: TextAnalyticsClient,
  tweetId: string,
  user: string,
  url: string,
  text: string,
  log: (...args: any) => void
): Promise<KeyPhraseModel> => {
  const keyPhraseResult = await client.extractKeyPhrases([text]);
  log("Response from key phrase analysis", keyPhraseResult);

  return {
    id: `keyPhrases-${tweetId}`,
    type: "keyPhrases",
    tweetId,
    user,
    url,
    tweet: text,
    keyPhrases: keyPhraseResult
      .map((doc: ExtractKeyPhrasesSuccessResult) => doc.keyPhrases)
      .reduce((arr, kp) => arr.concat(kp), []),
  };
};

export { processSentiment, processKeyPhrases };
