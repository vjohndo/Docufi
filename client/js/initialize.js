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
    console.log(`Server to client: ${payload}`);
});

