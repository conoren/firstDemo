//const config = require('config.json');
const jwt = require('jsonwebtoken');

// ezt majd átváltani postgre-re
const users = [
    { id: 1, email: 'conoren2@gmail.com', password: 'belavagyok', firstName: 'Test', lastName: 'User', name: 'Tóth Béla' },
    { id: 2, email: 'cecil@gmail.com', password: 'cecilvagyok', firstName: 'Test', lastName: 'User', name: 'Tóth Cecil' }
];

module.exports = {
    authenticate,
    getAll
};

async function authenticate({ email, password }) {
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) throw 'Email or password is incorrect';

    // create a jwt token that is valid for an hour
    const token = jwt.sign({ sub: user.id }, process.env.SESSION_SECRET, { expiresIn: '1h' });

    return {
        ...omitPassword(user),
        token
    };
}

async function getAll() {
    return users.map(u => omitPassword(u));
}

// helper functions

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}