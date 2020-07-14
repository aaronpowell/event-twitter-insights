import {
  DocumentSentimentLabel,
  SentenceSentiment,
  SentimentConfidenceScores,
} from "@azure/ai-text-analytics";

export type QueueInput = {
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

export type AIResult = {
  sentimentRating: number;
  sentimentLabel: DocumentSentimentLabel;
  keyPhrases: string[];
};

export interface Model {
  id: string;
  type: string;
  tweetId: string;
  tweet: string;
  user: string;
  url: string;
}

export interface SentimentModel extends Model {
  sentiment: {
    sentiment: DocumentSentimentLabel;
    sentences: SentenceSentiment[];
    confidence: SentimentConfidenceScores;
  }[];
}

export interface KeyPhraseModel extends Model {
  keyPhrases: string[];
}
