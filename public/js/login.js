// ========== MODAL ELEMENTS ==========
const authModalEl = document.getElementById('auth-modal');
const authModal = authModalEl ? new bootstrap.Modal(authModalEl) : null;

const loginSignupBtn = document.getElementById('login-signup-btn');
const closeModalBtn = document.getElementById('close-modal');

// ========== TABS & FORMS ==========
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// ========== ERROR ELEMENTS ==========
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const emailErrorSignup = document.getElementById('emailErrorSignup');
const passwordErrorSignup = document.getElementById('passwordErrorSignup');
const passwordErrorNoMatch = document.getElementById('passwordErrorMatch');

// ========== SAFE LISTENER HELPERS ==========
function safeOn(id, event, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
}

// ========== RESET FIELDS ==========
function resetFormFields(form) {
    if (!form) return;

    form.querySelectorAll('input').forEach(input => input.value = '');

    emailError?.classList.remove('active');
    passwordError?.classList.remove('active');
    emailErrorSignup?.classList.remove('active');
    passwordErrorSignup?.classList.remove('active');
    passwordErrorNoMatch?.classList.remove('active');
}

// ========== OPEN MODAL ==========
if (loginSignupBtn && authModal) {
    loginSignupBtn.addEventListener('click', () => {
        authModal.show();
    });
}

// ========== CLOSE MODAL ==========
if (closeModalBtn && authModal) {
    closeModalBtn.addEventListener('click', () => {
        authModal.hide();
    });
}

// ========== SWITCH TO SIGNUP ==========
if (signupTab) {
    signupTab.addEventListener('click', () => {
        loginTab?.classList.remove('active');
        signupTab.classList.add('active');

        loginForm?.classList.add('d-none');
        signupForm?.classList.remove('d-none');

        resetFormFields(loginForm);
    });
}

// ========== SWITCH TO LOGIN ==========
if (loginTab) {
    loginTab.addEventListener('click', () => {
        signupTab?.classList.remove('active');
        loginTab.classList.add('active');

        signupForm?.classList.add('d-none');
        loginForm?.classList.remove('d-none');

        resetFormFields(signupForm);
    });
}

// ========== AUTOSWITCH HELPERS ==========
function userExists() {
    loginTab?.click();
}
function userDoesNotExists() {
    signupTab?.click();
}

// ========== ERROR MODAL ==========
function showModal(message, type) {
    const loginErr = document.getElementById('loginErrorMessage');
    const signupErr = document.getElementById('signupErrorMessage');

    if (!loginErr || !signupErr) return;

    loginErr.style.display = 'none';
    signupErr.style.display = 'none';

    if (type === 'login') {
        loginErr.textContent = message;
        loginErr.style.display = 'block';
    } else {
        signupErr.textContent = message;
        signupErr.style.display = 'block';
    }

    new bootstrap.Modal(document.getElementById('errorModal')).show();
}

// ========== LOGOUT HANDLER ==========
safeOn('logoutButton', 'click', () => {
    localStorage.clear();
    sessionStorage.clear();
    console.log("done");
    window.location.href = '/logout';
});

// ========== LOGIN SUBMIT ==========
safeOn('login-btn', 'click', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value.trim();

    emailError?.classList.remove('active');
    passwordError?.classList.remove('active');

    let valid = true;

    if (!/^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/.test(email)) {
        emailError?.classList.add('active');
        valid = false;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/.test(password)) {
        passwordError?.classList.add('active');
        valid = false;
    }

    if (!valid) return;

    try {
        const response = await axios.post('/auth/login', { email, password });
        const msg = response.data.message;

        if (msg === 'Login successful') {
           // 🔥 Fix: Clear everything from old user first
localStorage.removeItem('loggedInUser');
localStorage.removeItem('loggedInUserId');

// 🔥 Save fresh values
localStorage.setItem('loggedInUserId', response.data.userId);

window.location.reload();

        } else {
            authModal?.hide();
            showModal(msg, 'login');
        }
    } catch (err) {
        showModal(err.response?.data?.message || 'Login failed.', 'login');
    }
});

// ========== SIGNUP SUBMIT ==========
safeOn('signup-btn', 'click', async (e) => {
    e.preventDefault();

    const email = document.getElementById('signup-email')?.value.trim();
    const password = document.getElementById('signup-password')?.value.trim();
    const confirmPassword = document.getElementById('confirm-password')?.value.trim();

    emailErrorSignup?.classList.remove('active');
    passwordErrorSignup?.classList.remove('active');
    passwordErrorNoMatch?.classList.remove('active');

    let valid = true;

    if (!/^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/.test(email)) {
        emailErrorSignup?.classList.add('active');
        valid = false;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/.test(password)) {
        passwordErrorSignup?.classList.add('active');
        valid = false;
    }
    if (password !== confirmPassword) {
        passwordErrorNoMatch?.classList.add('active');
        valid = false;
    }

    if (!valid) return;

    try {
        const res = await axios.post('/auth/signup', { email, password });
        const { message, userId } = res.data;

        if (message === "User already exists") {
            userExists();
            showModal(message, 'signup');
        } else {
            showModal("Signup successful.", 'signup');
           // 🔥 Fix: Clear old stale user
localStorage.removeItem('loggedInUser');
localStorage.removeItem('loggedInUserId');

// 🔥 Save new user
localStorage.setItem('loggedInUserId', userId);

window.location.reload();

        }
    } catch (err) {
        showModal(err.response?.data?.message || 'Signup failed.', 'signup');
    }
});

// ========== BUTTON ENABLE/DISABLE ==========
function toggleButtonState(formId, btnId) {
    const form = document.getElementById(formId);
    const btn = document.getElementById(btnId);

    if (!form || !btn) return;

    const filled = [...form.querySelectorAll('input')].every(i => i.value.trim() !== '');

    btn.style.backgroundColor = filled ? "#343a40" : "#007bff";
    btn.disabled = !filled;
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        if (loginTab?.classList.contains('active')) {
            toggleButtonState('login-form', 'login-btn');
        } else {
            toggleButtonState('signup-form', 'signup-btn');
        }
    });
});

toggleButtonState('login-form', 'login-btn');
toggleButtonState('signup-form', 'signup-btn');

// ========== HOME BUTTON BEHAVIOR ==========
safeOn("home-btn", "click", function (event) {
    event.preventDefault();

    

    
        window.location.href = "/";
    
});


