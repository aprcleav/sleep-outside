import { getLocalStorage } from "./utils.mjs";

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
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + item.FinalPrice * item.quantity,
      0
    );

    const subtotalElement = document.querySelector(
      `${this.outputSelector} #cart-total`
    );
    subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;

    const numItemsElement = document.querySelector(
      `${this.outputSelector} #num-items`
    );
    const numItems = this.list.reduce((sum, item) => sum + item.quantity, 0);
    numItemsElement.innerText = numItems;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;

    const numItems = this.list.reduce((sum, item) => sum + item.quantity, 0);
    this.shipping = numItems > 0 ? 10 + (numItems - 1) * 2 : 0;

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    tax.innerText = `$${this.tax.toFixed(2)}`;

    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    shipping.innerText = `$${this.shipping.toFixed(2)}`;

    const orderTotal = document.querySelector(`${this.outputSelector} #order-total`);
    orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }


// STEP 6 OF TEAM PROJECT NEEDS TO BE COMPLETED HERE


  // takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
// function packageItems(items) {
  // convert the list of products from localStorage to the simpler form required for the checkout process.
  // An Array.map would be perfect for this process.

  async checkout(form) {
  // get the form element data by the form name
  // convert the form data to a JSON order object using the formDataToJSON function
  // populate the JSON order object with the order Date, orderTotal, tax, shipping, and list of items
  // call the checkout method in the ExternalServices module and send it the JSON order data.
        
}
}