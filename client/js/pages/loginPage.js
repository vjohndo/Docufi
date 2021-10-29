function renderLogin() {
    // Get the page, create a form
    const page = document.getElementById("page");
    page.replaceChildren("");
    page.innerHTML = `
        <div class="container-md">
            <div class="row">
                <div class="col-sm-6">
                    <form id="loginForm" method="POST">
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email">
                            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" name="password">
                        </div>
                        <button id="submitLogin" type="submit" class="btn btn-primary">Submit</button>
                    </form>
                <div class="col">
            </div>
            <div class="row">
                <div class="col-sm-6">
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
                renderHomePage();
            })
            .catch(err => {
                // on fail render the fail message
                const loginMessage = document.getElementById("loginMessage");
                loginMessage.textContent = (err.response.data.message);
                loginMessage.classList.remove("hidden");
                console.log(err.response.data.message);
            })            
    })
    
}

function logout() {
    axios.delete('/api/sessions').then((res) => {
        location.href = "/"; // Remove after fixing the login
    })
}