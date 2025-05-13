// Preview images before upload
document.getElementById('fotoDisplay').addEventListener('change', function(e) {
  const previewContainer = document.getElementById('displayPreview');
  previewContainer.innerHTML = '';
  
  if (this.files && this.files[0]) {
    const file = this.files[0];
    
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.classList.add('preview-image');
      previewContainer.appendChild(img);
    }
  }
});

document.getElementById('fotoVideo').addEventListener('change', function(e) {
  const previewContainer = document.getElementById('videoPreview');
  previewContainer.innerHTML = '';
  
  if (this.files && this.files[0]) {
    const file = this.files[0];
    
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.classList.add('preview-image');
      previewContainer.appendChild(img);
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.controls = true;
      video.classList.add('preview-video');
      previewContainer.appendChild(video);
    }
  }
});

// Fungsi untuk mengkompres gambar
async function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })),
          'image/jpeg',
          quality
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Form submission handler
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

  // Validasi ukuran file
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (fotoDisplayFile && fotoDisplayFile.size > MAX_FILE_SIZE) {
    alert('Ukuran file Foto Display terlalu besar. Maksimal 5MB.');
    return;
  }
  if (fotoVideoFile && fotoVideoFile.size > MAX_FILE_SIZE) {
    alert('Ukuran file Foto/Video terlalu besar. Maksimal 5MB.');
    return;
  }

  // Upload Foto Display
  let fotoDisplayUrl = '';
  if (fotoDisplayFile) {
    try {
      const compressedFile = await compressImage(fotoDisplayFile);
      
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", "unsigned_preset");

      const response = await fetch('https://api.cloudinary.com/v1_1/dlsdpgqda/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!data.secure_url) throw new Error("Upload failed");

      // Tambahkan parameter transformasi Cloudinary
      fotoDisplayUrl = data.secure_url.replace('/upload/', '/upload/w_800,q_70,f_auto/');
    } catch (error) {
      console.error("Gagal upload Foto Display:", error);
      alert("Gagal mengupload Foto Display.");
      return;
    }
  }

  // Upload Foto/Video
  let fotoVideoUrl = '';
  if (fotoVideoFile) {
    try {
      let fileToUpload = fotoVideoFile;
      // Hanya kompres jika file adalah gambar
      if (fotoVideoFile.type.startsWith('image/')) {
        fileToUpload = await compressImage(fotoVideoFile);
      }

      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("upload_preset", "unsigned_preset");

      const response = await fetch('https://api.cloudinary.com/v1_1/dlsdpgqda/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!data.secure_url) throw new Error("Upload failed");

      // Untuk gambar, tambahkan parameter transformasi
      if (fotoVideoFile.type.startsWith('image/')) {
        fotoVideoUrl = data.secure_url.replace('/upload/', '/upload/w_800,q_70,f_auto/');
      } else {
        fotoVideoUrl = data.secure_url;
      }
    } catch (error) {
      console.error("Gagal upload Foto/Video:", error);
      alert("Gagal mengupload Foto atau Video.");
      return;
    }
  }

  // Simpan ke Firebase
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
    FotoVideo: fotoVideoUrl || "",
    createdAt: firebase.database.ServerValue.TIMESTAMP
  };

  produkRef.set(data)
    .then(() => {
      alert('Produk berhasil disimpan!');
      document.getElementById('produkForm').reset();
      document.getElementById('displayPreview').innerHTML = '';
      document.getElementById('videoPreview').innerHTML = '';
    })
    .catch(error => {
      console.error('Gagal menyimpan produk:', error);
      alert('Terjadi kesalahan saat menyimpan produk.');
    });
});