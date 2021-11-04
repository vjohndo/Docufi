// TODO: Get user login status and render Auth / Unauth components
const socket = io("http://localhost:3000");

axios.get('/api/sessions').then(response => {
    // render authenticated defaults
    renderAuthenticatedHeader();
    renderHomePage();
}).catch(response => {
    renderUnauthenticatedHeader();
    renderLogin();
});

// log socket connection id
socket.on("connect", () => {
    console.log(`Socket Connected (id): ${socket.id}`);
});

socket.on("fileAnalysisComplete", (payload) => {
    // TODO: If on document page > stop spinners and render items
    // TODO: Otherwise pop alert
    console.log(`${payload.file.OriginalName} analysis complete`);
    const pageId = getPageId();
    switch(pageId) {
        case 'home':
            // On home page so complete / hide loading spinner for this element
            const spinnerElement = document.getElementById('a' + payload.file.FileName);
            spinnerElement.classList.add('hidden');
            break;
        case 'documents':
            break;
        default:
            console.log(`File Analysis Complete - No condition for pageId: ${pageId}`);
    }
});

socket.on("allFilesAnalysed", () => {
    console.log(`All files are analysed`);
    const pageId = getPageId();
    switch(pageId) {
        case 'home':
            createAlert('All files are analysed', AlertType.SUCCESS);
            break;
        case 'documents':
            break;
        default:
            console.log(`All files analysed - No condition for pageId: ${pageId}`);
    }
});

