const express = require('express');
const router = express.Router();

const DatasetController = require('../controllers/datasetController');
const RecommendationController = require('../controllers/recommendationController');
const VisualizationController = require('../controllers/visualizationController');

const datasetController = new DatasetController();
const recommendationController = new RecommendationController();
const visualizationController = new VisualizationController();

// Define routes for datasets
router.get('/datasets', datasetController.getAllDatasets.bind(datasetController));
router.get('/datasets/:id', datasetController.getDatasetById.bind(datasetController));

// Define routes for recommendations
router.get('/recommendations', recommendationController.getRecommendations.bind(recommendationController));

// Define routes for visualizations
router.get('/visualizations/charts', visualizationController.getCharts.bind(visualizationController));
router.get('/visualizations/tables', visualizationController.getTables.bind(visualizationController));

module.exports = router;