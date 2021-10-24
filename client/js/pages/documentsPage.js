function renderDocumentsPage() {
    let { page } = getClearPage();
    let message = createElement('p',[],'This is the documents page');
    page.appendChild(message);
}