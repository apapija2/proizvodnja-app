document
  .getElementById('loginForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();  // Sprečava automatsko ponovno učitavanje stranice

    const loginData = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
    };

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem('token', token);  // Sprema token u localStorage
        window.location.href = '/index.html';  // Preusmjerava korisnika na glavnu stranicu
      } else {
        alert('Neispravni podaci. Pokušajte ponovo.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Došlo je do greške. Pokušajte ponovo.');
    }
  });
