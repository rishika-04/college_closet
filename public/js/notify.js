document.addEventListener("DOMContentLoaded", () => {

  // ACCEPT REQUEST
  document.querySelectorAll(".confirmOkButton").forEach(btn => {
    btn.addEventListener("click", async () => {

      const notificationId = btn.dataset.id;
      const modal = btn.closest(".modal");
      const requestId = modal.dataset.requestId;
      const productId = modal.dataset.productId;

      try {
        const res = await fetch(`/requests/update-request/${requestId}`, { 
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "approved", productId })
        });

        const data = await res.json();
        if (data.success) location.reload();
        else console.error(data.message);

      } catch (err) {
        console.error(err);
      }
    });
  });

  // DECLINE REQUEST
  // DECLINE REQUEST
document.querySelectorAll(".modalSureButton").forEach(btn => {
  btn.addEventListener("click", async () => {

    const notificationId = btn.dataset.id;
    const modal = btn.closest(".modal");
    const requestId = modal.dataset.requestId;
    const productId = modal.dataset.productId;   // <-- IMPORTANT

    try {
      const res = await fetch(`/requests/update-request/${requestId}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", productId })  // <-- send it
      });

      const data = await res.json();
      if (data.success) location.reload();
      else console.error(data.message);

    } catch (err) {
      console.error(err);
    }
  });
});

});
