document.getElementById('stakloForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const status = document.getElementById('stakloStatus').value;
    const zavrseno = document.getElementById('stakloZavrseno').value;
    const productId = document.getElementById('productId').value;

    const response = await fetch(`/api/product/${productId}/staklo`, {
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
