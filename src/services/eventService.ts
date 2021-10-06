import {pool, users, events, usersxevents } from "../config/db.config";

export async function getAllEvents() {
    return events;
}

export async function getEvent(body) {
    const event = events.find(u => u.name === body.name);

    return event;
}

//make new event
//delete event

//get my events
//join an event
//leave an event