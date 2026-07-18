// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false)
{
  const htmlStrings = list.map(templateFn);
  
  if (clear) {
    parentElement.innerHTML = "";
  }

  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  // Updated count to work with cart quantity feature. Loops the array and adds each item's quantity to the running total.
  const count = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const cart = qs(".cart");

  let badge = cart.querySelector(".cart-count");

  if (!badge) {
    badge = document.createElement("span");
    badge.classList.add("cart-count");
    cart.appendChild(badge);
  }

  badge.textContent = count;

  if (count === 0) {
    badge.style.display = "none";
  } else {
    badge.style.display = "flex";
  }

  console.log(`Cart contains ${count} item(s).`);
}

export function renderWithTemplate(template, parentElement, callback) {
  // removed the data parameter because we didn't need it for our callback function

  parentElement.innerHTML = template;
  if (callback) {
    return callback();
  }
}

async function loadTemplate(path) {
  
  const response = await fetch(path);
  const template = await response.text();
  return template;

}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html")

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement, updateCartCount);
  renderWithTemplate(footerTemplate, footerElement, updateCartCount);
}