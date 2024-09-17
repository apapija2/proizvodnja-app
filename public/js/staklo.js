document.addEventListener('DOMContentLoaded', async function () {
  const productSelect = document.getElementById('productId');
  const quantityInput = document.getElementById('stakloZavrseno');
  const quantityHelp = document.getElementById('quantityHelp');
  let selectedProduct = null;

  // Fetch all orders
  const response = await fetch('/api/narudzba', {
    headers: {
      'auth-token': localStorage.getItem('token'),
    },
  });

  if (!response.ok) {
    console.error('Failed to load orders:', response.statusText);
    return;
  }

  const narudzbe = await response.json();

  // Populate the dropdown with orders
  narudzbe.forEach((narudzba, index) => {
    const option = document.createElement('option');
    option.value = narudzba._id;
    option.textContent = narudzba.sifraProizvoda;
    option.dataset.kolicina = narudzba.kolicina;
    productSelect.appendChild(option);

    // Automatically select the first order and set selectedProduct
    if (index === 0) {
      productSelect.value = narudzba._id;
      selectedProduct = narudzba;
      quantityHelp.textContent = `Maximalan broj komada: ${selectedProduct.kolicina}`;
      quantityInput.max = selectedProduct.kolicina;
    }
  });

  // Update selected order when changed
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

  document.getElementById('stakloForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!selectedProduct) {
      alert('Molimo odaberite narudžbu.');
      return;
    }

    const productId = productSelect.value;
    const status = document.getElementById('stakloStatus').value;
    const zavrseno = parseInt(quantityInput.value);

    if (zavrseno > selectedProduct.kolicina) {
      alert('Broj dovršenih komada ne može biti veći od ukupne količine!');
      return;
    }

    const response = await fetch(`/api/narudzba/${productId}/staklo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
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
