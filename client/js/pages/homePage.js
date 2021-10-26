function renderHomePage() {
    let { page } = getClearPage();
    page.innerHTML = `
    <div class="row">
        <main class="col-sm-8">
            <div class="drop-zone"> 
                <span class="btn btn-primary">Browse</span> 
                <span class="drop-message"> or drop file</span> 
                <input class="file-input" type="file">
            </div>
        </main>
        <aside class="col-sm-4">
            <div class="selected-zone"> 
            </div>
        </aside>
    </div>
    `;

    let dropZone = page.querySelector('.drop-zone');
    let fileInputElement = page.querySelector('.file-input');

    // File dropped into drop zone
    fileInputElement.addEventListener('change',  x => {
        const selectedFile = x.target.files[0];
        dropZone.classList.remove('on-drop');

        const dataForm = new FormData();
        dataForm.append('file', x.target.files[0]);
        axios.post('/api/file', dataForm).then(res => {

            })
            .catch(err => console.log(err));

        // console.log(selectedFile);
        // uploadFile(selectedFile);
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


function uploadFile(selectedFile) {
    let reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
        console.log(reader.result);
        axios.post('/api/file',{"file" : reader.result}).then(result => {
            console.log(result);
        });
    };

    reader.onloadend = () => {
        console.log('Reading finished');
    };
}




