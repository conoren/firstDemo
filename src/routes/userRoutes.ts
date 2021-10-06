import express from 'express';
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


/*function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}*/

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

export default router;