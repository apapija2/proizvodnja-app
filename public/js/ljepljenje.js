document.addEventListener('DOMContentLoaded', async function () {
  const productSelect = document.getElementById('productId');
  const quantityInput = document.getElementById('ljepljenjeZavrseno'); 
  const quantityHelp = document.getElementById('quantityHelp');
  let selectedProduct = null;

  const response = await fetch('/api/narudzba');

  if (!response.ok) {
    console.error('Failed to load orders:', response.statusText);
    return;
  }

  const narudzbe = await response.json();

  narudzbe.forEach((narudzba, index) => {
    const option = document.createElement('option');
    option.value = narudzba._id;
    option.textContent = narudzba.sifraProizvoda;
    option.dataset.kolicina = narudzba.kolicina;
    productSelect.appendChild(option);

    if (index === 0) {
      productSelect.value = narudzba._id;
      selectedProduct = narudzba;
      quantityHelp.textContent = `Maximalan broj komada: ${selectedProduct.kolicina}`;
      quantityInput.max = selectedProduct.kolicina;
    }
  });

  productSelect.addEventListener('change', function () {
    selectedProduct = narudzbe.find(p => p._id === this.value);
    if (selectedProduct) {
      quantityHelp.textContent = `Maximalan broj komada: ${selectedProduct.kolicina}`;
      quantityInput.max = selectedProduct.kolicina;
    } else {
      quantityHelp.textContent = '';
      quantityInput.max = 0;
    }
  });

  document.getElementById('ljepljenjeForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!selectedProduct) {
      alert('Molimo odaberite narudžbu.');
      return;
    }

    const productId = productSelect.value;
    const status = document.getElementById('ljepljenjeStatus').value;
    const zavrseno = parseInt(quantityInput.value);

    if (zavrseno > selectedProduct.kolicina) {
      alert('Broj dovršenih komada ne može biti veći od ukupne količine!');
      return;
    }

    const response = await fetch(`/api/narudzba/${productId}/ljepljenje`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, zavrseno }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Podaci uspješno ažurirani!');
    } else {
      alert(data.error || 'Došlo je do greške pri ažuriranju podataka.');
    }
  });
});
