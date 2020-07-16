# Twitter Insights Generator

In this repo you'll find the developer component to the POWERful Devs Conf session [JavaScript ❤ Power Platform](https://dev.to/azure/javascript-pcf-20b6).

## How it works

There are two components to this repo, an [Azure Function](https://docs.microsoft.com/azure/azure-functions/?WT.mc.id=events_powerfuldevs-blog-aapowell) to process Twitter data and a [Azure Static Web App](https://docs.microsoft.com/azure/static-web-apps/?WT.mc.id=events_powerfuldevs-blog-aapowell) for displaying the insights as a tag cloud.

To run the demo you'll need a Power Automate workflow that uses the [When a new tweet is posted](https://docs.microsoft.com/connectors/twitter/?WT.mc.id=events_powerfuldevs-blog-aapowell#when-a-new-tweet-is-posted) connector and the [Put a message on a queue](https://docs.microsoft.com/connectors/azurequeues/?WT.mc.id=events_powerfuldevs-blog-aapowell#put-a-message-on-a-queue) connector. You'll also need to have setup an [Azure Storage Queue](https://azure.microsoft.com/services/storage/queues/?WT.mc.id=events_powerfuldevs-blog-aapowell) in your Azure subscription.

For the Function to process the data, you'll need a [Text Analytics Azure resource](https://ms.portal.azure.com/?WT.mc.id=events_powerfuldevs-blog-aapowell#create/Microsoft.CognitiveServicesTextAnalytics) and a CosmosDB instance (check out the [free tier](https://docs.microsoft.com/azure/cosmos-db/optimize-dev-test?WT.mc.id=events_powerfuldevs-blog-aapowell#azure-cosmos-db-free-tier)) to write the data from that can be used.

Lastly, you'll need a [`local.settings.json`](https://docs.microsoft.com/azure/azure-functions/functions-run-local?tabs=windows%2Ccsharp%2Cbash&WT.mc.id=events_powerfuldevs-blog-aapowell#local-settings-file) inside `backend` folder for all the connection information. The file would look like this:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "<storage account>",
    "QueueSource": "<storage account where queue lives>",
    "COSMOSDB": "<cosmos db connection string>",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AiEndpoint": "https://<AI endpoint>",
    "AiApiKey": "<AI key>"
  }
}
```

## Processing Twitter Data

To process the Twitter data (which is sent from [Power Automate](https://docs.microsoft.com/power-automate/?WT.mc.id=events_powerfuldevs-blog-aapowell) via the [Azure Queue Connector](https://docs.microsoft.com/connectors/azurequeues/?WT.mc.id=events_powerfuldevs-blog-aapowell)) an Azure Function resides in the [`backend`](/backend) folder, named `GetInput`.

This function uses the [Queue Trigger](https://docs.microsoft.com/azure/azure-functions/functions-bindings-storage-queue-trigger?tabs=javascript&WT.mc.id=events_powerfuldevs-blog-aapowell) to receive the message and then called [Cognitive Services Text Analysis](https://docs.microsoft.com/azure/cognitive-services/text-analytics/?WT.mc.id=events_powerfuldevs-blog-aapowell) to perform sentiment and key phrase analysis (see [`cognitiveServices.ts`](/backend/GetInput/cognitiveServices.ts)).

The results of calling these two operations are then saved to [CosmosDB](https://docs.microsoft.com/azure/cosmos-db/introduction?WT.mc.id=events_powerfuldevs-blog-aapowell) using the [CosmosDB Output Binding](https://docs.microsoft.com/azure/azure-functions/functions-bindings-cosmosdb-v2?WT.mc.id=events_powerfuldevs-blog-aapowell).

Lastly, a message is placed into a new Azure Queue containing information to be consumed using another Power Automate.

## Visualising the Tag Cloud

The Tag Cloud is running in a [Azure Static Web App](https://docs.microsoft.com/azure/static-web-apps/?WT.mc.id=events_powerfuldevs-blog-aapowell) that was created using [Create React App](https://github.com/facebook/create-react-app?WT.mc.id=events_powerfuldevs-blog-aapowell) with an Azure Function backend (to get started with Static Web Apps and React, check out [this GitHub repo template](https://github.com/aaronpowell/aswa-react-template?WT.mc.id=events_powerfuldevs-blog-aapowell)).

Azure Functions provides a HTTP API, using the [HTTP Trigger](https://docs.microsoft.com/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=javascript&WT.mc.id=events_powerfuldevs-blog-aapowell), that retrieves data from CosmosDB for the React application to use. This API lives in the [`api`](/api) folder.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
