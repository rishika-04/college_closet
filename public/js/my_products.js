document.addEventListener('DOMContentLoaded', () => {

    // Calculate rental amount
    function calculateAmount(index, pricePerDay) {
        const start = new Date(document.getElementById(`startDate${index}`).value);
        const end = new Date(document.getElementById(`endDate${index}`).value);
        const resultBox = document.getElementById(`result${index}`);

        if (isNaN(start) || isNaN(end) || start > end) {
            resultBox.innerHTML = '<p class="text-danger">Please select valid dates.</p>';
            return;
        }

        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (days > 0) {
            resultBox.innerHTML = `<p>Total Amount: ₹${days * pricePerDay}</p>`;
        } else {
            resultBox.innerHTML = '<p class="text-danger">Please select a valid date range.</p>';
        }
    }

    // Enable confirm buttons based on date input
    document.querySelectorAll('.confirm-btn').forEach((btn, index) => {
        const startInput = document.getElementById(`startDate${index}`);
        const endInput = document.getElementById(`endDate${index}`);
        const price = parseFloat(btn.getAttribute('data-price'));

        if (isNaN(price)) return;

        [startInput, endInput].forEach(input => {
            input.addEventListener('change', () => {
                const start = startInput.value;
                const end = endInput.value;

                if (start && end && new Date(end) > new Date(start)) {
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }

                calculateAmount(index, price);
            });
        });
    });
});


// Logout
document.getElementById('logoutButton').addEventListener('click', async (e) => {
    e.preventDefault();

    try {
        const res = await fetch('/logout', { method: 'GET' });
        if (res.ok) window.location.href = "/";
    } catch (err) {
        console.error("Logout error:", err);
    }
});


// Search validation
document.querySelector('.search-form').addEventListener('submit', function (e) {
    const input = this.querySelector('.search-input');
    const error = this.querySelector('.error-message');

    if (!input.value.trim()) {
        e.preventDefault();
        error.textContent = 'Please enter a search query.';
        error.classList.add('visible');
    } else {
        error.textContent = '';
        error.classList.remove('visible');
    }
});
