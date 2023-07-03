window.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('productsContainer');
    const paginationContainer = document.getElementById('pagination');
    const cartIcon = document.querySelector('.cart-icon');
    const cartItems = document.getElementById('cartItems');
    const btnCheckout = document.getElementById('btnCheckout');
    const productsPerPage = 10;
    let currentPage = 1;
    let totalProducts = 0;
    let totalPages = 0;
    let products = [];
    let cart = [];

    const loadProducts = () => {
        fetch('https://makeup-api.herokuapp.com/api/v1/products.json?brand=dior')
          .then(response => response.json())
          .then(data => {
            products = data;
            totalProducts = products.length;
            totalPages = Math.ceil(totalProducts / productsPerPage);
            showProducts(currentPage);
            showPagination();
          })
          .catch(error => {
            console.log('Ocorreu um erro:', error);
          });
      };

    const showProducts = page => {
        productsContainer.innerHTML = '';

        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = products.slice(startIndex, endIndex);

        productsToShow.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `<h3>${product.name}</h3>
                                <p>${product.brand}</p>
                                <img src="${product.image_link}" alt="${product.name}">
                                <button class="btnAddToCart" data-id="${product.id}">Adicionar ao Carrinho</button>`;
            productsContainer.appendChild(productDiv);
        });

        const btnAddToCart = document.getElementsByClassName('btnAddToCart');
        [...btnAddToCart].forEach(btn => btn.addEventListener('click', addToCart));
    };

    const addToCart = event => {
        const productId = event.target.getAttribute('data-id');
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push(product);
            updateCart();
        }
    };

    const updateCart = () => {
        cartItems.innerHTML = '';
        let itemCount = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.innerText = item.name;
            cartItems.appendChild(cartItem);
            itemCount++;
        });

        cartIcon.querySelector('.cart-item-count').innerText = itemCount > 0 ? itemCount : '';
        btnCheckout.disabled = itemCount === 0;
    };

    const showPagination = () => {
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.innerText = i;
            pageLink.className = i === currentPage ? 'active' : '';
            paginationContainer.appendChild(pageLink);
        }

        const pageLinks = document.getElementsByTagName('a');
        [...pageLinks].forEach(link => link.addEventListener('click', changePage));
    };

    const changePage = event => {
        event.preventDefault();
        currentPage = parseInt(event.target.innerText);
        showProducts(currentPage);
    };

    btnCheckout.addEventListener('click', () => {
        alert('Compra finalizada!');
        cart = [];
        updateCart();
    });

    loadProducts();
});
