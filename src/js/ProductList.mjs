import { renderListWithTemplate } from "./utils.mjs";

function productCartTemplate(product) {
    return `<li class="product-card">
        <a href="../product_pages/?product=${product.Id}">
            <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}">
            <h2 class="card__brand">${product.Brand.Name}</h2>
            <h3 class="card__name">${product.NameWithoutBrand}</h3>
            <p class="product-card__price">$${product.FinalPrice}</p>
        </a>
    </li>`
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.products = [];
    }

    async init() {
       this.products = await this.dataSource.getData(this.category);
        this.renderList(this.products); 
        document.querySelector(".title").textContent = this.category;
    }
    
    // call template function once for each product in the list, and insert it to the DOM
    renderList(list) {
        renderListWithTemplate(productCartTemplate, this.listElement, list, "afterbegin", true);
    }
    // sort the list of products based on the selected option, and then render the list
     sortList(sortType) {
        if (sortType === "price") {
            this.products.sort((a, b) => a.FinalPrice - b.FinalPrice);
        } else if (sortType === "name") {
            this.products.sort((a, b) => a.Name.localeCompare(b.Name));
        }
        this.renderList(this.products);
    }
}