// Amount calculation
function calculateAmount(sec, price) {
    const s = new Date(document.getElementById(`startDate${sec}`).value);
    const e = new Date(document.getElementById(`endDate${sec}`).value);

    if (isNaN(s) || isNaN(e) || s > e) {
        document.getElementById(`result${sec}`).innerHTML =
            '<p class="text-danger">Please select valid dates.</p>';
        return;
    }

    const days = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    const result = days > 0 ? `₹${days * price}` : 'Please select a valid date range.';
    document.getElementById(`result${sec}`).innerHTML = `<p>${result}</p>`;
}

// Login check
function isUserLoggedIn() {
    return localStorage.getItem('loggedInUserId') !== null;
}

// Main logic
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.confirm-btn');

    buttons.forEach((btn, i) => {
        const s = document.getElementById(`startDate${i}`);
        const e = document.getElementById(`endDate${i}`);
        const price = parseFloat(btn.dataset.price);

        [s, e].forEach(inp => {
            inp.addEventListener('change', () => {
                
                // ❗ Prevent selecting past dates
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (new Date(s.value) < today) {
                    btn.disabled = true;
                    document.getElementById(`result${i}`).innerHTML =
                        '<p class="text-danger">Start date cannot be in the past.</p>';
                    return;
                }

                if (s.value && e.value && new Date(e.value) > new Date(s.value)) {
                    if (!isUserLoggedIn()) {
                        closeOpenProductModal();

                        new bootstrap.Modal(document.getElementById('sendRequestModal')).show();
                        return;
                    }
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }

                calculateAmount(i, price);
            });
        });

        // Send request
        btn.addEventListener('click', () => {
            if (!s.value || !e.value) return alert("Please fill in both dates.");

            const days = (new Date(e.value) - new Date(s.value)) / (1000 * 60 * 60 * 24);
            const total = price * days;

            axios.post('/requests/sendRequest', {
                product_id: btn.dataset.productId,
                start_date: s.value,
                end_date: e.value,
                total_amount: total
            })
                .then(res => {
                    if (res.data.success) {
                        closeOpenProductModal();

                        new bootstrap.Modal(document.getElementById('confirmationModal')).show();
                        console.log("Request sent");
                    }
                })
                .catch(err => {
                    // CHECK FOR PROFILE INCOMPLETE
                    if (err.response && err.response.status === 400 &&
                        err.response.data.incompleteProfile) {
                            closeOpenProductModal();

                        new bootstrap.Modal(document.getElementById('profileIncompleteModal')).show();
                       
                    }

                    // CHECK NOT LOGGED IN
                    if (err.response && err.response.status === 401 &&
                        err.response.data.notLoggedIn) {
                            closeOpenProductModal();

                        new bootstrap.Modal(document.getElementById('sendRequestModal')).show();
                        return;
                    }

                    console.error(err);
                });
        });
    });
});
document.getElementById("goToAccountBtn").addEventListener("click", function () {
    window.location.href = "/account";
});

function closeOpenProductModal() {
    const openProductModal = document.querySelector('.modal.show[id^="confirmModal"]');
    if (openProductModal) {
        const instance = bootstrap.Modal.getInstance(openProductModal);
        instance.hide();
    }
}
