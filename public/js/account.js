// ------------------- LOGIN STATUS --------------------
function isUserLoggedIn() {
    const userId = localStorage.getItem('loggedInUserId');
    return userId !== null && userId !== "null";
}

// ------------------- INPUT VALIDATIONS --------------------
function restrictInput(event, pattern) {
    const char = String.fromCharCode(event.which);
    if (!pattern.test(char)) event.preventDefault();
}

function capitalizeFirstLetter(inputField) {
    inputField.value = inputField.value.replace(/^\w/, c => c.toUpperCase());
}

function validateEmail(emailField) {
    const pattern = /^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/;
    if (!pattern.test(emailField.value.trim()))
        emailField.classList.add('is-invalid');
    else
        emailField.classList.remove('is-invalid');
}

function handlePhoneNumberInput(field) {
    field.value = field.value.replace(/\D/g, '').slice(0, 10);
}

// ------------------- FORM SUBMIT --------------------
document.getElementById('profileForm').addEventListener('submit', function (event) {
    validateEmail(document.getElementById('emailField'));
    handlePhoneNumberInput(document.getElementById('phoneNumber'));

    if (!this.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }

    this.classList.add('was-validated');
});

// ------------------- REAL-TIME INPUT HANDLERS --------------------
const firstNameField = document.getElementById('firstName');
const lastNameField = document.getElementById('lastName');
const phoneNumberField = document.getElementById('phoneNumber');
const roomNumberField = document.getElementById('roomNumber');

firstNameField.addEventListener('input', () => capitalizeFirstLetter(firstNameField));
lastNameField.addEventListener('input', () => capitalizeFirstLetter(lastNameField));

firstNameField.addEventListener('keypress', e => restrictInput(e, /^[a-zA-Z]+$/));
lastNameField.addEventListener('keypress', e => restrictInput(e, /^[a-zA-Z]+$/));
phoneNumberField.addEventListener('keypress', e => restrictInput(e, /^[0-9]+$/));
roomNumberField.addEventListener('keypress', e => restrictInput(e, /^[0-9]+$/));

phoneNumberField.addEventListener('input', () => handlePhoneNumberInput(phoneNumberField));

roomNumberField.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 4);
});

// ------------------- FIRST NAME LIVE UPDATE --------------------
document.getElementById('firstName').addEventListener('input', function () {
    document.getElementById('displayFirstName').textContent =
        this.value.trim() || "Edogaru";
});

// ------------------- IMAGE PREVIEW --------------------
function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        document.getElementById('profileImage').src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

// ------------------- SELECT FIELD PLACEHOLDER COLOR --------------------
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".form-select").forEach(select => {
        updateSelectColor(select);
        select.addEventListener("change", () => updateSelectColor(select));
    });

    function updateSelectColor(select) {
        select.style.color = select.value === "" ? "#6c757d" : "black";
    }
});



// ------------------- PRODUCT UPLOAD → LOGIN MODAL --------------------
document.getElementById('loginSignupButton').addEventListener('click', function () {
    const uploadModal = bootstrap.Modal.getInstance(document.getElementById('productUploadModal'));
    if (uploadModal) uploadModal.hide();
    new bootstrap.Modal(document.getElementById('auth-modal')).show();
});

// ------------------- LOGOUT --------------------
document.getElementById('logoutButton').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const response = await fetch('/logout');
        if (response.ok) {
            localStorage.setItem('loggedInUserId', "null"); // FIXED
            window.location.href = "/";
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
});



