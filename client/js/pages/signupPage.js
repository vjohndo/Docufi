function renderSignup() {
    // Get the page, create a form
    const page = document.getElementById("page");
    page.replaceChildren("");
    page.innerHTML = `
        <div class="container-md">
            <div class="row">
                <div class="col-md-4">
                    <form id="signupForm" method="POST">
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email">
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
                            <label for="exampleInputPassword1" class="form-label">Password</label>
                            <input type="password" class="form-control" id="signupPassword" name="password">
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword2" class="form-label">Confirm Password</label>
                            <input type="password" class="form-control" id="signupPasswordConfirm" name="passwordconfirm">
                        </div>
                        <button id="submitLogin" type="submit" class="btn btn-primary">Submit</button>
                    </form>
                <div class="col">
            </div>
            <div class="row">
                <div class="col-sm-6">
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

        if (signupPassword.value != signupPasswordConfirm.value) {
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
                    const login = document.getElementById("Login");
                    const signup = document.getElementById("Signup");
                    const logout = document.getElementById("Logout");
                    login.classList.toggle("hidden");
                    signup.classList.toggle("hidden");
                    logout.classList.toggle("hidden");
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

function renderSignup2() {
    
    // Get the page, create a form
    const page = document.getElementById("page");
    const form = document.createElement("form");

    // Clear the page
    page.replaceChildren("");

    // List of form inputs
    const formInputs = ["email","firstname","lastname","password"];

    // Go through each of the inputs, create elements for them including labels
    for (let inputName of formInputs) {
        let newFieldSet = document.createElement("fieldset");

        let newLabel = document.createElement("label");
        newLabel.htmlFor = inputName;
        newLabel.textContent = inputName + ":";

        let newInput = document.createElement("input");
        newInput.type = (inputName === "password") ? "password" : "text";
        newInput.name = inputName;

        newFieldSet.appendChild(newLabel);
        let newBr = document.createElement("br");
        newFieldSet.appendChild(newBr);
        newFieldSet.appendChild(newInput);
        form.appendChild(newFieldSet);
    }

    // Create a submit button
    const newSubmit = document.createElement("input");
    newSubmit.type = "submit";
    newSubmit.value = "SIGNUP";
    form.appendChild(newSubmit);

    // Add event listener to button that submits and prevents default
    form.addEventListener("submit", (event) => {
      
        // Prevents the browsers default actions. In this case, refreshing on a submit
        event.preventDefault()
        // Create a new form data object
        const formData = new FormData(form)

        // Create a set of entries from the form data
        const data = Object.fromEntries(formData.entries())

        // Send to the signup API
        axios.post('/api/signup', data)
            .then((res) => {
                // on success render the Home Page
                renderHomePage();
            })
            .catch(err => {
                // on fail render the fail message
                const confirmMessage = document.getElementById("confirmInsert");
                confirmMessage.textContent = (err.response.data.message);
                console.log(err.response.data.message);
            })            
    })

    const newP = document.createElement("p");
    newP.id = "confirmInsert";

    page.replaceChildren(form, newP);
}