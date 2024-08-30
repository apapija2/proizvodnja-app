document.addEventListener('DOMContentLoaded', async function () {
    const productSelect = document.getElementById('productId');
    const quantityInput = document.getElementById('tehnickaPripremaZavrseno');
    const quantityHelp = document.getElementById('quantityHelp');
    let selectedProduct = null;
  
    // Fetch all products
    const response = await fetch('/api/product', {
      headers: {
        'auth-token': localStorage.getItem('token'),
      },
    });
  
    if (!response.ok) {
      console.error('Failed to load products:', response.statusText);
      return;
    }
  
    const products = await response.json();
  
    products.forEach((product) => {
      const option = document.createElement('option');
      option.value = product._id;
      option.textContent = product.sifraProizvoda;
      option.dataset.kolicina = product.kolicina;
      productSelect.appendChild(option);
    });
  
    // Update selected product when changed
    productSelect.addEventListener('change', function () {
      selectedProduct = products.find(p => p._id === this.value);
      if (selectedProduct) {
        quantityHelp.textContent = `Maximalan broj komada: ${selectedProduct.kolicina}`;
        quantityInput.max = selectedProduct.kolicina;
      }
    });
  
    document.getElementById('tehnickaPripremaForm').addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const productId = productSelect.value;
      const status = document.getElementById('tehnickaPripremaStatus').value;
      const zavrseno = parseInt(quantityInput.value);
  
      if (zavrseno > selectedProduct.kolicina) {
        alert('Broj dovršenih komada ne može biti veći od ukupne količine!');
        return;
      }
  
      const response = await fetch(`/api/product/${productId}/tehnicka-priprema`, {
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
  