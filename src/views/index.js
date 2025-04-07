import express from 'express';
import path from 'path';

const router = express.Router();

// Render the homepage
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Link to charts and tables views
router.get('/charts', (req, res) => {
    res.sendFile(path.join(__dirname, 'charts/index.html'));
});

router.get('/tables', (req, res) => {
    res.sendFile(path.join(__dirname, 'tables/index.html'));
});

export default router;