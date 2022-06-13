import {body} from 'express-validator';
import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

import User from './User.js';

export default class Validate {
    // REGISTER
    static registerUserName(usernameFields) {
        return body(usernameFields)
        .notEmpty({ignore_whitespace:false}).withMessage('username required!')
        .custom((value) => {
            return User.findByUsername(value)
                .then(([user]) => {
                    if(!value) {
                        return;
                    }
                    if (user[0]) {
                        throw new Error(`username ${value} is already used!`)
                        // return Promise.reject(`email ${value} is already signed!`)
                    } 
                    return;
                })
        })
    }
    static registerEmail(emailFields) {
        return body(emailFields)
            .notEmpty({ignore_whitespace:false}).withMessage('email field required!')
            .isEmail().withMessage('inser a valid email!')
            .custom((value) => {
                return User.findByEmail(value)
                    .then(([user]) => {
                        if(!value) {
                            return;
                        }
                        if (user[0]) {
                            throw new Error(`email ${value} is already signed!`)
                            // return Promise.reject(`email ${value} is already signed!`)
                        } 
                        return;
                    })
            })
    }
    
    static registerPassword(passwordFields) {
        return body(passwordFields)
            .notEmpty({ignore_whitespace:false}).withMessage('password field required!')
            .isLength({min: 6}).withMessage('password length minimum 6 characters!')
    }

    static registerConfirmPassword(confirmPasswordFields) {
        return body(confirmPasswordFields)
            .custom((value, {req}) => {
                if(!value || value !== req.body.password) {
                    throw new Error('Confirm the same password!')
                }
                return true;
            })
    }

    // LOGIN
    static loginUserName(userNameFields) {
        return body(userNameFields)
        .notEmpty({ignore_whitespace:false}).withMessage('type your username!')
        .custom((value) => {
            return User.findByUsername(value)
                .then(([user]) => {
                    if(!value) {
                        return;
                    }
                    if (!user[0]) {
                        throw new Error(`Wrong username or password!`)
                        // return Promise.reject(`email ${value} is already signed!`)
                    } 
                    return;
                })
        })
    }

    static loginPassword(passwordFields) {
        return body(passwordFields)
            .notEmpty({ignore_whitespace:false}).withMessage('password field required!')
            .custom((value, {req}) => {
                return User.findByUsername(req.body.userName) 
                    .then(([user]) => {
                        if(!user[0]) {
                            return;
                        }
                        return bcrypt.compare(value,user[0].password)
                            .then(result => {
                                if(!result) {
                                    throw new Error(`Wrong username or password!`);
                                }
                                
                                return true;
                            })
                    }) 
                    
            })
    }

    static uploadPost(image) {
        return body(image).notEmpty().withMessage('image required!')
            
    }
}