import { registerUser } from "../../../src/controllers/authController";
import {describe, expect, test} from '@jest/globals';

describe('testing registerUser from authController', () => {
    test('Valid data returns 201 with message: Utilisateur créé', ()=>{
        const request = {
            body: {
                email: "johnny@oclock.io",
                password: "2eTapaovnezdjnj"
            }
        }
        const response = {}
        registerUser(request,)
    }),

    test('Already existing email in request body returns 409 with message: Cet email est déjà utilisé', ()=>{
        const request;
    })
})