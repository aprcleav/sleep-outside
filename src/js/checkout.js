import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

// Team Activity 4 step 6
// This is Justin's script from the checkout index.html file (I changed the variable name from checkout to order for clarity):
const dataSource = new ExternalServices();
const checkoutProcess = new CheckoutProcess(
    "so-cart",
    ".order-summary",
    dataSource,
);

checkoutProcess.init();

const checkoutForm = document.querySelector("#checkout-form");
const zipInput = document.querySelector("#zip");

zipInput.addEventListener("blur", () => {
    checkoutProcess.calculateOrderTotal();
});

checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid = checkoutForm.checkValidity();

    if (!isValid) {
        checkoutForm.reportValidity();
        return;
    }

    checkoutProcess.calculateOrderTotal();
    await checkoutProcess.checkout(checkoutForm);
});