document.addEventListener('DOMContentLoaded', function() {
    // Generate auto ID
    const userId = generateAutoId();
    document.getElementById('userId').value = userId;

    // Handle form submission
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const nama = document.getElementById('nama').value;
        const email = document.getElementById('email').value;
        const telepon = document.getElementById('telepon').value;
        const password = document.getElementById('password').value;

        // Save to Firebase
        saveUserToFirebase(userId, nama, email, telepon, password);
    });
});

function generateAutoId() {
    // Generate timestamp-based ID
    return 'user-' + new Date().getTime();
}

function saveUserToFirebase(id, nama, email, telepon, password) {
    const userRef = database.ref('user/' + id);
    
    userRef.set({
        nama: nama,
        email: email,
        telepon: telepon,
        password: password // Note: In production, you should hash passwords!
    })
    .then(() => {
        alert('User berhasil disimpan!');
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = generateAutoId(); // Generate new ID
    })
    .catch((error) => {
        console.error("Error saving user: ", error);
        alert('Gagal menyimpan user: ' + error.message);
    });
}