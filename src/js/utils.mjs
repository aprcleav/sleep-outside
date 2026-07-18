// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  const element = qs(selector);

  if (!element) {
    return;
  }

  element.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });

  element.addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get("product");
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
  const count = cartItems.length;
  const cart = qs(".cart");

  if (!cart) {
    return;
  }

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

export function renderWithTemplate(template, parentElement, data, callback) {

  parentElement.innerHTML = template;
  if (callback) {
    return callback(data);
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

  // const cartItems = getLocalStorage("so-cart") || [];

  // ToDO: figure out data and callback
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}