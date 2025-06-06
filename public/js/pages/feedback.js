document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("feedbackForm");
    const successMessage = document.getElementById("successMessage");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            form.style.display = "none";
            if (successMessage) {
                successMessage.style.display = "block";
            }
        });
    }
});