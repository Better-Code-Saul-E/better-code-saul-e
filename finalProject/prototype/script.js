/*
https://dummyjson.com/products/category/womens-watches
https://dummyjson.com/products/category/mens-watches
https://dummyjson.com/products/category/tablets
https://dummyjson.com/products/category/laptops
https://dummyjson.com/products/category/smartphones


https://dummyjson.com/products/category/mobile-accessories 
*/

const categoryAPIs = [
    "https://dummyjson.com/products/category/womens-watches",
    "https://dummyjson.com/products/category/mens-watches",
    "https://dummyjson.com/products/category/tablets",
    "https://dummyjson.com/products/category/laptops",
    "https://dummyjson.com/products/category/smartphones",
    "https://dummyjson.com/products/category/mobile-accessories"
];

let allProducts = [];

async function fetchAndStoreProducts() {
    for (let api of categoryAPIs) {
        try {
            const response = await fetch(api);
            const data = await response.json();

            const cleanProducts = data.products.map(product => ({
                title: product.title,
                price: product.price,
                brand: product.brand,
                category: product.category,
                images: product.images,
                thumbnail: product.thumbnail,
                description: product.description,
                rating: product.rating
            }));

            allProducts = allProducts.concat(cleanProducts);
        } catch (error) {
            console.error(`Error fetching from ${api}:`, error);
        }
    }
}

async function loadRandomProducts() {
    const sliders = document.querySelectorAll('.product-slider');

    sliders.forEach(slider => {
        const selected = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 6);

        const anchors = slider.querySelectorAll('a:not(.slider-button)');
        anchors.forEach(a => a.remove());

        const nextButton = slider.querySelector('.next');

        selected.forEach(product => {
            const a = document.createElement('a');
            const img = document.createElement('img');
            img.src = product.thumbnail;
            img.alt = product.title;
            img.style.maxHeight = '150px';

            a.addEventListener('click', (e) => {
                e.preventDefault(); 
                localStorage.setItem('selectedProduct', JSON.stringify(product));
                window.location.href = 'productPage.html';
            });

            a.appendChild(img);
            slider.insertBefore(a, nextButton);
        });
    });
}
function populateCartRandomItems() {
    const cartProducts = document.querySelectorAll('#cart .cart-product');

    const selected = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, cartProducts.length);

    cartProducts.forEach((cartItem, i) => {
        const product = selected[i];
        if (!product) return;

        const img = cartItem.querySelector('img');
        img.src = product.thumbnail;
        img.alt = product.title;

        // Update title
        const title = cartItem.querySelector('.product-info h4');
        title.textContent = product.title;

        const ratingText = cartItem.querySelector('.ratings p');
        ratingText.textContent = `${product.rating.toFixed(1)} | ${Math.floor(Math.random() * 2000) + 1} ratings`;

        const priceEl = cartItem.querySelector('.product-info #price');
        priceEl.textContent = `$${product.price}`;
    });
}

function populateProductCards() {
    const cards = document.querySelectorAll('.product-card');

    const cardCategoryMap = [
        { title: 'mobile-accessories', categories: ['mobile-accessories'] },
        { title: 'Smartphones', categories: ['smartphones'] },
        { title: 'Watches', categories: ['mens-watches', 'womens-watches'] },
        { title: 'Laptops', categories: ['laptops'] },
    ];

    cards.forEach((card, index) => {
        const { title, categories } = cardCategoryMap[index];

        card.querySelector('.product-card-title h2').textContent = title;

        const filtered = allProducts.filter(product =>
            categories.includes(product.category)
        );

        const selected = filtered.sort(() => 0.5 - Math.random()).slice(0, 4);

        const productLinks = card.querySelectorAll('.product-category');

        selected.forEach((product, i) => {
            const link = productLinks[i];
            const img = link.querySelector('img');
            const label = link.querySelector('p');

            img.src = product.thumbnail;
            img.alt = product.title;
            label.textContent = product.title;

            link.addEventListener('click', (e) => {
                e.preventDefault(); 
                localStorage.setItem('selectedProduct', JSON.stringify(product));
                window.location.href = 'productPage.html';
            });
        });
    });
}
async function init() {
    await fetchAndStoreProducts();
    await loadRandomProducts();
    populateProductCards();
    if (window.location.pathname.includes("cart.html")) {
        populateCartRandomItems();
    }
}

init();


const savedProductJSON = localStorage.getItem('selectedProduct');
const product = savedProductJSON ? JSON.parse(savedProductJSON) : null;

if (product) {
    document.querySelector('h6').textContent = `Directory > ${product.title}`;

    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.thumbnail;
    mainImage.alt = product.title;

    const additionalImages = document.getElementById('additional-images');
    additionalImages.innerHTML = ''; 

    product.images.forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = product.title;
        additionalImages.appendChild(img);
    });


    const productInfo = document.getElementById('product-configuraion'); 
    productInfo.querySelector('a').textContent = `Shop ${product.brand}`;
    productInfo.querySelector('h1').textContent = product.title;

    const ratingsText = productInfo.querySelector('.ratings p');
    ratingsText.textContent = `${product.rating.toFixed(1)} | ${Math.floor(Math.random() * 2000) + 1} ratings`;

    const descriptionEl = document.getElementById('description');
    descriptionEl.textContent = product.description || "No description available.";

    productInfo.querySelector('#price').textContent = `$${product.price}`;


    const configContainer = document.getElementById('configuraion-container');
    configContainer.innerHTML = ''; 

    product.images.slice(0, 3).forEach((imgUrl, i) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'configuraion-option';

        const p = document.createElement('p');
        p.textContent = `Option ${i + 1}`;

        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = `${product.title} option ${i + 1}`;

        optionDiv.appendChild(p);
        optionDiv.appendChild(img);

        configContainer.appendChild(optionDiv);
    });

    const checkoutPrices = document.querySelectorAll('#checkout #price');
    checkoutPrices.forEach(priceEl => {
        priceEl.textContent = `$${product.price}`;
    });
} else {
    console.log('No saved product found');
}