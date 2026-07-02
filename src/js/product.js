import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // create new cart array and set it to whatever is currently in local storage or an empty array
  const cartArray = getLocalStorage("so-cart") || [];
  // add product to array
  cartArray.push(product);
  // set local storage to cart array
  setLocalStorage("so-cart", cartArray);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
