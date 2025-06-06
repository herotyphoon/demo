function deleteAccount() {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
        alert("Account deleted (this is a placeholder)");
        window.location.href = "index.html";
    }
}