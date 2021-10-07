import express, { response } from 'express';
//import { getAllEvents } from '../services/eventService';
import * as userService from '../services/userService';

const router = express.Router();

// routes
//router.post('/authenticate', authenticate);
router.post('/authenticate',(req,res,next)=>{
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
})
router.get('/getusers', getAll);
function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

router.get('/getMyEvents', getAllEvents);
function getAllEvents(req,res){
    userService.getMyEvents()
        .then(myEvents => res.json(myEvents));
}

router.post('/joinEvent',(req,res)=>{
    userService.joinEvent(req.body)
    .then(response=>res.json(response))
})

router.delete('/leaveEvent',(req,res)=>{
    userService.leaveEvent(req.body);
    res.sendStatus(200);
})

/*function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}*/



export default router;