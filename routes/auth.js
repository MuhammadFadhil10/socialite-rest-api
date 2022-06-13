import express from 'express';

const router = express.Router();

import Validate from '../models/Validation.js';

import {postCreateAccount, postLogin} from '../controllers/auth.js';

// GET
// /login


// POST
//  /create-account
router.post('/create-account', 
    Validate.registerUserName('userName'),
    Validate.registerEmail('email'),
    Validate.registerPassword('password'),
    Validate.registerConfirmPassword('confirmPassword')
    ,postCreateAccount
);
//  /login
router.post('/login', 
    Validate.loginUserName('userName'),
    Validate.loginPassword('password')
    ,postLogin
);
//  /logout

export default router;

