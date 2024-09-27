const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Povezivanje s bazom podataka
mongoose.connect('mongodb://127.0.0.1:27017/proizvodnja', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to DB'))
.catch(err => console.error('Connection error', err));

// Funkcija za dodavanje korisnika
async function addUser(username, password, role) {
    // Provjera postoji li korisnik s istim korisničkim imenom
    let user = await User.findOne({ username });
    if (user) {
        console.log(`User ${username} already exists`);
        return;
    }

    // Hashiranje lozinke
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Kreiranje novog korisnika
    user = new User({
        username,
        password: hashedPassword,
        role
    });

    await user.save();
    console.log(`User ${username} added successfully!`);
}

// Funkcija za dodavanje više korisnika odjednom
async function addMultipleUsers(users) {
    for (const user of users) {
        const { username, password, role } = user;
        await addUser(username, password, role);
    }
}

// Lista korisnika za dodavanje
const usersToAdd = [
    { username: 'tehnicka-priprema', password: 'lozinka123', role: 'tehnicka-priprema' },
    { username: 'prodaja', password: 'lozinka123', role: 'prodaja' },
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'aplikacija-wj', password: 'lozinka123', role: 'aplikacija-wj' },
    { username: 'farbara', password: 'lozinka123', role: 'farbara' },
    { username: 'ljepljenje', password: 'lozinka123', role: 'ljepljenje' },
    { username: 'cnc', password: 'lozinka123', role: 'cnc' },
    { username: 'staklo', password: 'lozinka123', role: 'staklo' },
    { username: 'zavrsavanje', password: 'lozinka123', role: 'zavrsavanje' }
];

// Pozivanje funkcije za dodavanje više korisnika
addMultipleUsers(usersToAdd).then(() => {
    mongoose.connection.close(); // Zatvaranje konekcije s bazom podataka
});

