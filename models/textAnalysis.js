// npm install @azure/ai-text-analytics
// npm install dotenv

// Pulls out the relevant classes from the azure ai-text-analytics module
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

// Load the .env file if it exists
const dotenv = require("dotenv");

// need to configure the path the .env
dotenv.config({path:"../.env"});

// You will need to set these environment variables or edit the following values
const endpoint = process.env.ENDPOINT || "<cognitive services endpoint>";
const apiKey = process.env.TEXT_ANALYTICS_API_KEY || "<api key>";

// These are sample "documents" to be run. Each document can consist of more than 1 sentence
const documents = [
    "It's actually worse: 18 years from now, a home in Sydney will likely cost twice as much, at least, while wages will only increase by a comparably small amount.",
    "Microsoft was founded by Bill Gates and Paul Allen.",
    "Redmond is a city in King County, Washington, United States, located 15 miles east of Seattle.",
    "Jeff bought three dozen eggs because there was a 50% discount."
];


const sentimentProcessing = (sentimentRes) => {
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
}

const languageProcessing = (languageRes) => {
    // The response will have error undefined in OK.
    if (!languageRes.error) {

        // Remove the statistics and model Version
        for (let key of ["statistics","modelVersion"]) {
            delete languageRes[key];
        }

        // Go through sentiment response for each "document string" and filter out statistics and warnings
        languageRes.forEach( (document) => {
            let deleteStrings = ["statistics", "warnings"]
            for (let key of deleteStrings) {
                delete document[key];
            }
        })

        const languageJSON = {"documents": languageRes};
        return languageJSON;
    } else {
        // Return an error json
        return {"error": `language analysis failed ${languageRes.error}`}
    }
}

const keyPhrasesProcessing = (keyPhrasesRes) => {
    // The response will have error undefined in OK.
    if (!keyPhrasesRes.error) {

        // Remove the statistics and model Version
        for (let key of ["statistics","modelVersion"]) {
            delete keyPhrasesRes[key];
        }

        // Go through sentiment response for each "document string" and filter out statistics and warnings
        keyPhrasesRes.forEach( (document) => {
            let deleteStrings = ["statistics", "warnings"]
            for (let key of deleteStrings) {
                delete document[key];
            }
        })

        const languageJSON = {"documents": keyPhrasesRes};
        return languageJSON;
    } else {
        // Return an error json
        return {"error": `language analysis failed ${keyPhrasesRes.error}`}
    }
}

const azureResponseFilter= (responseObject) => {
    // The response will have error undefined in OK.
    if (!responseObject.error) {

        // Remove the statistics and model Version
        for (let key of ["statistics","modelVersion"]) {
            delete responseObject[key];
        }

        // Go through sentiment response for each "document string" and filter out statistics and warnings
        responseObject.forEach( (document) => {
            let deleteStrings = ["statistics", "warnings"]
            for (let key of deleteStrings) {
                delete document[key];
            }
        })

        const responseJSON = {"documents": responseObject};
        return responseJSON;
    } else {
        // Return an error json
        return {"error": `language analysis failed ${responseObject.error}`}
    }
}




async function analyseText(documents) {

    try {
        // Create a new instance of the text analysis client
        const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(apiKey));

        // Return the results object after analysing sentiment
        const sentimentRes = await client.analyzeSentiment(documents);
        const sentimentOutput = azureResponseFilter(sentimentRes);
        
        // Return the language dectection results after detecting the language
        const languageRes = await client.detectLanguage(documents);
        const languageOutput = azureResponseFilter(languageRes);

        // Return the key phrases
        const keyPhrasesRes = await client.extractKeyPhrases(documents);
        const keyPhrasesOutput = azureResponseFilter(keyPhrasesRes);

        // Return the entites
        const entitiesRes = await client.recognizeEntities(documents);
        const entitiesOutput = azureResponseFilter(entitiesRes);

        // Returns the PII entities
        const entityPiiRes = await client.recognizePiiEntities(documents);
        const entityPiiOutput = azureResponseFilter(entityPiiRes);

        // Recognises linked entities 
        const entityLinkingRes = await client.recognizeLinkedEntities(documents);
        const entityLinkingOutput = azureResponseFilter(entityLinkingRes);

        return {
            "sentiment": sentimentOutput,
            "languageDetection": languageOutput,
            "keyPhrases": keyPhrasesOutput,
            "entities": entitiesOutput,
            "entityPII": entityPiiOutput,
            "entityLinking": entityLinkingOutput
        }

    } catch(err) {
        console.error("The sample encountered an error:", err);
    }
}

// Print out to the command line
// let analysis = analyseText(documents);
// analysis.then((value) => {
//     console.log(value.entityPII)
//     console.log(value.entityLinking.documents[3].entities)
// });

module.exports = analyseText;