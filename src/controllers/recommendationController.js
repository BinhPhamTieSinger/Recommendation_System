class RecommendationController {
    constructor(recommendationService) {
        this.recommendationService = recommendationService;
    }

    async getRecommendations(req, res) {
        try {
            const userInput = req.query.input; // Assuming input comes from query parameters
            const recommendations = await this.recommendationService.fetchRecommendations(userInput);
            res.status(200).json(recommendations);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching recommendations', error });
        }
    }
}

module.exports = RecommendationController;