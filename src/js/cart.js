import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
<<<<<<< HEAD

  const productList = document.querySelector(".product-list");

  if (cartItems.length === 0) {
    productList.innerHTML = "<li>Your cart is empty.</li>";
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");
}
=======
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  renderCartTotal(cartItems);
>>>>>>> origin/main

  // add event listener to each remove from cart button
  document.querySelectorAll(".remove-button").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.id;
      // update cart items
      const updatedCartItems = cartItems.filter(
        (item) => String(item.Id) !== itemId,
      );
      setLocalStorage("so-cart", updatedCartItems);
      renderCartContents();
      updateCartCount();
    });
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
<<<<<<< HEAD
  return `
    <li class="cart-card divider">
      <a
        href="../product_pages/?product=${item.Id}"
        class="cart-card__image"
      >
        <img
          src="${item.Image}"
          alt="${item.Name}"
        />
      </a>
=======
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
>>>>>>> origin/main

      <a href="../product_pages/?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;
}

updateCartCount();
renderCartContents();
