let currentPage = 1;
const itemsPerPage = 9;
let productsData = [];
let ratingsData = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    setupEventListeners();
    displayOverview();
    createCharts();
    loadProducts(1);
});

async function loadData() {
    try {
        const [productsResponse, ratingsResponse] = await Promise.all([
            fetch('/data/products_df.csv').then(response => response.text()),
            fetch('/data/ratings_df.csv').then(response => response.text())
        ]);

        productsData = parseCSV(productsResponse);
        ratingsData = parseCSV(ratingsResponse);
        // console.log(productsData);
        // console.log(ratingsData);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function parseCSV(csvText) {
    // Use PapaParse to parse the CSV text
    return Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        quoteChar: '"',
        newline: '', 
    }).data;
}


function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });
}

function displayOverview() {
    document.getElementById('total-products').textContent = productsData.length;
    document.getElementById('total-users').textContent = new Set(ratingsData.map(r => r.user_id)).size;
    document.getElementById('total-ratings').textContent = ratingsData.length;
    document.getElementById('avg-rating').textContent = 
        (ratingsData.reduce((sum, r) => sum + parseFloat(r.rating), 0) / ratingsData.length).toFixed(1);
}

function createCharts() {
    createPriceDistribution();
    createRatingDistribution();
    createCategoryBreakdown();
    createRatingDistributionPie();
    // createCategoryCountplot();
    // createCategoryDistribution();
}

function createPriceDistribution() {
    const prices = productsData.map(p => parseFloat(p.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const ctx = document.getElementById('priceDistribution').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: 30 }, (_, i) => 
                Math.round(minPrice + (i * (maxPrice - minPrice) / 30))),
            datasets: [{
                label: 'Price Distribution',
                data: generateHistogramData(prices, 30),
                backgroundColor: 'rgba(75, 192, 192, 0.5)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Price Distribution'
                }
            }
        }
    });
}

function createRatingDistribution() {
    const ctx = document.getElementById('ratingDistribution').getContext('2d');
    const ratings = ratingsData.map(r => r.rating);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [1, 2, 3, 4, 5],
            datasets: [{
                label: 'Rating Distribution',
                data: ratings.reduce((acc, r) => {
                    acc[Math.floor(r)-1]++;
                    return acc;
                }, [0,0,0,0,0]),
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Rating Distribution'
                }
            }
        }
    });
}

// function createCategoryCountplot() {
//     const ctx = document.getElementById('categoryCountplot').getContext('2d');
//     const categories = [...new Set(productsData.map(p => p.sub_category))];
//     const categoryCounts = categories.map(cat =>
//         productsData.filter(p => p.sub_category === cat).length
//     );
//     const sortedCategories = categories.map((cat, index) => ({ cat, count: categoryCounts[index] }))
//         .sort((a, b) => a.cat.localeCompare(b.cat));
//     const sortedCategoryNames = sortedCategories.map(item => item.cat);
//     const sortedCategoryCounts = sortedCategories.map(item => item.count);
//     // 1 color + horizontal bar
//     const colors = sortedCategoryCounts.map(() => 'rgba(75, 192, 192, 0.5)');

//     new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: sortedCategoryNames,
//             datasets: [{
//                 label: 'Category Count',
//                 data: sortedCategoryCounts,
//                 backgroundColor: colors
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 title: {
//                     display: true,
//                     text: 'Category Count'
//                 }
//             },
//             indexAxis: 'y'
//         }
//     });
// }

function createCategoryBreakdown() {
    const ctx = document.getElementById('categoryBreakdown').getContext('2d');
    const categories = [...new Set(productsData.map(p => p.sub_category))];
    const categoryCounts = categories.map(cat =>
        productsData.filter(p => p.sub_category === cat).length
    );
    const sortedCategories = categories.map((cat, index) => ({ cat, count: categoryCounts[index] }))
        .sort((a, b) => b.count - a.count);
    const sortedCategoryNames = sortedCategories.map(item => item.cat);
    const sortedCategoryCounts = sortedCategories.map(item => item.count);
    const total = sortedCategoryCounts.reduce((a, b) => a + b, 0);
    const percentages = sortedCategoryCounts.map(count => ((count / total) * 100).toFixed(2));

    // Different colors for all the sub_cateogries + blur the color
    const colors = sortedCategoryCounts.map((_, index) => {
        const hue = (index * 360 / sortedCategoryCounts.length) % 360;
        return `hsla(${hue}, 70%, 50%, 0.5)`;
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: sortedCategoryNames,
            datasets: [{
                label: 'Category Breakdown',
                data: sortedCategoryCounts,
                backgroundColor: colors,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Category Breakdown'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const label = tooltipItem.label || '';
                            const percentage = percentages[tooltipItem.dataIndex];
                            return `${label}: ${percentage}%`;
                        }
                    }
                }
            }
        }
    });
}

// function createCategoryDistribution() {
//     const ctx = document.getElementById('categoryDistribution').getContext('2d');
//     const categories = [...new Set(productsData.map(p => p.sub_category))];

