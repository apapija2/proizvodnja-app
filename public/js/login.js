document
  .getElementById('loginForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const loginData = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
    };

    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const token = await response.text();
      localStorage.setItem('token', token);
      window.location.href = '/dashboard';
    } else {
      alert('Neispravni podaci. Pokušajte ponovo.');
    }
  });
