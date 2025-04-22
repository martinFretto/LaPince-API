import { Request, Response } from "express";
import { registerUser } from "../../../src/controllers/authController";
import {describe, expect, test, jest} from '@jest/globals';

describe('testing registerUser from authController', () => {
    test('Valid data returns 201 with message: Utilisateur créé', async()=>{
        const request: Partial<Request>  = {
            body:  {
                email: "david@o.io",
                password: "2eTapaovnezdjnj"
            }
        };

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        await registerUser(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.json).toHaveBeenCalledWith({ status: 201, message: "Utilisateur créé"});
    });
});