//     const categoryCounts = categories.map(cat =>
//         productsData.filter(p => p.sub_category === cat).length
//     );
//     const sortedCategories = categories.map((cat, index) => ({ cat, count: categoryCounts[index] }))
//         .sort((a, b) => b.count - a.count);
//     const sortedCategoryNames = sortedCategories.map(item => item.cat);
//     const sortedCategoryCounts = sortedCategories.map(item => item.count);

//     // 90 degrees x-axis
//     new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: sortedCategoryNames,
//             datasets: [{
//                 label: 'Category Distribution',
//                 data: sortedCategoryCounts,
//                 backgroundColor: 'rgba(255, 206, 86, 0.5)'
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 title: {
//                     display: true,
//                     text: 'Category Distribution'
//                 }
//             },
//             indexAxis: 'y'
//         }
//     });
// }

function createRatingDistributionPie() {
    const ctx = document.getElementById('ratingDistributionPie').getContext('2d');
    const ratings = ratingsData.map(r => r.rating);
    
    const ratingCounts = [1, 2, 3, 4, 5].map(rating =>
        ratings.filter(r => parseFloat(r) === rating).length
    );

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['1★', '2★', '3★', '4★', '5★'],
            datasets: [{
                label: 'Rating Distribution',
                data: ratingCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Rating Distribution'
                }
            }
        }
    });
}

function generateHistogramData(data, bins) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;
    const histogram = new Array(bins).fill(0);
    
    data.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        histogram[binIndex]++;
    });
    
    return histogram;
}

function loadProducts(page, searchTerm = '') {
    const filteredProducts = searchTerm 
        ? productsData.filter(p => 
            p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sub_category.toLowerCase().includes(searchTerm.toLowerCase()))
        : productsData;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    displayProducts(paginatedProducts);
    setupPagination(filteredProducts.length, page);
    currentPage = page;
}

function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = products.map(product => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.product_name}</h5>
                    <p class="card-text">
                        <strong>Price:</strong> ${product.price}<br>
                        <strong>Rating:</strong> ${product.rating}<br>
                        <strong>Category:</strong> ${product.sub_category}
                    </p>
                    <div class="mt-auto">
                        <!-- Button stays at the bottom left of the card -->
                        <button onclick="showProductDetails('${product.product_id}')" class="btn btn-primary w-100">View Details</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}


async function showProductDetails(productId) {
    // Reset the modal's backdrop to ensure it doesn't stack
    const existingModal = document.getElementById('productModal');
    if (existingModal.classList.contains('show')) {
        // Close the modal first if it's already open
        const modalInstance = bootstrap.Modal.getInstance(existingModal);
        modalInstance.hide();
    }

    // Wait for the modal to fully close before reopening it
    const product = productsData.find(p => String(p.product_id) === String(productId));
    const productRatings = ratingsData.filter(r => String(r.product_id) === String(productId));

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    
    // If the product has an image and the image is not "No image", show the image. Otherwise, skip displaying it.
    let productImage = '';
    if (product.image && product.image.toLowerCase() !== "no image") {
        productImage = `<img src="${product.image}" class="img-fluid mb-3" alt="${product.product_name}">`;
    }

    document.getElementById('productDetails').innerHTML = `
        <h4>${product.product_name}</h4>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Rating:</strong> ${product.rating}</p>
        <p><strong>Category:</strong> ${product.sub_category}</p>
        <p><strong>Description:</strong> ${product.description}</p>
        ${productImage}  <!-- Only include the image if it's valid -->
    `;

    // Generate and display the product's rating chart
    createProductRatingChart(productRatings);
    showRecommendations(product);

    modal.show(); // Open the modal
}





function createProductRatingChart(ratings) {
    const ratingCounts = [1, 2, 3, 4, 5].map(rating =>
        ratings.filter(r => parseFloat(r.rating) === rating).length
    );

    const ctx = document.getElementById('productRatingChart').getContext('2d');
    // Destroy any existing chart before creating a new one
    if (window.productRatingChart instanceof Chart) {
        window.productRatingChart.destroy();
    }

    // Create the new chart and store the instance in window.productRatingChart
    window.productRatingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1★', '2★', '3★', '4★', '5★'],
            datasets: [{
                label: 'Number of Ratings',
                data: ratingCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.5)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}


function setupPagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    let paginationHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadProducts(${currentPage - 1})">Previous</a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <li class="page-item ${currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="loadProducts(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<li class="page-item disabled"><a class="page-link">...</a></li>';
        }
    }

    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadProducts(${currentPage + 1})">Next</a>
        </li>
    `;

    pagination.innerHTML = paginationHTML;
}

function searchProducts(term) {
    loadProducts(1, term);
}

function showRecommendations(product) {
    // Simple recommendation based on the same category
    const recommendations = productsData
        .filter(p => p.sub_category === product.sub_category && p.product_id !== product.product_id)
        .slice(0, 3);

    document.getElementById('recommendationsContainer').innerHTML = recommendations.map(rec => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-body d-flex flex-column">
                    <h6>${rec.product_name}</h6>
                    <p>
                        Price: ${rec.price}<br>
                        Rating: ${rec.rating}
                    </p>
                    <div class="mt-auto">
                        <button onclick="showProductDetails('${rec.product_id}')" 
                                class="btn btn-sm btn-primary">View</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}
