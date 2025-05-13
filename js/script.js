document.addEventListener('DOMContentLoaded', function() {
  // Ubah 'users' menjadi 'user' sesuai dengan nama tabel di Firebase
  const userRef = database.ref('user'); // <-- Ini yang diubah
  
  userRef.on('value', (snapshot) => {
    const userData = snapshot.val();
    const tableBody = document.querySelector('#users-table tbody');
    tableBody.innerHTML = '';
    
    if (userData) {
      Object.entries(userData).forEach(([id, user]) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
          <td>${id}</td>
          <td>${user.nama || '-'}</td>
          <td>${user.email || '-'}</td>
          <td>${user.telepon || '-'}</td>
        `;
        
        tableBody.appendChild(row);
      });
    } else {
      tableBody.innerHTML = '<tr><td colspan="4">Tidak ada data pengguna</td></tr>';
    }
  });
});