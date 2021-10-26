async function renderHomePage() {
    let { page } = getClearPage();
    let message = createElement('p',[],'Welcome to the home page');
    
    // Hook into existing p element for now to show logged in status. Will add to home page later.
    const isLoggedIn = await axios.get("/api/sessions")
    message.textContent += (isLoggedIn.data.email) ? ` - Logged in with ${isLoggedIn.data.email}` : ` - Not Logged in`;
    
    page.appendChild(message);
}
