async function renderDocumentsPage() {

    // Query the database to pull out the documents
    const uploadedDocuments = await axios.get("/api/documents");
    
    let { page, pageId } = getClearPage('documents');
    page.innerHTML = `
        <!-- Placeholder for the documents list -->
        <div class="row">
            <div class="col-md-12">
                <ul id="documentList" class="list-group">
                </ul>
            </div>
        </div>
        <div class="row">
            <aside class="col-sm-5">
                <div id="document-raw-text-wrapper" class="overflow-auto">
                    
                </div>
            </aside>
            <main class="col-sm-7">
                <div id="document-analysis-wrapper" class="card">
                    <div class="card-header">
                        <ul class="nav nav-tabs card-header-tabs" data-bs-tabs="tabs">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="true" data-bs-toggle="tab" href="#analysed-text">Analysed Text</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-bs-toggle="tab" href="#json">JSON</a>
                            </li>
                        </ul>
                    </div>
                    <form class="overflow-auto card-body tab-content">
                        <div class="tab-pane active" id="analysed-text">
                            Analysed Text goes here
                        </div>
                        <div class="tab-pane json" id="json" >
                            <pre id="jsonContent" > JSON goes here </pre>
                        </div>
  
                    </form>
                </div>
            </main>
        </div>
    `;

//     <div class="tab-pane" id="json">
//     <pre id="jsonContent"> JSON goes here </pre>
// </div>
    
    // For loop below creates list items and appends them to document list
    for (documentObject of uploadedDocuments.data) {
        
        let docElement = createElement("li", ["list-group-item"], documentObject.originalname);
        docElement.dataset.id = documentObject.id;
        docElement.addEventListener('click', onDocumentsSelected);

        const unorderedList = document.getElementById("documentList");
        unorderedList.appendChild(docElement);
    }

    let message = createElement('p',[],'This is the documents page');
    page.appendChild(message);

    // Adding event listener to search bar... automatically updates so can disable searching
    const searchBox = document.getElementById("searchButton");
    searchBox.addEventListener("input", getSearchedDocuments);

}


async function getSearchedDocuments(event) {
    // Only run code if the current rendering of the page does not contain a documentList
    if (document.getElementById("documentList")) {

        //  Only run code if search word is greater in length than three
        if (event.target.value.length > 3) {

            let capturedValue = event.target.value
            
            // Want to only start the search after 1 sec of inactivity
            setTimeout( async () => {
                const searchBox = document.getElementById("searchButton");
                if (capturedValue === searchBox.value) {
    
                    // Grab the document list and set it to empty
                    const unorderedList = document.getElementById("documentList");
                    unorderedList.innerHTML = "";
    
                    // Get the search terms, split on spaces into an array, set them as query string parameters for a get call
                    let searchTerms = document.getElementById("searchButton").value.split(" ");
                    let filteredSearchTerms = searchTerms.filter( (element) => element !== "" );
                    let getParams = Object.assign({}, filteredSearchTerms)
                    let results = await axios.get("/api/documents/search", {params: getParams});
                    
                    let filesMatchingEntitiesArr = results.data;

                    // Initialise a doc list
                    let docList = {};
                    
                    // If no matching entities in DB, create a No items found list item
                    if (filesMatchingEntitiesArr.length === 0) {
                        let docElement = createElement("li", ["list-group-item"], "No items found");
                        unorderedList.appendChild(docElement);
    
                    } else {
                        // For each result, add this to the docList object and keep adding matched entities to the corresponding file id
                        for (object of filesMatchingEntitiesArr) {
                            if (docList[object.id]) {
                                docList[object.id].entity.push(object.entity)
                            } else {
                                docList[object.id] = {originalname: object.originalname, entity: [object.entity], sentiment: object.sentiment, confidenceScores: object.confidencescores} 
                            }
                        }

                        // For loop below creates list items and appends them to document list
                        for (const [documentId, documentObject] of Object.entries(docList)) {
                            let docElement = createElement("li", ["list-group-item"], documentObject.originalname);
                            docElement.addEventListener('click', onDocumentsSelected);
                            docElement.dataset.id = documentId;
    
                            let entitiesSpan = createElement("span", [], "matching entities: " + documentObject.entity.join(", "));
                            let sentimentSpan = createElement("span", [], "sentiment: " + documentObject.sentiment);
                            let confidenceSpan = createElement("span", [], "confidence scores: " + JSON.stringify(documentObject.confidenceScores));
                            
                            [entitiesSpan, sentimentSpan, confidenceSpan].forEach( (x) => docElement.append(x));

                            unorderedList.append(docElement);
                        }
    
                        console.log(docList);
                    }
                }
            }, 1000)
        } 
    }
}

async function onDocumentsSelected(e) {

    // remove active class from all headers
    document.getElementById("documentList").querySelectorAll('li').forEach(x => x.classList.remove('active'));

    // Sometimes clicking on a "span" child triggers this event but the "span" remains as the e.target
    let listItem = e.target;
    if (e.target.nodeName !== "LI") {
        listItem = e.target.parentNode;
    }

    listItem.classList.add('active');
    
    const payload = await axios.get(`/api/documents/${listItem.dataset.id}`);
    console.log(payload.data);
    generateTextAnalysisUI(payload.data);
}