

productId = null;
const getAllProducts = () => {
    return fetch('/get-all-products', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'})
        
    })
    .then(res => res.json())
    .then(data => {
        return data
    })
}
const createAllProductCards = (data, title, ele) => {
    if(data.length){
        let container = document.querySelector(ele);
        container.innerHTML += `
            <h1 class="section-title">${title}</h1>
            <div class="product-container">
                ${createAllCards(data)}
            </div>
        `;
    }
}

const createAllCards = data => {
    let cards = '';

    data.forEach(item => {
        if(item.id != productId){
            cards += `
            <div class="product-card">
                <img src="${item.image}" onclick="location.href = '/products/${item.id}'" class="product-img" alt="">
                <p class="product-name">${item.name} →</p>
            </div>
        `
        }
        
    })

    return cards;
}

getAllProducts().then(data => createProductCards(data, 'All-Products', '.search-listing'))