<<<<<<< HEAD
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cartItems = getLocalStorage("so-cart");

    if (!cartItems) {
      cartItems = [];
    }

    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    const regularPrice = Number(this.product.SuggestedRetailPrice);
    const salePrice = Number(this.product.FinalPrice);

    const discountAmount = regularPrice - salePrice;
    const discountPercent = Math.round(
      (discountAmount / regularPrice) * 100
    );

    document.querySelector(".product-detail").innerHTML = `
      <h3>${this.product.Brand.Name}</h3>

      <h2 class="divider">${this.product.NameWithoutBrand}</h2>

      <img
        class="divider"
        src="${this.product.Image}"
        alt="${this.product.Name}"
      />

      <p class="product-card__price">
        $${salePrice.toFixed(2)}
      </p>

      ${
        discountAmount > 0
          ? `
            <p class="product-detail__original-price">
              Regular price: $${regularPrice.toFixed(2)}
            </p>

            <p class="product-detail__discount">
              Save $${discountAmount.toFixed(2)}
              (${discountPercent}% off)
            </p>
          `
          : ""
      }

      <p class="product__color">
        ${this.product.Colors[0].ColorName}
      </p>

      <p class="product__description">
        ${this.product.DescriptionHtmlSimple}
      </p>

      <div class="product-detail__add">
        <button id="addToCart">Add to Cart</button>
      </div>
    `;
  }
=======
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

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product);
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
    productImg.src = product.Image;
    productImg.alt = product.NameWithoutBrand;

    document.querySelector(".product-card__price").textContent = product.FinalPrice;
    document.querySelector(".product__color").textContent = product.Colors[0].ColorName;
    document.querySelector(".product__description").innerHTML = product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = product.Id;
>>>>>>> origin/main
}