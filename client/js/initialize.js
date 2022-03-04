window.SOCKET = {};
SOCKET.socketId = "";
// local development
// const socket = io("http://localhost:3000");
const socket = io.connect("https://docufi-app.herokuapp.com/");

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, PATCH, OPTIONS';

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
    SOCKET.socketId = socket.id;
    // console.log(`Socket Connected (id): ${SOCKET.socketId}`);
    // console.log(`socket connection id OKAY`);
});

socket.on("fileAnalysisComplete", (payload) => {
    // TODO: If on document page > stop spinners and render items
    // TODO: Otherwise pop alert
    console.log(`${payload.file.OriginalName} analysis complete`);
    const pageId = getPageId();
    switch(pageId) {
        case 'home':
            // TODO: Do something when each file is uploaded..
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
            createAlert('All files are analysed - click on Documents in the nav bar', AlertType.SUCCESS);
            // Remove spinner
            document.querySelector('#accordion-spinner')?.classList.add('hidden');

            // update accordion text
            const accordionButton = document.querySelector('.accordion-button');
            accordionButton.textContent = 'Files analysed - click Documents in nav bar';
            accordionButton.classList.add('text-white');
            accordionButton.classList.add('bg-success');
            const checkIcon = createElement('i', ['fas', 'fa-check'],"");
            accordionButton.append(checkIcon);

            break;
        case 'documents':
            createAlert('All files are analysed - click on Documents in the nav bar', AlertType.SUCCESS);
            break;
        default:
            console.log(`All files analysed - No condition for pageId: ${pageId}`);
    }
});

