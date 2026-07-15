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
    this.product = await this.dataSource.findProductById(this.productId);

    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
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
  const regularPrice = Number(product.SuggestedRetailPrice);
  const salePrice = Number(product.FinalPrice);

  const discountAmount = regularPrice - salePrice;
  const discountPercent =
    regularPrice > 0
      ? Math.round((discountAmount / regularPrice) * 100)
      : 0;

  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImg = document.getElementById("productImage");
  productImg.src = product.Image;
  productImg.alt = product.NameWithoutBrand;

  document.querySelector(".product-card__price").textContent =
    `$${salePrice.toFixed(2)}`;

  document.querySelector(".product__color").textContent =
    product.Colors[0].ColorName;

  document.querySelector(".product__description").innerHTML =
    product.DescriptionHtmlSimple;

  const priceElement = document.querySelector(".product-card__price");

  document
    .querySelector(".product-detail__original-price")
    ?.remove();

  document
    .querySelector(".product-detail__discount")
    ?.remove();

  if (discountAmount > 0) {
    priceElement.insertAdjacentHTML(
      "afterend",
      `
        <p class="product-detail__original-price">
          Regular price: $${regularPrice.toFixed(2)}
        </p>

        <p class="product-detail__discount">
          Save $${discountAmount.toFixed(2)}
          (${discountPercent}% off)
        </p>
      `
    );
  }

  document.getElementById("addToCart").dataset.id = product.Id;
}


