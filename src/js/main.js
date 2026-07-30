import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const newsletterForm = document.querySelector("#newsletter-form");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
        event.preventDefault();

        alertMessage("Thank you for subscribing to our newsletter!", false);

        newsletterForm.reset();
    });
}