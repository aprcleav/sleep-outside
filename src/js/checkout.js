import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

// Team Activity 4 step 6
// This is Justin's script from the checkout index.html file (I changed the variable name from checkout to order for clarity):
const order = new CheckoutProcess("so-cart", ".order-summary");
order.init();

document.querySelector("#zip").addEventListener("blur", () => {
    order.calculateOrderTotal();
});

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
    e.preventDefault();
    const myForm = document.forms[0];
    const checkStatus = myForm.checkValidity();
    myForm.reportValidity();
    if (checkStatus) {
        order.checkout();
    }
});

