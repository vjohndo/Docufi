function renderHomePage() {
    let { page } = getClearPage();
    let message = createElement('p',[],'Welcome to the home page');
    page.appendChild(message);
}
