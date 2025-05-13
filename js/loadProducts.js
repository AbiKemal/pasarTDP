document.addEventListener('DOMContentLoaded', function() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const productGrid = document.getElementById('product-grid');
  
  function formatPrice(price) {
    return 'Rp ' + parseInt(price).toLocaleString('id-ID');
  }

  function loadProducts() {
    productGrid.innerHTML = '<div class="loading">Memuat produk...</div>';
    
    const productsRef = firebase.database().ref('produk');
    productsRef.orderByChild('createdAt').once('value')
      .then((snapshot) => {
        const products = [];
        snapshot.forEach((childSnapshot) => {
          products.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });

        if (products.length === 0) {
          productGrid.innerHTML = '<div class="empty-message">Tidak ada produk yang tersedia</div>';
          return;
        }

        // Urutkan dari yang terbaru (createdAt terbesar)
        products.sort((a, b) => b.createdAt - a.createdAt);
        
        productGrid.innerHTML = '';
        
        // Tampilkan dalam urutan vertikal (1-2, 3-4, 5-6)
        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          if (product.FotoDisplay) {
            const productCard = document.createElement('a');
            productCard.href = `viewProduk.html?id=${product.id}`;
            productCard.className = 'product-card';
            productCard.innerHTML = `
              <div class="product-image-container">
                <img src="${product.FotoDisplay}" alt="${product.NamaProduk}" class="product-image">
              </div>
              <div class="product-info">
                <div class="product-price">${formatPrice(product.Harga)}</div>
              </div>
            `;
            productGrid.appendChild(productCard);
          }
        }
      })
      .catch((error) => {
        console.error('Error loading products:', error);
        productGrid.innerHTML = '<div class="empty-message">Gagal memuat produk</div>';
      });
  }

  loadProducts();
});