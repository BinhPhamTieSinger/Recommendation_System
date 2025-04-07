// src/models/product.js

class Product {
    constructor(id, name, description, price, category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }

    // Method to get product details
    getDetails() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            category: this.category
        };
    }

    // Method to update product information
    updateProductInfo(updatedInfo) {
        Object.assign(this, updatedInfo);
    }
}

module.exports = Product;