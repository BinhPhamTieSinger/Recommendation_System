class VisualizationController {
    constructor(datasetService) {
        this.datasetService = datasetService;
    }

    async getCharts(req, res) {
        try {
            const chartsData = await this.datasetService.getChartsData();
            res.json(chartsData);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching charts data', error });
        }
    }

    async getTables(req, res) {
        try {
            const tablesData = await this.datasetService.getTablesData();
            res.json(tablesData);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching tables data', error });
        }
    }
}

module.exports = VisualizationController;