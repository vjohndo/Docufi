function renderSignup() {
    // Get the page, create a form
    let { page } = getClearPage();
    page.replaceChildren("");
    page.innerHTML = `
        <div class="container-md">
            <h4>Sign Up to Docufi</h4>
            <div class="row">
                <div class="col-md-4">
                    <form id="signupForm" method="POST">
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Email address</label>
                            <input type="email" class="form-control" aria-describedby="emailHelp" name="email">
                            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div class="mb-3">
                            <label for="firstName" class="form-label">First name</label>
                            <input type="text" class="form-control" id="firstName" name="firstname">
                        </div>
                        <div class="mb-3">
                            <label for="lastName" class="form-label">Last name</label>
                            <input type="text" class="form-control" id="lastName" name="lastname">
                        </div>
                        <div class="mb-3">
                            <label for="signupPassword" class="form-label">Password</label>
                            <input type="password" class="form-control" id="signupPassword" name="password">
                        </div>
                        <div class="mb-3">
                            <label for="signupPasswordConfirm" class="form-label">Confirm Password</label>
                            <input type="password" class="form-control" id="signupPasswordConfirm" name="passwordconfirm">
                        </div>
                        <button id="submitLogin" type="submit" class="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div id="signupMessage" class="alert alert-danger hidden" role="alert">
                    </div>
                </div>
            </div>
        </div>
    `

    // Grab the form we just created
    const form = document.getElementById("signupForm");

    // Add event listener to button that submits and prevents default
    form.addEventListener("submit", (event) => {
    
        // Prevents the browsers default actions. In this case, refreshing on a submit
        event.preventDefault();

        const signupPassword = document.getElementById("signupPassword");
        const signupPasswordConfirm = document.getElementById("signupPasswordConfirm");

        if (signupPassword.value !== signupPasswordConfirm.value) {
            const signupMessage = document.getElementById("signupMessage");
            signupMessage.textContent = "Passwords must match!";
            signupMessage.classList.remove("hidden");
            console.log('Passwords did not match');
        } else {
            // Create a new form data object
            const formData = new FormData(form)

            // Create a set of entries from the form data
            const data = Object.fromEntries(formData.entries())
            
            // Send to the sessions API
            axios.post('/api/signup', data)
                .then((res) => {
                    // on success render the Home Page
                    renderAuthenticatedHeader();
                    renderHomePage();
                })
                .catch(err => {
                    // on fail render the fail message
                    const signupMessage = document.getElementById("signupMessage");
                    signupMessage.textContent = err.response.data.message + ".";
                    signupMessage.classList.remove("hidden");
                    console.log(err.response.data.message);
            })      
        }
    })
}