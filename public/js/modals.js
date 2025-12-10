// modals.js — robust version with delegation and safe checks
document.addEventListener('DOMContentLoaded', () => {

  // ---------- helpers ----------
  const debug = (...args) => {
    // set to false to silence
    const ON = true;
    if (ON) console.log('[modals.js]', ...args);
  };

  function isUserLoggedIn() {
    // prefer server-side rendering to hide buttons, but fallback to localStorage
    return !!localStorage.getItem('loggedInUserId');
  }

  function showModalById(id) {
    const el = document.getElementById(id);
    if (!el) {
      debug('showModalById: modal element not found:', id);
      return;
    }
    const m = new bootstrap.Modal(el);
    m.show();
  }

  function hideModalByEl(el) {
    if (!el) return;
    const inst = bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el);
    inst.hide();
  }

  // ---------- safe element getter ----------
  function safeEl(id) {
    return document.getElementById(id) || null;
  }

  // ---------- direct handlers for navbar items (safe attach) ----------
  const accountDropDown = safeEl('accountDropDown');
  if (accountDropDown) {
    accountDropDown.addEventListener('click', (e) => {
      if (!isUserLoggedIn()) {
        e.preventDefault();
        debug('account clicked — user not logged in, opening AccountModal');
        showModalById('AccountModal');
      } else {
        // let it behave normally (or redirect explicitly)
        window.location.href = '/account';
      }
    });
  }

  const uploadProductDropdown = safeEl('uploadProductDropdown');
  if (uploadProductDropdown) {
    uploadProductDropdown.addEventListener('click', (e) => {
      if (!isUserLoggedIn()) {
        e.preventDefault();
        debug('upload product clicked — user not logged in, opening productUploadModal');
        showModalById('productUploadModal');
      } else {
        window.location.href = '/product_up';
      }
    });
  }

  const myProductsDropdown = safeEl('myProductsDropdown');
  if (myProductsDropdown) {
    myProductsDropdown.addEventListener('click', (e) => {
      if (!isUserLoggedIn()) {
        e.preventDefault();
        debug('myProducts clicked — user not logged in, opening myProductsModal');
        showModalById('myProductsModal');
      } else {
        window.location.href = '/myProducts';
      }
    });
  }

  const notificationsDropdown = safeEl('notificationsDropdown');
  if (notificationsDropdown) {
    notificationsDropdown.addEventListener('click', (e) => {
      if (!isUserLoggedIn()) {
        e.preventDefault();
        debug('notifications clicked — user not logged in, opening notificationsModal');
        showModalById('notificationsModal');
      } else {
        window.location.href = '/notifications';
      }
    });
  }

  // logout (safe)
  const logoutButton = safeEl('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      // If user not logged-in, show successLogoutModal (your original behavior)
      if (!isUserLoggedIn()) {
        e.preventDefault();
        debug('logout clicked while not logged in — showing successLogoutModal');
        showModalById('successLogoutModal');
      } else {
        // do a real logout redirect
        window.location.href = '/logout';
      }
    });
  }

  // goToAccount button in profileIncompleteModal
  const goToAccountBtn = safeEl('goToAccountBtn');
  if (goToAccountBtn) {
    goToAccountBtn.addEventListener('click', () => {
      window.location.href = '/account';
    });
  }

  // handle showing profileIncompleteModal if ?incomplete=1
  (function showProfileIncompleteIfNeeded() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('incomplete') === '1') {
      debug('URL indicates incomplete profile -> showing profileIncompleteModal');
      showModalById('profileIncompleteModal');

      // remove from URL so refresh doesn't show modal again
      const url = new URL(window.location.href);
      url.searchParams.delete('incomplete');
      window.history.replaceState({}, '', url);
    }
  })();


  // ---------- robust "open auth modal from any modal" ----------
  // Use event delegation to catch clicks on ANY element with class "open-auth-btn".
  // This works for static and dynamic elements and avoids missing listeners.
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.open-auth-btn');
    if (!btn) return; // not our button

    e.preventDefault();
    debug('open-auth-btn clicked:', btn);

    // Find the currently visible modal (if any)
    const openModalEl = document.querySelector('.modal.show');

    // If no modal open, just show auth modal
    if (!openModalEl) {
      debug('no modal open -> showing auth-modal immediately');
      showModalById('auth-modal');
      return;
    }

    // If the auth modal is already open (edge case), do nothing
    if (openModalEl.id === 'auth-modal') {
      debug('auth-modal is already open');
      return;
    }

    // Otherwise, wait for the currently open modal to fully hide, then show auth-modal
    const onHidden = function handler() {
      openModalEl.removeEventListener('hidden.bs.modal', handler);
      debug('previous modal hidden -> showing auth-modal now');
      showModalById('auth-modal');
    };

    // Attach the hidden.bs.modal listener then hide the open modal
    openModalEl.addEventListener('hidden.bs.modal', onHidden);

    const inst = bootstrap.Modal.getInstance(openModalEl) || new bootstrap.Modal(openModalEl);
    inst.hide();
  });


  // ---------- support for productUploadModal -> auth modal button (fallback) ----------
  // In case you used a specific id like 'loginSignupButton' elsewhere:
  const loginSignupButton = safeEl('loginSignupButton');
  if (loginSignupButton) {
    loginSignupButton.addEventListener('click', () => {
      // try hide productUploadModal if open
      const puEl = document.getElementById('productUploadModal');
      const puInst = puEl ? (bootstrap.Modal.getInstance(puEl) || new bootstrap.Modal(puEl)) : null;
      if (puInst) puInst.hide();
      showModalById('auth-modal');
    });
  }

  // ---------- small defensive console logs to help debugging ----------
  debug('modals.js initialized. userLoggedIn =', isUserLoggedIn());
  debug('Available modals:', Array.from(document.querySelectorAll('.modal')).map(m => m.id));

});



const openedModal = bootstrap.Modal.getInstance(document.querySelector(".modal.show"));
if (openedModal) openedModal.hide();
