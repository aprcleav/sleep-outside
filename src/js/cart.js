// Import the localStorage helpers, cart badge updater,
// and dynamic header/footer loader.
import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
  loadHeaderFooter,
} from "./utils.mjs";

// Load the shared header and footer.
loadHeaderFooter();

function renderCartContents() {
  // Get the current cart or use an empty array if no cart exists.
  const cartItems = getLocalStorage("so-cart") || [];

  // Create one HTML template for every item in the cart.
  const htmlItems = cartItems.map(cartItemTemplate);

  // Render all cart items on the page.
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Recalculate and display the complete cart total.
  renderCartTotal(cartItems);
}

function changeCartQuantity(itemId, change) {
  // Always read the latest cart data before changing a quantity.
  const cartItems = getLocalStorage("so-cart") || [];

  const updatedCartItems = cartItems
    .map((cartItem) => {
      // Return unrelated products without changing them.
      if (String(cartItem.Id) !== itemId) {
        return cartItem;
      }

      // Create an updated copy of the selected cart item.
      return {
        ...cartItem,
        quantity: (cartItem.quantity || 1) + change,
      };
    })
    // Remove an item when its quantity is decreased below one.
    .filter((cartItem) => cartItem.quantity > 0);

  // Save the new quantities in localStorage.
  setLocalStorage("so-cart", updatedCartItems);

  // Rerender the cart so the quantity and total change immediately.
  renderCartContents();

  // Update the number displayed on the cart icon.
  updateCartCount();
}

function removeCartItem(itemId) {
  // Read all items currently stored in the cart.
  const cartItems = getLocalStorage("so-cart") || [];

  // Keep every product except the one selected for removal.
  const updatedCartItems = cartItems.filter(
    (cartItem) => String(cartItem.Id) !== itemId,
  );

  // Save and render the updated cart.
  setLocalStorage("so-cart", updatedCartItems);
  renderCartContents();

  // Update the cart badge after removing the product.
  updateCartCount();
}

function renderCartTotal(cartItems) {
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");

  // Hide the total section when there are no products in the cart.
  if (cartItems.length === 0) {
    cartFooter.classList.add("hide");
    return;
  }

  // Multiply each product price by its quantity and add the results.
  const total = cartItems.reduce(
    (sum, cartItem) => sum + cartItem.FinalPrice * (cartItem.quantity || 1),
    0,
  );

  // Display the total with two decimal places.
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  cartFooter.classList.remove("hide");
}

function cartItemTemplate(item) {
  // Older saved items might not have a quantity, so use one by default.
  const quantity = item.quantity || 1;

  // Calculate the subtotal for this specific product.
  const itemTotal = item.FinalPrice * quantity;

  // Return the HTML for one cart item.
  return `<li class="cart-card divider">
    <!-- Link the cart image to the dynamic product details page -->
    <a
      href="../product_pages/?product=${item.Id}"
      class="cart-card__image"
    >
      <img
        src="${item.Images.PrimarySmall}"
        alt="${item.Name}"
      />
    </a>

    <!-- Link the product name to its details page -->
    <a href="../product_pages/?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>

    <!-- Display the selected product color -->
    <p class="cart-card__color">
      ${item.Colors[0].ColorName}
    </p>

    <!-- Controls for increasing or decreasing the cart quantity -->
    <div
      class="cart-card__quantity"
      aria-label="Quantity controls for ${item.Name}"
    >
      <span>Quantity:</span>

      <!-- Decrease the quantity by one -->
      <button
        type="button"
        class="quantity-button"
        data-id="${item.Id}"
        data-change="-1"
        aria-label="Decrease quantity"
      >
        -
      </button>

      <!-- Announce quantity changes to assistive technologies -->
      <span class="quantity-value" aria-live="polite">
        ${quantity}
      </span>

      <!-- Increase the quantity by one -->
      <button
        type="button"
        class="quantity-button"
        data-id="${item.Id}"
        data-change="1"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>

    <!-- Display the price multiplied by the selected quantity -->
    <p class="cart-card__price">
      $${itemTotal.toFixed(2)}
    </p>

    <!-- Remove every unit of this product from the cart -->
    <button
      type="button"
      class="remove-button"
      data-id="${item.Id}"
      aria-label="Remove ${item.Name} from cart"
    >
      Remove
    </button>
  </li>`;
}

// Use one listener on the product list.
// This listener continues working after the cart HTML is rerendered.
document.querySelector(".product-list").addEventListener("click", (event) => {
  // Check whether a quantity button was clicked.
  const quantityButton = event.target.closest(".quantity-button");

  if (quantityButton) {
    // Read the product ID and either -1 or +1 from the button.
    changeCartQuantity(
      quantityButton.dataset.id,
      Number(quantityButton.dataset.change),
    );

    return;
  }

  const removeButton = event.target.closest(".remove-button");

  if (removeButton) {
    removeCartItem(removeButton.dataset.id);
  }
});

renderCartContents();
