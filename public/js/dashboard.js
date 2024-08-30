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

  const tableBody = document.getElementById('productData');
  tableBody.innerHTML = '';

  products.forEach((product) => {
    const progress = calculateProgress(product);
    const progressPercentage = Math.round((product.tehnickaPriprema.zavrseno / product.kolicina) * 100);

    const row = `<tr>
            <td>${product.sifraProizvoda}</td>
            <td>${new Date(product.datumNarudzbe).toLocaleDateString()}</td>
            <td>${product.imeKupca}</td>
            <td>${product.mjestoKupca}</td>
            <td>${product.materijalVani}</td>
            <td>${product.bojaVani}</td>
            <td>${product.materijalUnutra}</td>
            <td>${product.bojaUnutra}</td>
            <td>${product.aplikacija}</td>
            <td>${product.model}</td>
            <td>${product.staklo}</td>
            <td>${product.dimenzije}</td>
            <td>${product.kolicina}</td>
            <td>${product.napomena}</td>
            <td>${product.izvedba}</td>
            <td>${product.tehnickaPriprema?.status || 'N/A'} / ${progressPercentage}% gotovo</td>
            <td>${product.cnc?.status || 'N/A'}</td>
            <td>${product.farbara?.status || 'N/A'}</td>
            <td>${product.aplikacijaWj?.status || 'N/A'}</td>
            <td>${product.staklo?.status || 'N/A'}</td>
            <td>${product.ljepljenje?.status || 'N/A'}</td>
            <td>${product.zavrsavanje?.status || 'N/A'}</td>
            <td>
              <div class="progress-container">
                <div class="progress-bar" style="width: ${progress}%;">
                  ${progress}%
                </div>
              </div>
            </td>
        </tr>`;
    tableBody.innerHTML += row;
  });
});

function calculateProgress(product) {
  let completedStages = 0;
  const stages = [
    'tehnickaPriprema',
    'cnc',
    'farbara',
    'aplikacijaWj',
    'staklo',
    'ljepljenje',
    'zavrsavanje',
  ];

  stages.forEach((stage) => {
    if (product[stage]?.status === 'Gotov') {
      completedStages += 1;
    }
  });

  return (completedStages / stages.length) * 100;
}
