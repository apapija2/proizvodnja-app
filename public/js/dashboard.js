document.addEventListener('DOMContentLoaded', async function () {
  try {
    const response = await fetch('/api/product'); // Dohvaćanje narudžbi s backend-a
    const narudzbe = await response.json(); // Pretvorba odgovora u JSON

    const tableBody = document.getElementById('productData');
    tableBody.innerHTML = '';

    // Popunjavanje tablice narudžbama
    narudzbe.forEach((narudzba) => {
      const row = `<tr>
        <td>${narudzba.sifraProizvoda || 'N/A'}</td> <!-- Dodaj prikaz šifre proizvoda -->
        <td>${new Date(narudzba.datumNarudzbe).toLocaleDateString() || 'N/A'}</td>
        <td>${narudzba.kupac.naziv || 'N/A'}</td>
        <td>${narudzba.mjestoKupca?.naziv || 'N/A'}</td>
        <td>${narudzba.tehnickaPriprema?.status || 'N/A'}</td>
        <td>${narudzba.cnc?.status || 'N/A'}</td>
        <td>${narudzba.farbara?.status || 'N/A'}</td>
        <td>${narudzba.aplikacijaWj?.status || 'N/A'}</td>
        <td>${narudzba.staklo?.status || 'N/A'}</td>
        <td>${narudzba.ljepljenje?.status || 'N/A'}</td>
        <td>${narudzba.zavrsavanje?.status || 'N/A'}</td>
        <td>
          <div class="progress-container">
            <div class="progress-bar" style="width: ${calculateProgress(narudzba)}%;">
              ${calculateProgress(narudzba)}%
            </div>
          </div>
        </td>
        <td><a href="/narudzbe/${narudzba._id}" class="btn-details">Detalji</a></td>
      </tr>`;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error('Failed to load orders:', error);
  }
});


// Funkcija za izračunavanje postotka napretka narudžbe
function calculateProgress(narudzba) {
  const stages = [
    narudzba.tehnickaPriprema?.status === 'zavrseno' ? 1 : 0,
    narudzba.cnc?.status === 'zavrseno' ? 1 : 0,
    narudzba.farbara?.status === 'zavrseno' ? 1 : 0,
    narudzba.aplikacijaWj?.status === 'zavrseno' ? 1 : 0,
    narudzba.staklo?.status === 'zavrseno' ? 1 : 0,
    narudzba.ljepljenje?.status === 'zavrseno' ? 1 : 0,
    narudzba.zavrsavanje?.status === 'zavrseno' ? 1 : 0,
  ];
  const totalStages = stages.length;
  const completedStages = stages.reduce((acc, stage) => acc + stage, 0);
  return Math.round((completedStages / totalStages) * 100);
}
