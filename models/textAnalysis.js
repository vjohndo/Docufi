// npm install @azure/ai-text-analytics
// npm install dotenv

// Helper function that processes 
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

// Function that returns AZURE analysis JSON
async function analyseText(documents) {

    // Pulls out the relevant classes from the azure ai-text-analytics module
    const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

    // You will need to set these environment variables or edit the following values
    // dotenv should already be called in server.js 
    const endpoint = process.env.ENDPOINT || "<cognitive services endpoint>";
    const apiKey = process.env.TEXT_ANALYTICS_API_KEY || "<api key>";

    // Create a new instance of the text analysis client
    const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(apiKey));

    try {
        // Return the results object after analysing sentiment
        const sentimentRes = await client.analyzeSentiment(documents);
        
        // Return the language dectection results after detecting the language
        const languageRes = await client.detectLanguage(documents);

        // Return the key phrases
        const keyPhrasesRes = await client.extractKeyPhrases(documents);

        // Return the entites
        const entitiesRes = await client.recognizeEntities(documents);

        // Returns the PII entities
        const entityPiiRes = await client.recognizePiiEntities(documents);

        // Recognises linked entities 
        const entityLinkingRes = await client.recognizeLinkedEntities(documents);

        return {
            "sentiment": azureResponseFilter(sentimentRes),
            "languageDetection": azureResponseFilter(languageRes),
            "keyPhrases": azureResponseFilter(keyPhrasesRes),
            "entities": azureResponseFilter(entitiesRes),
            "entityPII": azureResponseFilter(entityPiiRes),
            "entityLinking": azureResponseFilter(entityLinkingRes)
        }

    } catch(err) {
        console.error("The sample encountered an error:", err);
    }
}

const testCode = () => {
    let analysis = analyseText(["It's actually worse: 18 years from now, a home in Sydney will likely cost twice as much, at least, while wages will only increase by a comparably small amount.",
                                "Microsoft was founded by Bill Gates and Paul Allen.",
                                "Redmond is a city in King County, Washington, United States, located 15 miles east of Seattle.",
                                "Jeff bought three dozen eggs because there was a 50% discount."]);
    analysis.then((value) => {
        console.log(value.entityPII)
        console.log(value.entityLinking.documents[3].entities)
    });
}
// testCode();

module.exports = analyseText;