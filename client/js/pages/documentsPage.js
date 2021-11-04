async function renderDocumentsPage() {

    const uploadedDocuments = await axios.get("/api/documents");

    // Query the database to pull out the documents
    let { page, pageId } = getClearPage('documents');
    page.innerHTML = `
        <div class="row">
            <aside class="col-sm-5">
                <div id="document-raw-text-wrapper">
                    
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
                    <form class="card-body tab-content">
                        <div class="tab-pane active" id="analysed-text">
                            Analysed Text goes here
                        </div>
                        <div class="tab-pane" id="json">
                            JSON goes here
                        </div>
  
                    </form>
                </div>
            </main>
    </div>
    `;


    // page.innerHTML = `
    // <div class="container-md">
    //     <div class="row">
    //         <div class="col-md-4">
    //             <ul id="documentList" class="list-group">
    //             </ul>
    //         </div>
    //     </div>
    // </div>
    // `

    // for (documentObject of uploadedDocuments.data) {
    //
    //     let docElement = createElement("li", ["list-group-item"], documentObject.originalname);
    //     docElement.dataset.id = documentObject.id;
    //     docElement.addEventListener('click', onDocumentsSelected);
    //
    //     const unorderedList = document.getElementById("documentList");
    //     unorderedList.appendChild(docElement);
    // }
}

async function onDocumentsSelected(e) {
    // remove active class from all headers
    document.getElementById("documentList").querySelectorAll('li')?.forEach(x => x.classList.remove('active'));
    // add active class to selected header
    e.target.classList.add('active');
    
    const payload = await axios.get(`/api/documents/${e.target.dataset.id}`);
    
    console.log(payload.data);

}