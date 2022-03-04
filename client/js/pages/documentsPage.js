const checkboxesState = {};

async function renderDocumentsPage() {

    // Query the database to pull out the documents
    const uploadedDocuments = await axios.get("/api/documents");
    
    let { page, pageId } = getClearPage('documents');
    page.innerHTML = `
        <!-- Placeholder for the documents list -->
        <div class="container">
            <div class="row">
                <div class="col-md-5 document-wrapper">
                    <h6 class="text-secondary">Documents List</h6>
                    <ul id="documentList" class="list-group">
                    </ul>
                </div>
                <div class="col-md-7 search-div">
                    <h6 class="text-secondary">Search Tools</h6>
                    <div id="search-wrapper" class="list-group">
                        <form id="search-form" class="d-flex">
                            <input id="searchInput" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                            <button class="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <div class="filter-wrapper">
                            <div class="sentiment-elements">
                                <p>Sentiment Filters</p>
                                <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
                                <label class="form-check-label" for="flexSwitchCheckDefault">Positive</label>
                                </div>
                                <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked">
                                <label class="form-check-label" for="flexSwitchCheckChecked">Negative</label>
                                </div>
                                <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked">
                                <label class="form-check-label" for="flexSwitchCheckChecked">Neutral</label>
                                </div>
                                <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked">
                                <label class="form-check-label" for="flexSwitchCheckChecked">Mixed</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row" style="height: 50vh;">
                <aside class="col-sm-5 h-100">
                    <h6 class="text-secondary">Raw Text</h6>
                    <div id="document-raw-text-wrapper" class="overflow-auto h-100 raw-text-padding">

                    </div>
                </aside>
                <main class="col-sm-7 h-100">
                    <h6 class="text-secondary">Text Analysis</h6>
                    <div id="document-analysis-wrapper" class="card h-100">
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
                                Select a document to view analysis
                            </div>
                            <div class="tab-pane json" id="json" >
                                <pre id="jsonContent" > Select a document to view analysis </pre>
                            </div>
    
                        </form>
                    </div>
                </main>
            </div>
        </div>
    `;
    
    // For loop below creates list items and appends them to document list
    for (documentObject of uploadedDocuments.data) {
        try {
            let docElement = createElement("li", ["list-group-item"], "");
            docElement.dataset.id = documentObject.id;
            docElement.dataset.sentiment = documentObject.sentiment;
            docElement.dataset.positive = documentObject.confidencescores.positive;
            docElement.dataset.neutral = documentObject.confidencescores.neutral;
            docElement.dataset.negative = documentObject.confidencescores.negative;
    
            let docTitleSpan = createElement("span", [], documentObject.originalname);
            docTitleSpan.classList.add("span-doc-list");
            docElement.append(docTitleSpan);
    
            let sentimentSpan = createElement("span", [], "sentiment: " + documentObject.sentiment);
            let confidenceSpan = createElement("span", [], "confidence scores: " + `Positive: ${Math.round(documentObject.confidencescores.positive * 100)} %, Neutral: ${Math.round(documentObject.confidencescores.neutral * 100)} %, Negative: ${Math.round(documentObject.confidencescores.negative * 100)} %`);
    
            [sentimentSpan, confidenceSpan].forEach( (x) => {
                x.classList.add("span-doc-list-subtitle");
                docElement.append(x);
            });
            
            docElement.addEventListener('click', onDocumentsSelected);
    
            const unorderedList = document.getElementById("documentList");
            unorderedList.classList.add("doc-list-hover");
            unorderedList.appendChild(docElement);
        } catch {
            console.log(`${documentObject.originalname} was not analysed as there was no readable text`)
            createAlert(`${documentObject.originalname} was not listed as there was no readable text`, AlertType.INFO);
        }

    }

    // Adding event listener to search bar... automatically updates so can disable searching
    const searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", getSearchedDocuments);

    // Filter based on sentiment
    const checkboxes = document.querySelectorAll('input[type=checkbox]');
    checkboxes.forEach( (checkbox) => {
        checkboxesState[checkbox.nextElementSibling.innerHTML.toLowerCase()] = true;

        checkbox.addEventListener("change", (event) => {
            const docElements = document.querySelectorAll(".list-group-item");
            checkboxesState[event.target.nextElementSibling.innerHTML.toLowerCase()] = !checkboxesState[event.target.nextElementSibling.innerHTML.toLowerCase()];
            
            for (key in checkboxesState) {
                if (checkboxesState(key)) {
                    continue;
                } else {
                    docElements.forEach( (listItem) => {
                        listItem.classList.remove("hidden") 
                        if (checkboxesState[listItem.dataset.sentiment]) {
                            listItem.classList.add("hidden") 
                        }
                    });
                    break;
                }
            }
        });
    });
}


async function getSearchedDocuments(event) {

    event.preventDefault();

    const searchInput = document.getElementById("searchInput");

    let searchValue = searchInput.value
    if (searchValue === "") {
        renderDocumentsPage();
    } else {
        // Grab the document list and set it to empty
        const unorderedList = document.getElementById("documentList");
        unorderedList.innerHTML = "";

        // Get the search terms, split on spaces into an array, set them as query string parameters for a get call
        let searchTerms = searchInput.value.split(" ");
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

            console.log(docList);

            // For loop below creates list items and appends them to document list
            for (const [documentId, documentObject] of Object.entries(docList)) {

                let docElement = createElement("li", ["list-group-item"], "");
                docElement.dataset.id = documentId;
                docElement.dataset.sentiment = documentObject.sentiment;
                docElement.dataset.positive = documentObject.confidenceScores.positive;
                docElement.dataset.neutral = documentObject.confidenceScores.neutral;
                docElement.dataset.negative = documentObject.confidenceScores.negative;

                let docTitleSpan = createElement("span", [], documentObject.originalname);
                docTitleSpan.classList.add("span-doc-list");
                docElement.append(docTitleSpan);
                
                let entitiesSpan = createElement("span", [], "matched entities: " + documentObject.entity.join(", "));
                let sentimentSpan = createElement("span", [], "sentiment: " + documentObject.sentiment);
                let confidenceSpan = createElement("span", [], "confidence scores: " + `Positive: ${Math.round(documentObject.confidenceScores.positive * 100)} %, Neutral: ${Math.round(documentObject.confidenceScores.neutral * 100)} %, Negative: ${Math.round(documentObject.confidenceScores.negative * 100)} %`);

                [entitiesSpan, sentimentSpan, confidenceSpan].forEach( (x) => {
                    x.classList.add("span-doc-list-subtitle");
                    docElement.append(x);
                });
                
                docElement.addEventListener('click', onDocumentsSelected);

                const unorderedList = document.getElementById("documentList");
                unorderedList.classList.add("doc-list-hover");
                unorderedList.appendChild(docElement);
            }
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
    // console.log(payload.data);
    generateTextAnalysisUI(payload.data);
}