// File: login.js
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent form from refreshing the page

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
      body: JSON.stringify(loginData), // Send login credentials
    });

    if (response.ok) {
      const { role } = await response.json(); // Receive the role from the server

      // Redirect based on user role
      switch (role) {
        case 'cnc':
          window.location.href = '/cnc'; // Redirect to CNC dashboard
          break;
        case 'tehnicka-priprema':
          window.location.href = '/tehnicka-priprema'; // Redirect to Tehnička Priprema dashboard
          break;
        case 'aplikacija-wj':
          window.location.href = '/aplikacija-wj'; // Redirect to Aplikacija WJ dashboard
          break;
        default:
          window.location.href = '/'; // Default redirection
      }
    } else {
      document.getElementById('error-message').style.display = 'block'; // Show error message
    }
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed. Please try again.');
  }
});
