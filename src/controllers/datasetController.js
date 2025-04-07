class DatasetController {
    constructor(datasetService) {
        this.datasetService = datasetService;
    }

    async getDatasets(req, res) {
        try {
            const datasets = await this.datasetService.fetchAllDatasets();
            // console.log(datasets)
            res.status(200).json(datasets);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching datasets', error });
        }
    }

    async getDatasetById(req, res) {
        const { id } = req.params;
        try {
            const dataset = await this.datasetService.fetchDatasetById(id);
            if (dataset) {
                res.status(200).json(dataset);
            } else {
                res.status(404).json({ message: 'Dataset not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching dataset', error });
        }
    }
}

module.exports = DatasetController;