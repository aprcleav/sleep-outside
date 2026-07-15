import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
<<<<<<< HEAD

const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");

const listing = new ProductList(
    "tents",
    dataSource,
    element
);

listing.init();
=======
import { updateCartCount } from "./utils.mjs";

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("Tents", dataSource, element);

productList.init();
updateCartCount();
>>>>>>> origin/main
