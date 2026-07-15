import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
} from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");

  if (!productList) {
    return;
  }

  if (cartItems.length === 0) {
    productList.innerHTML = "<li>Your cart is empty.</li>";
    renderCartTotal(cartItems);
    return;
  }

  const htmlItems = cartItems.map(cartItemTemplate);
  productList.innerHTML = htmlItems.join("");

  renderCartTotal(cartItems);

  document.querySelectorAll(".remove-button").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.id;

      const updatedCartItems = cartItems.filter(
        (item) => String(item.Id) !== itemId,
      );

      setLocalStorage("so-cart", updatedCartItems);
      renderCartContents();
      updateCartCount();
    });
  });
}

function renderCartTotal(cartItems) {
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");

  if (!cartFooter || !cartTotal) {
    return;
  }

  if (cartItems.length > 0) {
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.FinalPrice),
      0,
    );

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartFooter.classList.remove("hide");
  } else {
    cartFooter.classList.add("hide");
  }
}

function cartItemTemplate(item) {
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

      <a href="../product_pages/?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${Number(item.FinalPrice).toFixed(2)}</p>

      <button
        class="remove-button"
        data-id="${item.Id}"
        type="button"
        aria-label="Remove ${item.Name} from cart"
      >
        ✕
      </button>
    </li>
  `;
}

updateCartCount();
renderCartContents();