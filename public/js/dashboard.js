document.addEventListener('DOMContentLoaded', async function () {
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
  console.log(products);  // Provjera učitanih podataka

  const tableBody = document.getElementById('productData');
  tableBody.innerHTML = '';

  products.forEach((product) => {
    const kolicina = product.kolicina || 1;  // Osiguravanje da količina nije 0 ili undefined

    const tehnickaPripremaZavrseno = product.tehnickaPriprema?.zavrseno || 0;
    const cncZavrseno = product.cnc?.zavrseno || 0;
    const farbaraZavrseno = product.farbara?.zavrseno || 0;
    const aplikacijaWjZavrseno = product.aplikacijaWj?.zavrseno || 0;
    const stakloZavrseno = product.staklo?.zavrseno || 0;
    const ljepljenjeZavrseno = product.ljepljenje?.zavrseno || 0;
    const zavrsavanjeZavrseno = product.zavrsavanje?.zavrseno || 0;

    const tehnickaPripremaPercentage = Math.round((tehnickaPripremaZavrseno / kolicina) * 100);
    const cncPercentage = Math.round((cncZavrseno / kolicina) * 100);
    const farbaraPercentage = Math.round((farbaraZavrseno / kolicina) * 100);
    const aplikacijaWjPercentage = Math.round((aplikacijaWjZavrseno / kolicina) * 100);
    const stakloPercentage = Math.round((stakloZavrseno / kolicina) * 100);
    const ljepljenjePercentage = Math.round((ljepljenjeZavrseno / kolicina) * 100);
    const zavrsavanjePercentage = Math.round((zavrsavanjeZavrseno / kolicina) * 100);

    const row = `<tr>
            <td>${product.sifraProizvoda}</td>
            <td>${new Date(product.datumNarudzbe).toLocaleDateString()}</td>
            <td>${product.imeKupca}</td>
            <td>${product.mjestoKupca?.naziv || 'N/A'}</td>

            <td>${product.tehnickaPriprema?.status || 'N/A'} / ${tehnickaPripremaPercentage}% gotovo</td>
            <td>${product.cnc?.status || 'N/A'} / ${cncPercentage}% gotovo</td>
            <td>${product.farbara?.status || 'N/A'} / ${farbaraPercentage}% gotovo</td>
            <td>${product.aplikacijaWj?.status || 'N/A'} / ${aplikacijaWjPercentage}% gotovo</td>
            <td>${product.staklo?.status || 'N/A'} / ${stakloPercentage}% gotovo</td>
            <td>${product.ljepljenje?.status || 'N/A'} / ${ljepljenjePercentage}% gotovo</td>
            <td>${product.zavrsavanje?.status || 'N/A'} / ${zavrsavanjePercentage}% gotovo</td>
            <td>
              <div class="progress-container">
                <div class="progress-bar" style="width: ${calculateProgress(tehnickaPripremaPercentage, cncPercentage, farbaraPercentage, aplikacijaWjPercentage, stakloPercentage, ljepljenjePercentage, zavrsavanjePercentage)}%;">
                  ${calculateProgress(tehnickaPripremaPercentage, cncPercentage, farbaraPercentage, aplikacijaWjPercentage, stakloPercentage, ljepljenjePercentage, zavrsavanjePercentage)}%
                </div>
              </div>
            </td>
        </tr>`;
    tableBody.innerHTML += row;
  });
});

function calculateProgress(tehnickaPriprema, cnc, farbara, aplikacijaWj, staklo, ljepljenje, zavrsavanje) {
  const totalProgress = tehnickaPriprema + cnc + farbara + aplikacijaWj + staklo + ljepljenje + zavrsavanje;
  return Math.round(totalProgress / 7);
}
