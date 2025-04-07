const express = require('express');
const router = express.Router();
const DatasetController = require('../controllers/datasetController');
const RecommendationController = require('../controllers/recommendationController');
const VisualizationController = require('../controllers/visualizationController');

const datasetController = new DatasetController();
const recommendationController = new RecommendationController();
const visualizationController = new VisualizationController();

// API route for fetching datasets
router.get('/datasets', datasetController.getDatasets.bind(datasetController));

// API route for fetching recommendations
router.get('/recommendations', recommendationController.getRecommendations.bind(recommendationController));

// API route for generating visualizations
// router.get('/visualizations', visualizationController.getVisualizations.bind(visualizationController));

module.exports = router;