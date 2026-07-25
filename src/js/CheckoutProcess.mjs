import {
  getLocalStorage, alertMessage,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// STEP 6 OF TEAM PROJECT NEEDS TO BE COMPLETED HERE
const services = new ExternalServices();

function formDataToJSON(formElement) {
  // convert form data to JSON object
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

// takes the items currently stored in the cart (localstorage) and returns them in a simplified form.

// Convert cart products into the format required by the checkout server.
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: Number(item.FinalPrice),
    quantity: item.quantity || 1,
  }));
}
function getErrorMessage(error) {
  if (!error) {
    return "Your order could not be completed.";
  }

  if (typeof error.message === "string") {
    return error.message;
  }

  if (Array.isArray(error.message)) {
    return error.message
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return item.message || JSON.stringify(item);
      })
      .join(" ");
  }

  if (error.message && typeof error.message === "object") {
    if (error.message.message) {
      return error.message.message;
    }

    return JSON.stringify(error.message);
  }

  return "Your order could not be completed. Please check your information and try again.";
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => {
      const price = Number(item.FinalPrice);
      const quantity = item.quantity || 1;

      return sum + price * quantity;
    }, 0);

    const subtotalElement = document.querySelector(
      `${this.outputSelector} #cart-total`,
    );

    if (subtotalElement) {
      subtotalElement.textContent = `$${this.itemTotal.toFixed(2)}`;
    }

    const numItemsElement = document.querySelector(
      `${this.outputSelector} #num-items`,
    );

    const numItems = this.list.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );

    if (numItemsElement) {
      numItemsElement.textContent = numItems;
    }
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;

    const numItems = this.list.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );

    this.shipping = numItems > 0 ? 10 + (numItems - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxElement = document.querySelector(
      `${this.outputSelector} #tax`,
    );

    const shippingElement = document.querySelector(
      `${this.outputSelector} #shipping`,
    );

    const orderTotalElement = document.querySelector(
      `${this.outputSelector} #order-total`,
    );

    if (taxElement) {
      taxElement.textContent = `$${this.tax.toFixed(2)}`;
    }

    if (shippingElement) {
      shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
    }

    if (orderTotalElement) {
      orderTotalElement.textContent = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  async checkout(form) {
    try {
      const formElement =
        form || document.forms["checkout"];

      if (!formElement) {
        throw new Error("The checkout form could not be found.");
      }

      const order = formDataToJSON(formElement);

      order.orderDate = new Date().toISOString();
      order.orderTotal = this.orderTotal.toFixed(2);
      order.tax = this.tax.toFixed(2);
      order.shipping = this.shipping;
      order.items = packageItems(this.list);

      const response = await services.checkout(order);

      console.log("Order completed:", response);

      localStorage.removeItem(this.key);

      window.location.href = "/checkout/success.html";

      return response;
    } catch (error) {
      console.error("Checkout error:", error);

      const message = getErrorMessage(error);
      alertMessage(message);

      return null;
    }
  }
}
