// Import the localStorage helpers and the function that updates the cart badge.
import {
    getLocalStorage,
    setLocalStorage,
    updateCartCount,
    alertMessage,
    renderCategory
} from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        // Save the product ID obtained from the URL.
        this.productId = productId;

        // The complete product information will be stored here after loading it.
        this.product = {};

        // ProductData is responsible for obtaining product information from the API.
        this.dataSource = dataSource;
    }

    async init() {
        // Use the data source to get the details for the current product.
        // findProductById returns a promise, so await is required.
        this.product = await this.dataSource.findProductById(this.productId);

        // The product information must be loaded before rendering the page.
        this.renderProductDetails();

        // Display category for breadcrumbs
        renderCategory(this.product);

        // Decrease the selected quantity when the minus button is clicked.
        document
            .getElementById("decreaseQuantity")
            .addEventListener("click", () => this.changeSelectedQuantity(-1));

        // Increase the selected quantity when the plus button is clicked.
        document
            .getElementById("increaseQuantity")
            .addEventListener("click", () => this.changeSelectedQuantity(1));

        // Validate quantities entered manually by the user.
        document
            .getElementById("productQuantity")
            .addEventListener("change", () => this.normalizeSelectedQuantity());

        // Once the HTML is rendered, add a listener to the Add to Cart button.
        // bind(this) ensures the method can access this.product.
        document
            .getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));
    }

    getSelectedQuantity() {
        // Read the current value from the quantity input.
        const quantityInput = document.getElementById("productQuantity");
        const quantity = Number.parseInt(quantityInput.value, 10);

        // Return one if the entered value is missing, invalid, zero, or negative.
        return Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
    }

    normalizeSelectedQuantity() {
        // Replace an invalid manually entered value with a valid quantity.
        document.getElementById("productQuantity").value =
            this.getSelectedQuantity();
    }

    changeSelectedQuantity(change) {
        // Get the current valid quantity before applying the requested change.
        const quantityInput = document.getElementById("productQuantity");
        const currentQuantity = this.getSelectedQuantity();

        // Quantity cannot be lower than one on the product details page.
        quantityInput.value = Math.max(1, currentQuantity + change);
    }

    // Add the selected quantity to localStorage.
    // If the item already exists, add the selected quantity to its current quantity.
    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        const selectedQuantity = this.getSelectedQuantity();

        // Check whether this product already exists in the cart.
        const existingItem = cartItems.find(
            (cartItem) => cartItem.Id === this.product.Id,
        );

        if (existingItem) {
            // Add the selected amount to the quantity already in the cart.
            existingItem.quantity =
                (existingItem.quantity || 1) + selectedQuantity;
        } else {
            // Add a new product and store its selected quantity.
            cartItems.push({
                ...this.product,
                quantity: selectedQuantity,
            });
        }

        // Save the updated cart and immediately refresh the cart badge.
        setLocalStorage("so-cart", cartItems);

        // Alerts user that their item was added to the cart
        alertMessage(`${this.product.NameWithoutBrand} added to cart!`, false);
        updateCartCount();
        this.animateProductToCart();

        // Reset the selector to one after adding the product.
        document.getElementById("productQuantity").value = 1;
    }

    animateProductToCart() {
        const addButton = document.getElementById("addToCart");
        const cart = document.querySelector(".cart");
        const cartTarget = document.querySelector(".cart svg") || cart;

        // Stop if one of the required elements is not available.
        if (!addButton || !cart || !cartTarget) {
            return;
        }

        const bumpCart = () => {
            // Remove and re-add the class so repeated clicks restart the animation.
            cart.classList.remove("cart-bump");
            void cart.offsetWidth;
            cart.classList.add("cart-bump");

            cart.addEventListener(
                "animationend",
                () => cart.classList.remove("cart-bump"),
                { once: true },
            );
        };

        // Respect the user's reduced-motion accessibility preference.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const buttonPosition = addButton.getBoundingClientRect();
        const cartPosition = cartTarget.getBoundingClientRect();

        const startX = buttonPosition.left + buttonPosition.width / 2;
        const startY = buttonPosition.top + buttonPosition.height / 2;
        const endX = cartPosition.left + cartPosition.width / 2;
        const endY = cartPosition.top + cartPosition.height / 2;

        // Create the temporary orange item that travels to the backpack.
        const flyingItem = document.createElement("span");
        flyingItem.classList.add("cart-fly-item");
        flyingItem.setAttribute("aria-hidden", "true");
        flyingItem.style.left = `${startX - 9}px`;
        flyingItem.style.top = `${startY - 9}px`;
        document.body.appendChild(flyingItem);

        const distanceX = endX - startX;
        const distanceY = endY - startY;

        const animation = flyingItem.animate(
            [
                {
                    transform: "translate(0, 0) scale(1)",
                    opacity: 1,
                },
                {
                    transform: `translate(${distanceX * 0.5}px, ${distanceY * 0.5 - 60
                        }px) scale(0.8)`,
                    opacity: 1,
                    offset: 0.55,
                },
                {
                    transform: `translate(${distanceX}px, ${distanceY}px) scale(0.25)`,
                    opacity: 0.2,
                },
            ],
            {
                duration: 650,
                easing: "cubic-bezier(0.45, 0, 0.2, 1)",
            },
        );

        animation.finished
            .then(() => {
                flyingItem.remove();
                bumpCart();
            })
            .catch(() => flyingItem.remove());
    }

    renderProductDetails() {
        // Send the loaded product to the template function.
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    // Add the product brand and name to the detail page.
    document.querySelector("h2").textContent = product.Brand.Name;
    document.querySelector("h3").textContent = product.NameWithoutBrand;

    // Use the large API image for the product details page.
    const productImg = document.getElementById("productImage");
    productImg.src = product.Images.PrimaryLarge;
    productImg.alt = product.NameWithoutBrand;

    // Display the product price, color, and description.
    document.querySelector(".product-card__price").textContent =
        `$${product.FinalPrice}`;

    document.querySelector(".product__color").textContent =
        product.Colors[0].ColorName;

    document.querySelector(".product__description").innerHTML =
        product.DescriptionHtmlSimple;

    // Store the product ID on the Add to Cart button.
    document.getElementById("addToCart").dataset.id = product.Id;
}