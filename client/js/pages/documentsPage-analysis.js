function generateTextAnalysisUI(jsonPayload) {
    const analysedTextTab = document.getElementById("analysed-text");
    const jsonResultsContent = document.getElementById("jsonContent");
    const rawText = document.getElementById("document-raw-text-wrapper");
    
    [analysedTextTab, jsonResultsContent, rawText].forEach( (element) => { element.innerHTML = "" })

    const sentenceArr = jsonPayload.textanalysis.sentiment.documents[0].sentences;

    const languageObject = jsonPayload.textanalysis.languageDetection.documents[0].primaryLanguage
    

    sentenceArr.forEach( (sentenceObject) => {
        rawText.textContent += sentenceObject.text + " ";
    })
    
    // Need to parse the JSON to an object, and then prettify it using stringigy
    jsonResultsContent.textContent = JSON.stringify(jsonPayload,null,1);


    // Create Table:
    let newTable = createElement("table", ["table"], "");
    
    let newTableBody = createElement("tbody", ["table"], "");
    newTable.appendChild(newTableBody)
    
    let newTableRow = createElement("tr", [], "");
    newTableBody.appendChild(newTableRow)

    let newHeaderTopic = createElement("th", [], "Language");
    newTableRow.appendChild(newHeaderTopic)
    let newHeaderData = createElement("td", [], ``);
    newTableRow.appendChild(newHeaderData)

    analysedTextTab.appendChild(newTable);
}