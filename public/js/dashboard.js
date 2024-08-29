document.addEventListener('DOMContentLoaded', async function () {
  const response = await fetch('/api/product', {
    headers: {
      'auth-token': localStorage.getItem('token'),
    },
  });

  const products = await response.json();

  const tableBody = document.getElementById('productData');
  tableBody.innerHTML = '';

  products.forEach((product) => {
    const progress = calculateProgress(product);

    const row = `<tr>
            <td>${product.sifraProizvoda}</td>
            <td>${product.imeKupca}</td>
            <td>${product.tehnickaPriprema?.status || 'N/A'}</td>
            <td>${product.cnc?.status || 'N/A'}</td>
            <td>${product.farbara?.status || 'N/A'}</td>
            <td>${product.aplikacijaWj?.status || 'N/A'}</td>
            <td>${product.staklo?.status || 'N/A'}</td>
            <td>${product.ljepljenje?.status || 'N/A'}</td>
            <td>${product.zavrsavanje?.status || 'N/A'}</td>
            <td>${progress}%</td>
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
