// Show progress modal with animation
function showProgress(message) {
  const modal = document.getElementById('progressModal');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  
  progressText.textContent = message;
  progressBar.style.width = '0%';
  progressBar.classList.add('progress-animate');
  modal.style.display = 'block';
}

// Update progress
function updateProgress(percent, message) {
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  
  progressBar.classList.remove('progress-animate');
  progressBar.style.width = percent + '%';
  progressText.textContent = message;
}

// Hide progress modal
function hideProgress() {
  const modal = document.getElementById('progressModal');
  modal.style.display = 'none';
}

// Form submission handler with progress
document.getElementById('produkForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  showProgress('Memulai proses penyimpanan...');

  try {
    // Get form values
    const nama = document.getElementById('nama').value.trim();
    const harga = document.getElementById('harga').value.trim();
    const keterangan = document.getElementById('keterangan').value.trim();
    const fotoDisplayFile = document.getElementById('fotoDisplay').files[0];
    const fotoVideoFile = document.getElementById('fotoVideo').files[0];

    // Check user authentication
    const user = JSON.parse(localStorage.getItem("user"));
    const idToko = user ? user.id : null;
    if (!idToko) {
      hideProgress();
      alert("User belum login. ID toko tidak ditemukan di localStorage.");
      return;
    }

    // Validate file sizes
    updateProgress(10, 'Memvalidasi ukuran file...');
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (fotoDisplayFile && fotoDisplayFile.size > MAX_FILE_SIZE) {
      hideProgress();
      alert('Ukuran file Foto Display terlalu besar. Maksimal 5MB.');
      return;
    }
    if (fotoVideoFile && fotoVideoFile.size > MAX_FILE_SIZE) {
      hideProgress();
      alert('Ukuran file Foto/Video terlalu besar. Maksimal 5MB.');
      return;
    }

    // Upload Foto Display
    let fotoDisplayUrl = '';
    if (fotoDisplayFile) {
      updateProgress(20, 'Mengkompres foto display...');
      const compressedFile = await compressImage(fotoDisplayFile);
      
      updateProgress(30, 'Mengupload foto display...');
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", "unsigned_preset");

      const response = await fetch('https://api.cloudinary.com/v1_1/dlsdpgqda/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!data.secure_url) throw new Error("Upload foto display gagal");

      fotoDisplayUrl = data.secure_url.replace('/upload/', '/upload/w_800,q_70,f_auto/');
    }

    // Upload Foto/Video
    let fotoVideoUrl = '';
    if (fotoVideoFile) {
      updateProgress(50, 'Mengkompres foto/video...');
      let fileToUpload = fotoVideoFile;
      if (fotoVideoFile.type.startsWith('image/')) {
        fileToUpload = await compressImage(fotoVideoFile);
      }

      updateProgress(60, 'Mengupload foto/video...');
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("upload_preset", "unsigned_preset");

      const response = await fetch('https://api.cloudinary.com/v1_1/dlsdpgqda/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!data.secure_url) throw new Error("Upload foto/video gagal");

      fotoVideoUrl = fotoVideoFile.type.startsWith('image/') 
        ? data.secure_url.replace('/upload/', '/upload/w_800,q_70,f_auto/')
        : data.secure_url;
    }

    // Save to Firebase
    updateProgress(80, 'Menyimpan data produk...');
    const produkId = Date.now();
    const produkRef = firebase.database().ref('produk/' + produkId);

    const productData = {
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

    await produkRef.set(productData);
    updateProgress(100, 'Produk berhasil disimpan!');

    // Redirect to view page after short delay
    setTimeout(() => {
      window.location.href = `viewProduk.html?id=${produkId}`;
    }, 1000);

  } catch (error) {
    console.error('Error:', error);
    hideProgress();
    alert('Terjadi kesalahan: ' + error.message);
  }
});

// Compress image function (keep the same as before)
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