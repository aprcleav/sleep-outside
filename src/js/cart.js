import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  renderCartTotal(cartItems);

  // add event listener to each remove from cart button
  document.querySelectorAll(".remove-button").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.id;
      // update cart items
      const updatedCartItems = cartItems.filter((item) => String(item.Id) !== itemId);
      setLocalStorage("so-cart", updatedCartItems);
      renderCartContents();
    })
  });


// add new function to render cart total if cartItems is not empty, otherwise hide the cart total
function renderCartTotal(cartItems) {
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");

  if (cartItems.length > 0) {
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    cartTotal.innerHTML = `Total: $${total.toFixed(2)}`;
    cartFooter.classList.remove("hide");
  } else {
    cartFooter.classList.add("hide");
  }
}

}
function cartItemTemplate(item) {
  // add remove from cart button
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="remove-button" data-id="${item.Id}">✕</button>
</li>`;

  return newItem;
}

renderCartContents();
