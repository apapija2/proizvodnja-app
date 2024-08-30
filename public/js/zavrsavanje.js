document.getElementById('zavrsavanjeForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const status = document.getElementById('zavrsavanjeStatus').value;
    const zavrseno = document.getElementById('zavrsavanjeZavrseno').value;
    const productId = document.getElementById('productId').value;

    const response = await fetch(`/api/product/${productId}/zavrsavanje`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ status, zavrseno })
    });

    if (response.ok) {
        alert('Podaci uspješno ažurirani!');
    } else {
        alert('Došlo je do greške pri ažuriranju podataka.');
    }
});
