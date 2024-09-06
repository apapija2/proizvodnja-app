document.addEventListener('DOMContentLoaded', async function () {
  const productSelect = document.getElementById('productId');
  const quantityInput = document.getElementById('farbaraZavrseno');
  const quantityHelp = document.getElementById('quantityHelp');
  const progressPercentage = document.getElementById('progressPercentage');
  let selectedProduct = null;

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

  products.forEach((product, index) => {
    const option = document.createElement('option');
    option.value = product._id;
    option.textContent = product.sifraProizvoda;
    option.dataset.kolicina = product.kolicina;
    productSelect.appendChild(option);

    if (index === 0) {
      productSelect.value = product._id;
      selectedProduct = product;
      quantityHelp.textContent = `Maximalan broj komada: ${selectedProduct.kolicina}`;
      quantityInput.max = selectedProduct.kolicina;
      updateProgress(selectedProduct);
    }
  });

  productSelect.addEventListener('change', function () {
    selectedProduct = products.find(p => p._id === this.value);
    if (selectedProduct) {
      quantityHelp.textContent = `Maximalan broj komada: ${selectedProduct.kolicina}`;
      quantityInput.max = selectedProduct.kolicina;
      updateProgress(selectedProduct);
    } else {
      quantityHelp.textContent = '';
      quantityInput.max = 0;
      progressPercentage.textContent = '';
    }
  });

  document.getElementById('farbaraForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!selectedProduct) {
      alert('Molimo odaberite proizvod.');
      return;
    }

    const productId = productSelect.value;
    const status = document.getElementById('farbaraStatus').value;
    const zavrseno = parseInt(quantityInput.value);

    if (zavrseno > selectedProduct.kolicina) {
      alert('Broj dovršenih komada ne može biti veći od ukupne količine!');
      return;
    }

    const response = await fetch(`/api/product/${productId}/farbara`, {
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
      updateProgress(data);
    } else {
      alert(data.error || 'Došlo je do greške pri ažuriranju podataka.');
    }
  });

  function updateProgress(product) {
    const percentage = Math.round((product.farbara.zavrseno / product.kolicina) * 100);
    progressPercentage.textContent = `Progres: ${percentage}%`;
  }
});
