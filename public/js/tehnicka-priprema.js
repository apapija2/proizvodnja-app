document.addEventListener('DOMContentLoaded', async function () {
  const productSelect = document.getElementById('productId');
  const quantityInput = document.getElementById('tehnickaPripremaZavrseno');
  const quantityHelp = document.getElementById('quantityHelp');
  let selectedNarudzba = null;

  // Fetch all narudzbas (umjesto products)
  const response = await fetch('/api/narudzbas', {  // Ažurirana ruta za narudzbas

  });

  if (!response.ok) {
    console.error('Failed to load narudzbas:', response.statusText);
    return;
  }

  const narudzbas = await response.json();

  // Populate the dropdown with narudzbas
  narudzbas.forEach((narudzba, index) => {
    const option = document.createElement('option');
    option.value = narudzba._id;  // Koristi narudzba._id za vrijednost opcije
    option.textContent = narudzba.sifraProizvoda || 'Bez šifre';  // Prikazuje šifru proizvoda ili 'Bez šifre' ako nije definirano
    option.dataset.kolicina = narudzba.kolicina;
    productSelect.appendChild(option);

    // Automatski odaberi prvu narudzbu
    if (index === 0) {
      productSelect.value = narudzba._id;
      selectedNarudzba = narudzba;
      quantityHelp.textContent = `Maximalan broj komada: ${selectedNarudzba.kolicina}`;
      quantityInput.max = selectedNarudzba.kolicina;
    }
  });

  // Ažuriraj odabranu narudzbu
  productSelect.addEventListener('change', function () {
    selectedNarudzba = narudzbas.find(n => n._id === this.value);
    if (selectedNarudzba) {
      quantityHelp.textContent = `Maximalan broj komada: ${selectedNarudzba.kolicina}`;
      quantityInput.max = selectedNarudzba.kolicina;
    } else {
      quantityHelp.textContent = '';
      quantityInput.max = 0;
    }
  });

  document.getElementById('tehnickaPripremaForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!selectedNarudzba) {
      alert('Molimo odaberite narudžbu.');
      return;
    }

    const narudzbaId = productSelect.value;
    const status = document.getElementById('tehnickaPripremaStatus').value;
    const zavrseno = parseInt(quantityInput.value);

    if (zavrseno > selectedNarudzba.kolicina) {
      alert('Broj dovršenih komada ne može biti veći od ukupne količine!');
      return;
    }

    const response = await fetch(`/api/narudzba/${narudzbaId}/tehnicka-priprema`, {
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
