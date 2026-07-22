import ProductDetails from "./ProductDetails.mjs";
import ProductData from "./ProductData.mjs";
import { getParam } from "./utils.mjs";

const dataSource = new ProductData();
const productId = getParam("product");

const product = new ProductDetails(productId, dataSource);
product.init();
