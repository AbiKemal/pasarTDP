document.addEventListener('DOMContentLoaded', function() {
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.database();
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const productTitle = document.getElementById('productTitle');
  const productDetails = document.getElementById('productDetails');

  if (productId) {
    const productRef = db.ref('produk/' + productId);
    const viewsRef = db.ref('produkViews/' + productId);

    // Debug: Log product ID
    console.log('Loading product ID:', productId);

    // Update view counter
    viewsRef.transaction((currentViews) => {
      return (currentViews || 0) + 1;
    }).then(() => {
      console.log('View counter updated');
    }).catch((error) => {
      console.error('View counter error:', error);
    });

    // Load product data and view count
    Promise.all([
      productRef.once('value'),
      viewsRef.once('value')
    ]).then(([productSnap, viewsSnap]) => {
      const product = productSnap.val();
      const views = viewsSnap.val() || 0;

      // Debug: Log loaded data
      console.log('Product data:', product);
      console.log('View count:', views);

      if (product) {
        displayProductDetails(product, views);
      } else {
        showError('Produk tidak ditemukan');
      }
    }).catch((error) => {
      console.error('Error loading:', error);
      showError('Gagal memuat data produk');
    });
  } else {
    showError('ID Produk tidak valid');
  }

  function formatPrice(price) {
    try {
      // Handle various price formats
      const num = typeof price === 'string' ? 
        parseInt(price.replace(/\D/g, '')) || 0 : 
        Number(price) || 0;
      return `Rp ${num.toLocaleString('id-ID')}`;
    } catch (e) {
      console.error('Price formatting error:', e);
      return 'Rp 0';
    }
  }

  function displayProductDetails(product, views) {
    // Set title
    productTitle.textContent = product.NamaProduk || 'Produk Tanpa Nama';
    document.title = (product.NamaProduk || 'Produk') + ' | TDP Marketplace';

    // Create HTML
    let html = `
      <div class="product-media">
    `;

    // Add main image
    if (product.FotoDisplay) {
      html += `
        <img src="${product.FotoDisplay}" alt="${product.NamaProduk}" class="product-image">
      `;
    }

    // Add video or additional image
    if (product.FotoVideo) {
      if (/\.(mp4|webm|ogg)$/i.test(product.FotoVideo)) {
        html += `
          <video controls class="product-video">
            <source src="${product.FotoVideo}" type="video/mp4">
            Browser tidak mendukung video.
          </video>
        `;
      } else {
        html += `
          <img src="${product.FotoVideo}" alt="${product.NamaProduk}" class="product-image">
        `;
      }
    }

    html += `
      </div>
      <div class="product-info">
        <div class="product-price">${formatPrice(product.Harga)}</div>
        <div class="product-meta">
          <span class="view-count">Dilihat: ${views} kali</span>
        </div>
        <div class="product-description">
          <h3>Deskripsi Produk</h3>
          <p>${product.Keterangan || 'Tidak ada deskripsi'}</p>
        </div>
      </div>
      <a href="index.html" class="back-button">Kembali ke Beranda</a>
    `;

    productDetails.innerHTML = html;

    // Debug: Verify elements exist
    setTimeout(() => {
      console.log('Price element:', document.querySelector('.product-price'));
      console.log('View element:', document.querySelector('.view-count'));
    }, 100);
  }

  function showError(message) {
    productTitle.textContent = 'Error';
    productDetails.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
        <a href="index.html" class="back-button">Kembali ke Beranda</a>
      </div>
    `;
  }
});