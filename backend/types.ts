import { DocumentSentimentLabel } from "@azure/ai-text-analytics";

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
