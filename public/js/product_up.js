const categorySelect = document.getElementById('categorySelect');
const productNameSelect = document.getElementById('productNameSelect');

const productOptions = {
    Stationery: ["Scientific Calculator", "Notebook", "Technical Drawing Sets", "Drafting Pens"],
    Lab: ["Lab Coat", "Lab Glasses", "Laser Distance Meter"],
    Notes: ["Handwritten Class Notes", "Softcopy Notes", "Architectural History Summaries", "Reusable CAD Files or Templates"],
    Furniture: ["Adjustable Drafting Tables", "Compact Study Desks", "Ergonomic Chairs"],
    Fashion: ["Formal Suits", "High Visibility Jackets", "Traditional Attire", "Basics"],
    Others: ["3D Printers", "Bicycles", "Electronics"]
};

categorySelect.addEventListener('change', () => {
    const value = categorySelect.value;
    productNameSelect.innerHTML = '<option value="" disabled selected>Choose Product</option>';

    if (productOptions[value]) {
        productOptions[value].forEach(p => {
            const opt = document.createElement('option');
            opt.value = p;
            opt.textContent = p;
            productNameSelect.appendChild(opt);
        });
    }
});

function isUserLoggedIn() {
    return localStorage.getItem('loggedInUserId') !== null;
}


function previewImage(e) {
    const reader = new FileReader();
    reader.onload = () => {
        document.getElementById('profileImage').src = reader.result;
    };
    reader.readAsDataURL(e.target.files[0]);
}

document.addEventListener("DOMContentLoaded", () => {
    const uploadBtn = document.querySelector(".profile-button");
    if (uploadBtn) {
        uploadBtn.addEventListener("click", () => uploadBtn.classList.add("clicked"));
    }
});

document.getElementById('logoutButton').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const res = await fetch('/logout');
        if (res.ok) {
            localStorage.setItem('loggedInUserId', null);
            window.location.href = "/";
        }
    } catch (err) {
        console.error(err);
    }
});



document.addEventListener("DOMContentLoaded", () => {
    console.log("upload-product-form script loaded");

    const form = document.getElementById("upload-product-form");

    if (!form) {
        console.log("Form not found!");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Upload form submit intercepted");

        const formData = new FormData(form);

        const response = await fetch("/products/uploadProduct", {
            method: "POST",
            body: formData
        });

        if (response.redirected) {
            console.log("Redirecting...");
            window.location.href = response.url;
            return;
        }

        const data = await response.json();
        console.log("Server response:", data);

        if (data.modal) {
            const modalEl = document.getElementById(data.modal);
            console.log("Opening modal:", data.modal);
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        }
    });
});