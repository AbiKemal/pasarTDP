// Ambil data user
const storedUser = localStorage.getItem("user");
if (!storedUser) {
  window.location.href = "login.html";
} else {
  const user = JSON.parse(storedUser);
  document.addEventListener("DOMContentLoaded", () => {
    const welcomeEl = document.getElementById("welcome");
    if (welcomeEl && user.nama) {
      welcomeEl.textContent = `Selamat datang, ${user.nama}!`;
    }

    // Pasang event listener untuk logout
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
      logoutLink.addEventListener("click", () => {
        const konfirmasi = confirm("Yakin ingin keluar?");
        if (konfirmasi) {
          localStorage.removeItem("user");
          sessionStorage.clear();
          window.location.href = "login.html";
        }
      });
    }
  });
}
