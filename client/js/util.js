function createElement(type, classes, text, attributes) {
    classes = (typeof classes === 'undefined') ? [] : classes;
    text = (typeof text == 'undefined') ? "" : text;
    attributes = (typeof attributes == 'undefined') ? [] : attributes;

    let element = document.createElement(type);
    classes.forEach(c => { element.classList.add(c) });
    attributes.forEach(a => { element.setAttribute(Object.keys(a)[0], a[Object.keys(a)[0]]) });
    element.textContent = text;

    return element;
}

function getClearPage() {
    const searchBox = document.getElementById("searchButton");
    searchBox.removeEventListener("input", getSearchedDocuments);
    const page = document.querySelector('#page');
    page.innerHTML = "";
    return { "page": page };
    
}