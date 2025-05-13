document.getElementById('produkForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const nama = document.getElementById('nama').value.trim();
  const harga = document.getElementById('harga').value.trim();
  const keterangan = document.getElementById('keterangan').value.trim();
  const fotoDisplayFile = document.getElementById('fotoDisplay').files[0];
  const fotoVideoFile = document.getElementById('fotoVideo').files[0];

  const user = JSON.parse(localStorage.getItem("user"));
  const idToko = user ? user.id : null;

  if (!idToko) {
    alert("User belum login. ID toko tidak ditemukan di localStorage.");
    return;
  }

  let fotoDisplayUrl = '';
  if (fotoDisplayFile) {
    const formData = new FormData();
    formData.append("file", fotoDisplayFile);
    formData.append("upload_preset", "unsigned_preset"); // GANTI dengan preset Cloudinary kamu

    const response = await fetch('https://api.cloudinary.com/v1_1/dlsdpgqda/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.secure_url) {
      console.error("Gagal upload Foto Display:", data);
      alert("Gagal mengupload Foto Display.");
      return;
    }

    fotoDisplayUrl = data.secure_url;
  }

  let fotoVideoUrl = '';
  if (fotoVideoFile) {
    const formData = new FormData();
    formData.append("file", fotoVideoFile);
    formData.append("upload_preset", "unsigned_preset"); // GANTI dengan preset Cloudinary kamu


    const response = await fetch('https://api.cloudinary.com/v1_1/dlsdpgqda/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.secure_url) {
      console.error("Gagal upload Foto/Video:", data);
      alert("Gagal mengupload Foto atau Video.");
      return;
    }

    fotoVideoUrl = data.secure_url;
  }

  const produkId = Date.now();
  const produkRef = firebase.database().ref('produk/' + produkId);

  const data = {
    id: produkId,
    No: "",
    NamaProduk: nama,
    Harga: harga,
    idToko: idToko,
    Keterangan: keterangan,
    FotoDisplay: fotoDisplayUrl || "",
    FotoVideo: fotoVideoUrl || ""
  };

  produkRef.set(data)
    .then(() => {
      alert('Produk berhasil disimpan!');
      document.getElementById('produkForm').reset();
    })
    .catch(error => {
      console.error('Gagal menyimpan produk:', error);
      alert('Terjadi kesalahan saat menyimpan produk.');
    });
});
