async function renderHomePage() {
    let { page, pageId } = getClearPage('home');
    page.innerHTML = `
    <div class="row">
        <main class="col-sm-8">
            <div class="drop-zone"> 
                <span class="btn btn-primary">Browse</span> 
                <span class="drop-message"> or drop file</span> 
                <input class="file-input" type="file" multiple>
            </div>  
            <div class="progress hide">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
            </div>
        </main>
        <aside class="col-sm-4">
            <div class="selected-zone">
                <div class="accordion hidden" id="fileUploadAccordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button text-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#file-collection" aria-expanded="true" aria-controls="file-collection">
                                Analysing files..
                            <div class="spinner-border text-secondary show" role="status" id="accordion-spinner" style=""></div>
                            </button>
                        </h2>
                        <div class="accordion-collapse collapse" data-bs-parent="#fileUploadAccordion" id="file-collection" style="">
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    </div>
    `;

    // TODO: Move to header (in place of search) > Show logged in status
    let message = createElement('p',[],'Welcome to Docufi');
    const isLoggedIn = await axios.get("/api/sessions")
    message.textContent += (isLoggedIn.data.email) ? ` - Logged in with ${isLoggedIn.data.email}` : ` - Not Logged in`;
    page.appendChild(message);
    // ------------------------------------------

    renderFileUploadElements();
}

function renderFileUploadElements() {
    let dropZone = page.querySelector('.drop-zone');
    let fileInputElement = page.querySelector('.file-input');

    // File dropped into drop zone
    fileInputElement.addEventListener('change',  x => {
        dropZone.classList.remove('on-drop');
        const selectedFiles = x.target.files;

        // reset fileupload elements TODO: Tidy this up
        document.querySelector('.selected-zone').innerHTML = `
            <div class="accordion hidden" id="fileUploadAccordion">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button text-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#file-collection" aria-expanded="true" aria-controls="file-collection">
                                Analysing files..
                            <div class="spinner-border text-secondary show" role="status" id="accordion-spinner" style=""></div>
                        </button>
                    </h2>
                    <div class="accordion-collapse collapse" data-bs-parent="#fileUploadAccordion" id="file-collection" style="">
                    </div>
                </div>
            </div>
        `;

        uploadFile(selectedFiles);
        renderDropZoneElements();
        renderFileUploadElements();
    });

    // File dragged INTO drop zone
    fileInputElement.addEventListener('dragenter', x => {
        dropZone.classList.add('on-drop');
    });

    // File dragged OUT OF drop zone
    fileInputElement.addEventListener('dragleave', x => {
        dropZone.classList.remove('on-drop');
    });
}

function renderDropZoneElements() {
    let dropZoneHtml = `<span class="btn btn-primary">Browse</span> 
                <span class="drop-message"> or drop file</span> 
                <input class="file-input" type="file" multiple>
            `;
    document.querySelector('.drop-zone').innerHTML = dropZoneHtml;
}

function uploadFile(selectedFile) {
    const config = {
        onUploadProgress: e => {
            // progress to max at 75% - completion once analysis is done
            const percentCompleted = Math.round( (e.loaded * 100) / e.total * .80);
            console.log(`Progress ${percentCompleted}`);
            let progressBar = page.querySelector('.progress-bar');
            progressBar.style.width = `${percentCompleted}%`;
            if (e.loaded === e.total) {
                console.log('File upload completed');
                createAlert('File upload completed', AlertType.SUCCESS);
            }
        }
    }
    const dataForm = new FormData();
    dataForm.append('name', 'files');

    Object.values(selectedFile).forEach(file => {
       dataForm.append('files', file)
    });


    uploadFileProgressStart();

    axios.post('/api/file', dataForm, config).then(res => {
        res.data.fileInfo.forEach(f => {
            const { OriginalName, FileFormat, FileName } = f;
            completeProgressBar();
            // removeLoadingIcon();
            addItemToSelectedZone(OriginalName, FileFormat, FileName);
        });

    })
    .catch(err => {
        // TODO: progress bar error red
        completeProgressBar();
        createAlert(err, AlertType.DANGER);
    });
}

function uploadFileProgressStart() {
    let progressBar = page.querySelector('.progress-bar');
    let progressWrapper = page.querySelector('.progress');
    progressBar.style.width = '0%';
    progressWrapper.classList.remove('hide');
    progressBar.classList.add('progress-bar-animated');
    progressBar.classList.add('progress-bar-striped');
    progressBar.classList.remove('bg-success');
}

function completeProgressBar() {
    let progressBar = page.querySelector('.progress-bar');
    progressBar.style.width = `100%`;
    progressBar.classList.remove('progress-bar-animated');
    progressBar.classList.remove('progress-bar-striped');
    progressBar.classList.add('bg-success');
}

function addItemToSelectedZone(originalName, bodyText, fileName) {
    // check if accordion is hidden before appending
    const accordionElement = document.getElementById('fileUploadAccordion');
    if (accordionElement.classList.contains('hidden')) {
        accordionElement.classList.remove('hidden');
    }

    const fileCollection = document.querySelector('.accordion-collapse');
    const item = createElement('div',['accordion-body'], originalName);
    fileCollection.appendChild(item);
}







