# Fashion Recommendation System

This project implements a full-stack recommendation system for fashion products that includes data visualization, product search, and personalized recommendations based on both content-based (LSA) and collaborative filtering (SVD) models. The application is built using Node.js, Express, and Chart.js and is configured to deploy on Netlify with serverless functions.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Data](#data)
- [License](#license)

## Features

- **Data Overview & Profiles**  
  See basic statistics over the products and ratings datasets.
  
- **Data Visualizations**  
  Interactive charts (price distribution, rating breakdown, category breakdown, etc.) powered by Chart.js.
  
- **Products Page**  
  Browse products with pagination and search functionality.
  
- **Product Details & Recommendations**  
  When viewing a product:
  
  - Get detailed product information.
  - See a rating distribution chart.
  - Receive baseline (category-based) recommendations.
  - Receive additional recommendations based on a content-based model (LSA) using cosine similarity.
  - Receive personalized recommendations for logged-in users based on SVD predictions.
- **User Authentication (Simple)**  
  Log in using a username and ID (validated against the ratings dataset) to view personalized recommendations.
  

## Project Structure

The project is organized as follows:

```
data-visualization-project
├── netlify
│   └── functions
│       └── api.js
├── src
│   ├── app.js
│   ├── controllers
│   │   ├── datasetController.js
│   │   ├── recommendationController.js
│   │   └── visualizationController.js
│   ├── models
│   │   ├── dataset.js
│   │   └── product.js
│   ├── routes
│   │   ├── api.js
│   │   └── index.js
│   ├── services
│   │   ├── csvParser.js
│   │   ├── dataService.js
│   │   └── recommendationService.js
│   └── views
│       ├── charts
│       ├── tables
│       └── index.js
├── data
│   ├── products_df.csv
│   └── ratings_df.csv 
├── public
│   ├── data
│   │   ├── products_df.csv
│   │   ├── ratings_df.csv
│   │   ├── products_df_checkpoint.csv
│   │   ├── colaborative_filterings_model_evaluation.csv
│   │   ├── colaborative_filterings_model_evaluation.png
│   │   ├── gensim_evaluation.csv
│   │   ├── gensim_evaluation.png
│   │   ├── LSA.json
│   │   ├── LSA.pkl
│   │   ├── products_df.csv
│   │   ├── ratings_df.csv
│   │   ├── Step_1.png
│   │   ├── Step_2.png
│   │   ├── Step_3.png
│   │   ├── Step_4.png
│   │   ├── Step_4.png
│   │   ├── SVD.json
│   │   ├── wordcloud_info.png
│   │   ├── workflow.png
│   │   └── vietnamese-stopwords.txt
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   ├── history.js
│   │   ├── index.js
│   │   ├── main.js
│   │   ├── products.js
│   │   └── systemworkflow.js
│   ├── history.html
│   ├── index.html
│   ├── products.html
│   └── systemworkflow.html
├── .gitignore
├── netlify.toml
├── package-lock.json
├── package.json
└── README.md
```

## Installation

1. **Clone the repository:**
  
  ```bash
  git clone https://github.com/yourusername/recommendation-system.git
  cd recommendation-system/data-visualization-project
  ```
  
2. **Install dependencies:**
  
  ```bash
  npm install
  ```
  
3. **Prepare Data:**
  
  Ensure your CSV files (`products_df.csv` and `ratings_df.csv`) along with any additional assets (e.g., images, LSA vectors JSON files, SVD predictions JSON files) are placed in the `data/` folder.
  

## Usage

### Running Locally

1. **Start the Express Server:**
  
  ```bash
  node src/app.js
  ```
  
2. **Access the application:**
  
  Open your browser and navigate to `http://localhost:3000`
  
3. **Testing Frontend Features:**
  
  - The **Home** page (`index.html`) displays documentation including an overview, visualizations, and a workflow diagram (located at `/data/workflow.png`).
  - The **Products** page (`products.html`) displays a product listing with search, pagination, detailed modal view (with rating charts and recommendation cards), and personalized recommendations.

### Files of Interest

- **Express App:** [src/app.js](src/app.js)
- **Data Service:** [src/services/dataService.js](src/services/dataService.js)
- **CSV Parser:** [src/services/csvParser.js](src/services/csvParser.js)
- **Frontend Scripts:** [public/js/main.js](public/js/main.js), [public/js/home.js](public/js/home.js)
- **Netlify Functions Configuration:** [netlify.toml](netlify.toml)

## Deployment

The project is configured for deployment on Netlify using serverless functions. The key configuration is in [netlify.toml](netlify.toml). To deploy:

1. **Install Netlify CLI:**
  
  ```bash
  npm install -g netlify-cli
  ```
  
2. **Login and initialize Netlify in your project:**
  
  ```bash
  netlify init
  ```
  
3. **Deploy the site:**
  
  ```bash
  netlify deploy --prod
  ```
  

Netlify will use the build command defined in your `netlify.toml` and serve the files from the `public/` folder along with serverless functions from `netlify/functions`.

## Data

The application relies on two main datasets:

- **Products Dataset:** `products_df.csv` – Contains product details including product name, price, rating, category, description, image URLs, etc.
- **Ratings Dataset:** `ratings_df.csv` – Contains user reviews and ratings for products.

Additional JSON files (e.g., for LSA vectors and SVD predictions) are also used for generating recommendations and should be placed in the `data/` folder.

## License

This project is licensed under the [MIT License](LICENSE).

---

For additional details, refer to the inline documentation in the source files and follow the instructions provided above.

Enjoy exploring the Fashion Recommendation System!
