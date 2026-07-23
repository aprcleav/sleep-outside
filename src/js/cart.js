import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
  loadHeaderFooter,
} from "./utils.mjs";

loadHeaderFooter();

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a
        href="/product_pages/index.html?product=${item.Id}"
        class="cart-card__image"
      >
        <img
          src="${item.Images?.PrimarySmall || item.Images?.PrimaryMedium || item.Image || ""}"
          alt="${item.Name}"
        />
      </a>

      <a href="/product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__color">
        ${item.Colors?.[0]?.ColorName || ""}
      </p>

      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>

      <button class="remove-button" data-id="${item.Id}">
        Remove
      </button>
    </li>
  `;
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");

  if (cartItems.length === 0) {
    productList.innerHTML = "<li>Your cart is empty.</li>";
    renderCartTotal(cartItems);
    updateCartCount();
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
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

renderCartContents();
updateCartCount();