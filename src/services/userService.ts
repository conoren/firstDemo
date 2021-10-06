import { pool, users } from "../config/db.config";
import { bcrypt } from "../config/passport-config";
import { User } from "../interfaces/jwtInterfaces";
const jwt = require('jsonwebtoken');


export async function authenticate({ email, password }) {
    const user = users.find(u => u.email === email && bcrypt.compare(password, u.password));

    if (!user) throw 'Email or password is incorrect';

    // create a jwt token that is valid for an hour
    const token = jwt.sign({ sub: user.id }, process.env.SESSION_SECRET, { expiresIn: '1h' });

    return {
        ...omitPassword(user),
        token
    };
}

export async function getAll() {
    return users;
}

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}