document
  .getElementById('productForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const productData = {
      sifraProizvoda: document.getElementById('sifraProizvoda').value,
      datumNarudzbe: document.getElementById('datumNarudzbe').value,
      imeKupca: document.getElementById('imeKupca').value,
      mjestoKupca: document.getElementById('mjestoKupca').value,
      materijalVani: document.getElementById('materijalVani').value,
      bojaVani: document.getElementById('bojaVani').value,
      materijalUnutra: document.getElementById('materijalUnutra').value,
      bojaUnutra: document.getElementById('bojaUnutra').value,
      aplikacija: document.getElementById('aplikacija').value,
      model: document.getElementById('model').value,
      staklo: document.getElementById('staklo').value,
      dimenzije: document.getElementById('dimenzije').value,
      kolicina: document.getElementById('kolicina').value,
      napomena: document.getElementById('napomena').value,
      izvedba: document.getElementById('izvedba').value,
    };

    const response = await fetch('/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      alert('Proizvod uspješno dodan!');
      document.getElementById('productForm').reset();
    } else {
      alert('Došlo je do greške. Pokušajte ponovo.');
    }
  });
