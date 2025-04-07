const express = require('express');
const bodyParser = require('body-parser');
const DataService = require('./services/dataService');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const dataService = new DataService();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/data', express.static('data'));

// Load data before starting server
async function startServer() {
    try {
        const result = await dataService.loadData();
        if (!result.success) {
            throw new Error('Failed to load data');
        }
        console.log('Data loaded successfully');

        // Routes
        app.get('/api/overview', async (req, res) => {
            try {
                const overview = dataService.getDatasetOverview();
                res.json(overview);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        app.get('/api/products', async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || '';
                
                const result = dataService.getProducts(page, limit, search);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        app.get('/api/products/:id', async (req, res) => {
            try {
                const product = dataService.getProductById(req.params.id);
                if (product) {
                    res.json(product);
                } else {
                    res.status(404).json({ error: 'Product not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Serve index.html
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();