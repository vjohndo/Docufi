function createAlert(alertMessage, alertType) {
    const alertElement = createAlertElement(alertMessage, alertType);
    alertElement.textContent = alertMessage;
    alertElement.classList.add('show');

    setTimeout(function () {
        alertElement.classList.remove('show');
    }, 4000);
}

function createAlertElement(alertMessage, alertType) {
    // delete alert element if exists
    if (document.contains(document.querySelector('.alert'))) {
        document.querySelector('.alert').remove();
    }

    const alertHtmlStr = `
        <div class="alert alert-success fade" role="alert">
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;

    const page = document.querySelector('#page');
    page.insertAdjacentHTML('beforeend', alertHtmlStr);

    const alertElement = page.querySelector('.alert');

    switch (alertType) {
        case AlertType.SUCCESS :
            alertElement.classList.add('alert-success');
            break;
        case AlertType.PRIMARY :
            alertElement.classList.add('alert-primary');
            break;
        case AlertType.WARNING :
            alertElement.classList.add('alert-warning');
            break;
        default:
            alertElement.classList.add('alert-primary');
            break;
    }

    return alertElement;
}

const AlertType = Object.freeze({
    SUCCESS: "alert-success",
    PRIMARY: "alert-primary",
    WARNING: "alert-warning"
});