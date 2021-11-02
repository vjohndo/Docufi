// TODO: Get user login status and render Auth / Unauth components
axios.get('/api/sessions').then(response => {
    // render authenticated defaults
    renderAuthenticatedHeader();
    renderHomePage();
}).catch(response => {
    renderUnauthenticatedHeader();
    renderLogin();
});

