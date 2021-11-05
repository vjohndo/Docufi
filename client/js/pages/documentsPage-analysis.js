function generateTextAnalysisUI(jsonPayload) {
    const analysedTextTab = document.getElementById("analysed-text");
    const jsonResultsContent = document.getElementById("jsonContent");
    const rawText = document.getElementById("document-raw-text-wrapper");
    
    [analysedTextTab, jsonResultsContent, rawText].forEach( (element) => { element.innerHTML = "" })

    const sentenceArr = jsonPayload.textanalysis.sentiment.documents[0].sentences;

    const languageObject = jsonPayload.textanalysis.languageDetection.documents[0].primaryLanguage;
    const keyPhrase = jsonPayload.textanalysis.keyPhrases.documents[0].keyPhrases;

    sentenceArr.forEach( (sentenceObject) => {
        rawText.textContent += sentenceObject.text + " ";
    })
    
    // Need to parse the JSON to an object, and then prettify it using stringigy
    jsonResultsContent.textContent = JSON.stringify(jsonPayload,null,1);


    // Create Table:
    let newTable = createElement("table", ["table"], "");
    
    let newTableBody = createElement("tbody", ["table"], "");
    newTable.appendChild(newTableBody)
    
    // Language Row
    let newTableRow = createElement("tr", [], "");
    newTableBody.appendChild(newTableRow)

    let newHeaderTopic = createElement("th", [], "Language:");
    newTableRow.appendChild(newHeaderTopic)
    let newHeaderData = createElement("td", [], `${languageObject.name} (confidence: ${languageObject.confidenceScore*100} %)`);
    newTableRow.appendChild(newHeaderData)

    // Key Phrases Row
    newTableRow = createElement("tr", [], "");
    newTableBody.appendChild(newTableRow);

    newHeaderTopic = createElement("th", [], "Key Phrases:");
    newTableRow.appendChild(newHeaderTopic);

    newHeaderData = createElement("td", [], `${keyPhrase.join(", ")}`);
    newTableRow.appendChild(newHeaderData);

    // Sentiment Row
    newTableRow = createElement("tr", [], "");
    newTableBody.appendChild(newTableRow);

    newHeaderTopic = createElement("th", [], "Sentiment:");
    newTableRow.appendChild(newHeaderTopic);

    newHeaderData = createElement("td", [], ``);
    
    const sentimentDoc = jsonPayload.textanalysis.sentiment.documents[0]

    newHeaderData.innerHTML += `Sentence ${1}:  ${sentimentDoc.sentiment}<br>  [Positive: ${sentimentDoc.confidenceScores.positive * 100} % | Neutral: ${sentimentDoc.confidenceScores.neutral * 100} % | Negative: ${sentimentDoc.confidenceScores.negative * 100} % <br><br>`

    const sentimentSentence = jsonPayload.textanalysis.sentiment.documents[0].sentences
    for (const [index, entityObj] of sentimentSentence.entries()) {
        newHeaderData.innerHTML += `Sentence ${index + 1}:  ${entityObj.sentiment.toUpperCase()}<br>  [Positive: ${entityObj.confidenceScores.positive * 100} % , Neutral: ${entityObj.confidenceScores.neutral * 100} % , Negative: ${entityObj.confidenceScores.negative * 100} % <br><br>`
    }

    newTableRow.appendChild(newHeaderData);

    // Named Entities Row
    newTableRow = createElement("tr", [], "");
    newTableBody.appendChild(newTableRow);

    newHeaderTopic = createElement("th", [], "Named Entities:");
    newTableRow.appendChild(newHeaderTopic);

    newHeaderData = createElement("td", [], ``);

    const namedEntities = jsonPayload.textanalysis.entities.documents[0].entities;
    
    namedEntities.forEach( (entityObj) => {
        newHeaderData.innerHTML += `${entityObj.text} [${entityObj.category}]<br>`
    })

    newTableRow.appendChild(newHeaderData);

    // PII Entities Row
    newTableRow = createElement("tr", [], "");
    newTableBody.appendChild(newTableRow);

    newHeaderTopic = createElement("th", [], "PII Entities:");
    newTableRow.appendChild(newHeaderTopic);

    newHeaderData = createElement("td", [], ``);
    
    const piiEntitiesArray = jsonPayload.textanalysis.entityPII.documents[0].entities;

    piiEntitiesArray.forEach( (entityObj) => {
        newHeaderData.innerHTML += `Type: ${entityObj.category} <br>`
        newHeaderData.innerHTML += `Value: ${entityObj.text} <br><br>`
    })
    newTableRow.appendChild(newHeaderData);

    // Linked Entities
    newTableRow = createElement("tr", [], "");
    newTableBody.appendChild(newTableRow);

    newHeaderTopic = createElement("th", [], "Linked Entities:");
    newTableRow.appendChild(newHeaderTopic);

    
    newHeaderData = createElement("td", [], "");

    let rawTextForLinking = rawText.textContent;
    const linkedEntities = jsonPayload.textanalysis.entityLinking.documents[0].entities;

    linkedEntities.forEach( (entityObj) => {
        rawTextForLinking = rawTextForLinking.replaceAll(entityObj.name, `<a href="${entityObj.url}">${entityObj.name}</a>`)
    })

    newHeaderData.innerHTML = rawTextForLinking;

    newTableRow.appendChild(newHeaderData);
    

    analysedTextTab.appendChild(newTable);
}