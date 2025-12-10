// Search form validation
document.querySelector('.search-form').addEventListener('submit', function (e) {
    const input = this.querySelector('.search-input');
    const errorMessage = this.querySelector('.error-message');

    if (!input.value.trim()) {
        e.preventDefault();
        errorMessage.textContent = 'Please enter a search query.';
        errorMessage.classList.add('visible');
    } else {
        errorMessage.textContent = '';
        errorMessage.classList.remove('visible');
    }
});

// Category redirect (UPDATED)
document.querySelectorAll('.category-link').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        event.preventDefault();
        const category = this.getAttribute('data-query'); 
        window.location.href = `/search?category=${category}`;  // FIXED
    });
});

