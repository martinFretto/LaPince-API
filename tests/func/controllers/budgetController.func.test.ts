import { Request, Response } from "express";
import {describe, expect, test, jest} from '@jest/globals';
import { createBudget, deleteBudget } from "../../../src/controllers/budgetController";
import { TokenPayloadType } from "../../../src/types/TokenPayloadType";
import { generateToken } from "../../../src/libs/jwtToken";
import { authMiddleware } from "../../../src/middlewares/authMiddleware";

describe('testing deleteBudget from budgetController', () => {
    test('Valid data returns 201 with message', async()=>{

        const tokenPayload: TokenPayloadType ={
            id: 1,
            email: "martin.fretto@gmail.com"
        }
        const jwtToken = generateToken(tokenPayload);

        const request = {
            body:  {
                name: "alimentation",
                warning_amount: 600,
                allocated_amount: 700,
                color: "#ffffff",
                icon:"/src/assets/icons/aquarium-dolphin-fish-svgrepo-com.svg"
            },
            token: jwtToken 
            //C'est le middleware d'authentification qui rajoute le token venant du front dans une clé "token"
            //Il transmet ensuite cette requête au controller
        } as Partial<Request>;
          
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        await createBudget(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(201);
    });

});
