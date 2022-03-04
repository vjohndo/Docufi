function renderAuthenticatedHeader() {
    // Removed this as authentication/check is handled in middleware
    // let session = await axios.get("/api/sessions/loggedIn")
    const header = document.querySelector('#header-nav');
    header.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="https://docufi-app.herokuapp.com/"><i class="fas fa-book-open"></i> Docufi</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                <a class="nav-link active" aria-current="page" id="Home" >Home</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" id="Documents">Documents</a>
                </li>
                <li class="nav-item">
                <a class="nav-link text-danger" id="Logout">Logout</a>
                </li>
            </ul>
            </div>
        </div>
    </nav>
    `;

    // custom event handlers
    header.querySelectorAll('ul>li>a')?.forEach(element => {
        element.addEventListener('click', onHeaderSelected);
    });
}

function onHeaderSelected(e) {
    // remove active class from all headers
    document.querySelectorAll('ul>li>a')?.forEach(x => x.classList.remove('active'));
    // add active class to selected header
    e.target.classList.add('active');

    switch (e.target.id) {
        case "Home":
            renderHomePage();
            break;
        case "Documents":
            renderDocumentsPage();
            break;
        case "Login":
            renderLogin();
            break;
        case "Logout":
            logout();
            break
        case "Signup":
            renderSignup();
            break
        default:
            renderHomePage();
    }
}

function renderUnauthenticatedHeader() {
    const header = document.querySelector('#header-nav');
    header.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="https://docufi-app.herokuapp.com/"><i class="fas fa-book-open"></i> Docufi</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
            </div>
        </div>
    </nav>
    `;
}

function toggleHeaderSessionOptions(bool) {
    document.querySelectorAll('.nav-item')?.forEach(
        e => bool ? e.classList?.remove('hidden') : e.classList?.add('hidden')
    );
}