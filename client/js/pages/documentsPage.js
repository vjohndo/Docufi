async function renderDocumentsPage() {

    const uploadedDocuments = await axios.get("/api/documents");

    // Query the database to pull out the documents
    let { page } = getClearPage();
    page.innerHTML = `
    <div class="container-md">
        <div class="row">
            <div class="col-md-4">
                <ul id="documentList" class="list-group">
                </ul>
            </div>
        </div>
    </div>
    `

    for (documentObject of uploadedDocuments.data) {
        
        let docElement = createElement("li", ["list-group-item"], documentObject.originalname);
        docElement.dataset.id = documentObject.id;
        docElement.addEventListener('click', onDocumentsSelected);

        const unorderedList = document.getElementById("documentList");
        unorderedList.appendChild(docElement);
    }

    let message = createElement('p',[],'This is the documents page');
    page.appendChild(message);

    // Code for searching
    const searchBox = document.getElementById("searchButton");
    searchBox.addEventListener("input", getSearchedDocuments);
}

async function getSearchedDocuments(event) {

    if (event.target.value.length > 3) {

        let capturedValue = event.target.value
        
        setTimeout( async () => {
            const searchBox = document.getElementById("searchButton");
            if (capturedValue === searchBox.value) {
                const unorderedList = document.getElementById("documentList");
                unorderedList.innerHTML = "";

                let searchTerms = document.getElementById("searchButton").value.split(" ");
                let filteredSearchTerms = searchTerms.filter( (element) => element !== "" );
                let getParams = Object.assign({}, filteredSearchTerms)
                let results = await axios.get("/api/documents/search", {params: getParams});
                
                let docList = {};

                if (results.data.length === 0) {
                    let docElement = createElement("li", ["list-group-item"], "No items found");
                    unorderedList.appendChild(docElement);

                } else {
                    for (object of results.data) {
                        if (docList[object.id]) {
                            docList[object.id].entity.push(object.entity)
                        } else {
                            docList[object.id] = {originalname: object.originalname, entity: [object.entity], sentiment: object.sentiment, confidenceScores: object.confidencescores} 
                        }
                    }

                    for (const [documentId, documentObject] of Object.entries(docList)) {
                        let docElement = createElement("li", ["list-group-item"], documentObject.originalname);
                        
                        docElement.dataset.id = documentId;

                        let spanElement = createElement("span", [], documentObject.entity.join(", "));
                        docElement.appendChild(spanElement);
                        unorderedList.appendChild(docElement);

                        docElement.addEventListener('click', await onDocumentsSelected);
                    }

                    console.log(docList);
                }
            }
        }, 1000)
    }
}

async function onDocumentsSelected(e) {

    const documentLi = e.target;

    // remove active class from all headers
    document.getElementById("documentList").querySelectorAll('li').forEach(x => x.classList.remove('active'));

    // add active class to selected header
    e.target.classList.add('active');
    
    if (e.target.dataset.id) {
        const payload = await axios.get(`/api/documents/${e.target.dataset.id}`);
        console.log(payload.data);
    }
}

