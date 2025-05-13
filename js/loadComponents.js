// Load Header
function loadHeader() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (!headerPlaceholder) return;
  
  headerPlaceholder.innerHTML = `
    <header>
      <h1>TDP Marketplace</h1>
    </header>
  `;
}

// Load Navbar
function loadNavbar() {
  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  if (!navbarPlaceholder) return;
  
  navbarPlaceholder.innerHTML = `
    <nav class="bottom-navbar">
      <a href="index.html" class="nav-item">
        <span>Beranda</span>
      </a>
      <a href="inputProduk.html" class="nav-item">
        <span>Tambah Produk</span>
      </a>
    </nav>
  `;
}

// Load all components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  loadHeader();
  loadNavbar();
});