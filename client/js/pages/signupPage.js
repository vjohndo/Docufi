function renderSignup() {
    
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