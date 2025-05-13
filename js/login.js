function login() {
  const telepon = document.getElementById("telepon").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!telepon || !password) {
    alert("Telepon dan password harus diisi.");
    return;
  }

  firebase.database().ref("user").once("value", (snapshot) => {
    let success = false;

    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();
      user.id = childSnapshot.key;

      if (user.telepon === telepon && user.password === password) {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "user.html";
        success = true;
      }
    });

    if (!success) {
      alert("Login gagal! Telepon atau password salah.");
    }
  });
}

// Tangani klik saat dokumen sudah siap
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnLogin");
  if (btn) {
    btn.addEventListener("click", login);
  }
});
