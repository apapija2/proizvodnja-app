const token = localStorage.getItem('token'); // Retrieve the token from localStorage

if (!token) {
  alert('You are not logged in');
  window.location.href = '/login'; // Redirect to login if no token
  return;
}

try {
  const response = await fetch('/cnc', { // Replace '/cnc' with the correct route
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Access denied');
  }

  const data = await response.json();
  console.log('CNC data:', data); // Handle your CNC data
} catch (error) {
  console.error('Error fetching CNC data:', error);
  alert('Access denied or session expired.');
}
