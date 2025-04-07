const CSVParser = require('./csvParser');
const path = require('path');

class DataService {
    constructor() {
        this.productsData = null;
        this.ratingsData = null;
        this.isDataLoaded = false;
    }

    async loadData() {
        try {
            this.productsData = await CSVParser.parseCSV(path.join(__dirname, '../../data/products_df.csv'));
            this.ratingsData = await CSVParser.parseCSV(path.join(__dirname, '../../data/ratings_df.csv'));
            this.isDataLoaded = true;
            return { success: true };
        } catch (error) {
            console.error('Error loading data:', error);
            return { success: false, error };
        }
    }

    getProducts(page = 1, limit = 10, search = '') {
        if (!this.isDataLoaded || !this.productsData) {
            throw new Error('Data not loaded');
        }

        let filteredProducts = this.productsData;
        
        if (search) {
            filteredProducts = this.productsData.filter(product => 
                product.product_name?.toLowerCase().includes(search.toLowerCase()) ||
                product.category?.toLowerCase().includes(search.toLowerCase())
            );
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        return {
            products: filteredProducts.slice(startIndex, endIndex),
            total: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / limit)
        };
    }

    getProductById(productId) {
        if (!this.isDataLoaded || !this.productsData) {
            throw new Error('Data not loaded');
        }

        const product = this.productsData.find(p => p.product_id === productId);
        if (product) {
            const recommendations = this.getRecommendations(productId);
            return { ...product, recommendations };
        }
        return null;
    }

    getRatingsData() {
        if (!this.isDataLoaded || !this.ratingsData) {
            throw new Error('Data not loaded');
        }
        return this.ratingsData;
    }

    getDatasetOverview() {
        if (!this.isDataLoaded) {
            throw new Error('Data not loaded');
        }
        return {
            productsCount: this.productsData?.length || 0,
            ratingsCount: this.ratingsData?.length || 0,
            averageRating: this.calculateAverageRating(),
            categoriesCount: new Set(this.productsData?.map(p => p.category)).size
        };
    }

    calculateAverageRating() {
        if (!this.ratingsData) return 0;
        const ratings = this.ratingsData.map(r => parseFloat(r.rating));
        return ratings.reduce((a, b) => a + b, 0) / ratings.length;
    }
}

module.exports = DataService;