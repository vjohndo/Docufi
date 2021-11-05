function createAlert(alertMessage, alertType) {
    // To only permit one alert at a time
    // $.bootstrapGrowl.remove()
    let res = $.bootstrapGrowl(alertMessage, {
        type: alertType,
        offset: { from: 'bottom', amount: 10},
        delay: 5000,
        allow_dismiss: false,
        stackup_spacing: 10
    });
}

const AlertType = Object.freeze({
    SUCCESS: "success",
    INFO: "info",
    ERROR: "error"
});