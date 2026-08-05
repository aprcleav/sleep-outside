import { loadHeaderFooter, alertMessage } from "./utils.mjs";

loadHeaderFooter();

// Newsletter form
const newsletterForm = document.querySelector("#newsletter-form");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
        event.preventDefault();

        alertMessage("Thank you for subscribing to our newsletter!", false);

        newsletterForm.reset();
    });
}

// Welcome modal
const modal = document.getElementById("welcome-modal");
const closeBtn = document.getElementById("close-modal");

if (modal && !localStorage.getItem("welcomeModalShown")) {
    modal.classList.remove("hidden");
}

if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        localStorage.setItem("welcomeModalShown", "true");
    });
}