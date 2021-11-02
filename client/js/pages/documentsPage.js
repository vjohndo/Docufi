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
}

async function onDocumentsSelected(e) {
    // remove active class from all headers
    document.getElementById("documentList").querySelectorAll('li')?.forEach(x => x.classList.remove('active'));
    // add active class to selected header
    e.target.classList.add('active');
    
    const payload = await axios.get(`/api/documents/${e.target.dataset.id}`);
    
    console.log(payload.data);

}