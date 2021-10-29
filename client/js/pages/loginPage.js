function renderLogin() {
    // Get the page, create a form
    const page = document.getElementById("page");
    page.replaceChildren("");
<<<<<<< HEAD
    // TO DO.. clean up the HTML
    page.innerHTML = `
        <div class="container-md">
            <div class="row">
                <div class="col-md-4">
                    <form id="loginForm" method="POST">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email">
=======
    page.innerHTML = `
        <div class="container-md">
            <div class="row">
                <div class="col-sm-6">
                    <form id="loginForm" method="POST">
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email">
                            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
>>>>>>> 93d0238684b40e6e76c18c5e5e302d61a52b3995
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
                const loginMessage = document.getElementById("loginMessage");
                loginMessage.textContent = (err.response.data.message);
                loginMessage.classList.remove("hidden");
                console.log(err.response.data.message);
            })            
    })
<<<<<<< HEAD
} 
=======
    
}
>>>>>>> 93d0238684b40e6e76c18c5e5e302d61a52b3995

function logout() {
    axios.delete('/api/sessions').then((res) => {
        location.href = "/"; // Remove after fixing the login
    })
}