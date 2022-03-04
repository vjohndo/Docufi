function renderLogin() {
    // Get the page, create a form
    let { page } = getClearPage();
    page.replaceChildren("");
    // TO DO.. clean up the HTML
    page.innerHTML = `
        <div class="container-md">
            <h3>Welcome to Docufi</h3>
            <p>Docufi allows you to upload PDFs and analyse the text using Natural Language Processing.</p>
            <p>Determine the sentiment of your text, identify key phrases and entities such as people, places and organisations!</p>
            <p><small>Login or Sign Up to start analysing your files.</small></p>
            <div class="row">
                <div class="col-md-4">
                    <form id="loginForm" method="POST">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email address</label>
                            <input type="email" class="form-control" aria-describedby="emailHelp" name="email">
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">Password</label>
                            <input type="password" class="form-control" name="password">
                        </div>
                        <button id="submitLogin" type="submit" class="btn btn-primary">Login</button>
                        <button id="signup" type="submit" class="btn btn-secondary">Sign Up</button>
                    </form>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div id="loginMessage" class="alert alert-danger hidden" role="alert">
                    </div>
                </div>
            </div>
        </div>
    `

    // Grab the form we just created
    const form = document.getElementById("loginForm");

    // Add event listener to button that submits and prevents default
    form.addEventListener("submit", (event) => {
    
        // Prevents the browsers default actions. In this case, refreshing on a submit
        event.preventDefault();

        // Create a new form data object
        const formData = new FormData(form)

        // Create a set of entries from the form data
        const data = Object.fromEntries(formData.entries())
        
        // Send to the sessions API
        axios.post('/api/sessions', data)
            .then((res) => {
                // on success render the Home Page
                renderAuthenticatedHeader();
                renderHomePage();
            })
            .catch(err => {
                // on fail render the fail message
                const loginMessage = document.getElementById("loginMessage");
                loginMessage.textContent = (err.response.data.message);
                loginMessage.classList.remove("hidden");
                console.log(err.response.data.message);
            })            
    });

    page.querySelector('#signup').addEventListener('click', e => {
       renderSignup();
    });

} 

function logout() {
    axios.delete('/api/sessions').then((res) => {
        toggleHeaderSessionOptions(false);
        renderLogin();
    })
}