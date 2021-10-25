// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


// npm install @azure/ai-text-analytics

/**
 * In this sample, we use the sentiment analysis endpoint to retrieve
 * estimations of document sentiment (positive, negative, or mixed) within some
 * example text. The endpoint allows us to analyze sentiment on a per-sentence
 * or overall (per-document) basis.
 *
 * @summary analyzes the sentiment of a piece of text
 */

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

// Load the .env file if it exists
const dotenv = require("dotenv");

// need to configure the path the .env
dotenv.config({path:"../.env"});

// You will need to set these environment variables or edit the following values
const endpoint = process.env.ENDPOINT || "<cognitive services endpoint>";
const apiKey = process.env.TEXT_ANALYTICS_API_KEY || "<api key>";

const documents = [
"I had the best day of my life. This was a waste of my time. The speaker put me to sleep.",
"This was a waste of my time. The speaker put me to sleep.",
"It's actually worse: 18 years from now, a home in Sydney will likely cost twice as much, at least, while wages will only increase by a comparably small amount."
];

// Function that 
async function analyseText(documents) {

    try {
        // Create a new instance of the text analysis client
        const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(apiKey));

        // Return the results object after analysing sentiment
        const sentimentRes = await client.analyzeSentiment(documents);

        // The response will have error undefined in OK.
        if (!sentimentRes.error) {

            // Remove the statistics and model Version
            for (let key of ["statistics","modelVersion"]) {
                delete sentimentRes[key];
            }

            // Go through sentiment response for each "document string" and filter out statistics and warnings
            sentimentRes.forEach( (documentSentiment) => {
                let deleteStrings = ["statistics", "warnings"]
                for (let key of deleteStrings) {
                    delete documentSentiment[key];
                }
            })

            const sentimentJSON = {"documents": sentimentRes};
            return sentimentJSON;

        } else {
            // Return an error json
            return {"error": `sentiment analysis failed ${sentimentRes.error}`}
        }


    } catch(err) {
        console.error("The sample encountered an error:", err);
    }
}

// Print out to the command line
let analysis = analyseText(documents);
analysis.then((value) => console.log(value));