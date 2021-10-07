import { pool, users, events, usersxevents } from "../config/db.config";
import { bcrypt } from "../config/passport-config";
import { User, Userxevents } from "../interfaces/jwtInterfaces";
const jwt = require('jsonwebtoken');

export let currentUser: User;

export async function authenticate({ email, password }) {
    const user = users.find(u => u.email === email && bcrypt.compare(password, u.password));

    if (!user) throw 'Email or password is incorrect';
    else currentUser = user;

    // create a jwt token that is valid for an hour
    const token = jwt.sign({ sub: user.id }, process.env.SESSION_SECRET, { expiresIn: '1h' });

    return {
        ...omitPassword(user),
        token
    };
}
function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export async function getAll() {
    return users;
}

export async function getMyEvents() {
    console.log(usersxevents);
    const myEvents = usersxevents.filter( e => e.userid === currentUser.id);
    console.log(myEvents);
    return myEvents;
}
export async function joinEvent(body: any) {
    const joinedEvent = usersxevents.filter(e=>e.userid === currentUser.id && e.eventname === body.eventname);
    if(!joinedEvent){
        pool.query(`INSERT INTO usersxevents (userid, eventname) VALUES ($1, $2)`,[currentUser.id, body.eventname]);
    }
    return joinedEvent;
}

export function leaveEvent(body: any) {
    const joinedEvent = usersxevents.filter(e=>e.userid === currentUser.id && e.eventname === body.eventname);
    if(joinedEvent){
        pool.query(`DELETE FROM usersxevents WHERE (userid=$1 AND eventname=$2)`,[currentUser.id, body.eventname]);
    }
    return joinedEvent;
}

