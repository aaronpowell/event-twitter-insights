import { AzureFunction, Context, HttpRequest } from "@azure/functions";

type Binding = {
  documents: {
    keyPhrases: string[];
  }[];
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const { documents } = context.bindings as Binding;

  context.res = {
    body: documents
      .map(({ keyPhrases }: { keyPhrases: string[] }) => keyPhrases)
      .reduce((aggr, kp) => aggr.concat(kp), [])
      .reduce((result: { [key: string]: number }, phrase) => {
        if (result[phrase] === undefined) {
          result[phrase] = 1;
        } else {
          result[phrase]++;
        }
        return result;
      }, {}),
  };
};

export default httpTrigger;
