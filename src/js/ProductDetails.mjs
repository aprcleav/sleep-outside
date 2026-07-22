// import getlocalStorage from utils.mjs
import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
} from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);
        // the product details are needed before rendering the HTML
        this.renderProductDetails();
        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
        document.getElementById("addToCart").addEventListener("click", this.addProductToCart.bind(this));
    }

    // Added a check to see if an item already exists in the cart. If it does, it adds 1 to the quantity. It also adds the quantity to localStorage along with the other product data.
    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        const existingItem = cartItems.find((item) => item.Id === this.product.Id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cartItems.push({ ...this.product, quantity: 1 });
        }

        setLocalStorage("so-cart", cartItems);
        updateCartCount();
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {

    document.querySelector("h2").textContent = product.Brand.Name;
    document.querySelector("h3").textContent = product.NameWithoutBrand;

    const productImg = document.getElementById("productImage");
    productImg.src = product.Images.PrimaryLarge;
    productImg.alt = product.NameWithoutBrand;

    document.querySelector(".product-card__price").textContent = product.FinalPrice;
    document.querySelector(".product__color").textContent = product.Colors[0].ColorName;
    document.querySelector(".product__description").innerHTML = product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = product.Id;
}
