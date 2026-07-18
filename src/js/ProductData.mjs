const baseURL = import.meta.env.VITE_SERVER_URL || "";

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }

  throw new Error("Bad Response");
}

export default class ProductData {
  constructor(category = "tents") {
    this.category = category;
  }

  async getData(category = this.category) {
    if (baseURL) {
      const response = await fetch(`${baseURL}products/search/${category}`);
      const data = await convertToJson(response);
      return data.Result;
    }

    const response = await fetch(`/json/${category}.json`);
    return await convertToJson(response);
  }

  async findProductById(id, category = this.category) {
    if (baseURL) {
      const response = await fetch(`${baseURL}product/${id}`);
      const data = await convertToJson(response);
      return data.Result;
    }

    const products = await this.getData(category);
    return products.find((item) => String(item.Id) === String(id));
  }
}
