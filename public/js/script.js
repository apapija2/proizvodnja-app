// Object to store users by production stage
let proizvodnjaUser = {
    cnc: [],
    farbara: [],
    tehnickaPriprema: [],
    zavrsavanje: [],
    staklo: [],
    aplikacijaWJ: [],
    ljepljenje: []
};

// Handle form submission for adding users to the "Šifrant korisnici"
document.getElementById('user-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const stage = document.getElementById('stage').value;
    const name = document.getElementById('name').value;

    if (stage && name) {
        // Add user to the corresponding stage
        proizvodnjaUser[stage].push(name);
        displayUsers();
        this.reset();
    }
});

// Display users in the user list
function displayUsers() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    // Loop through each stage and display users
    for (const stage in proizvodnjaUser) {
        if (proizvodnjaUser[stage].length > 0) {
            proizvodnjaUser[stage].forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user} (${getStageName(stage)})`;
                userList.appendChild(li);
            });
        }
    }
}

// Return a human-readable name for each production stage
function getStageName(stage) {
    switch (stage) {
        case 'cnc': return 'CNC';
        case 'farbara': return 'Farbara';
        case 'tehnickaPriprema': return 'Tehnička Priprema';
        case 'zavrsavanje': return 'Završavanje';
        case 'staklo': return 'Staklo';
        case 'aplikacijaWJ': return 'Aplikacija-WJ';
        case 'ljepljenje': return 'Ljepljenje';
        default: return 'Nepoznat';
    }
}

// Populate the CNC form's user dropdown with relevant users
document.addEventListener('DOMContentLoaded', function() {
    populateCncUsers();
});

function populateCncUsers() {
    const userSelect = document.getElementById('user');
    userSelect.innerHTML = '';

    // Populate CNC users from proizvodnjaUser
    proizvodnjaUser.cnc.forEach(user => {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = user;
        userSelect.appendChild(option);
    });
}

// Handle CNC work entry form submission
document.getElementById('cnc-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const order = document.getElementById('order').value;
    const status = document.getElementById('status').value;
    const quantity = document.getElementById('quantity').value;
    const selectedUser = document.getElementById('user').value;

    if (order && status && quantity && selectedUser) {
        console.log(`Narudžba: ${order}, Status: ${status}, Količina: ${quantity}, Korisnik: ${selectedUser}`);
        // Send data to backend or handle as necessary
    }
});
app.get('/sifrant-proizvodnja-user', (req, res) => {
    res.render('sifrant-proizvodnja-user');  // Renders your EJS file
});