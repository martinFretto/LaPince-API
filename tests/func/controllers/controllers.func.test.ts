import { Request, Response } from "express";
import { loginUser, registerUser } from "../../../src/controllers/authController";
import {describe, expect, test, jest} from '@jest/globals';
import { generateToken } from "../../../src/libs/jwtToken";
import { createExpenditure } from "../../../src/controllers/expenditureController";
import { TokenPayloadType } from "../../../src/types/TokenPayloadType";
import { createBudget } from "../../../src/controllers/budgetController";

describe('testing registerUser from authController', () => {
    test('Valid data returns 201 with message: Utilisateur créé', async()=>{
        const request = {
            body:  {
                email: "david@o.io",
                password: "2eTapaovnezdjnj"
            }
        } as Partial<Request>;

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        await registerUser(request as Request, response as Response);
       expect(response.status).toHaveBeenCalledWith(201);
       expect(response.json).toHaveBeenCalledWith({ status: 201, message: "Utilisateur créé"});
       //expect(response).toEqual({ status: 201, message: 'Utilisateur créé'})
    });
    test('Already existing email returns 409 with message:  "Cet email est déjà utilisé!', async()=>{
        const request = {
            body: {
                email: "martin.fretto@gmail.com",
                password: "2eTapaovnezdjnj"
            }
        } as Partial<Request>;

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        await registerUser(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(409);
        expect(response.json).toHaveBeenCalledWith({status: 409, message: "Cet email est déjà utilisé!" });
    })
    test('Password under 8 characters returns 400', async()=>{
        const request = {
            body: {
                email: "martin.fretto@gmail.com",
                password: "2eTapai"
            }
        }  as Partial<Request>;

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;
        await registerUser(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(400);
    });
    test('Password without upper-case character returns 400', async()=>{
        const request = {
            body: {
                email: "martin.fretto@gmail.com",
                password: "azertyuiop"
            }
        }  as Partial<Request>;

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;
        await registerUser(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(400);
    });
    test('Password without number character returns 400', async()=>{
        const request = {
            body: {
                email: "martin.fretto@gmail.com",
                password: "AZertyuioP"
            }
        }  as Partial<Request>;

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;
        await registerUser(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(400);
    });
    test('Email format not valid returns 400', async()=>{
        const request = {
            body: {
                email: "bobby@gmcom",
                password: "2eTapqqai"
            }
        }  as Partial<Request>;

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;
        await registerUser(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(400);
    });
});
describe('testing registerUser from loginUser', () => {
    test('Wrong password returns 401 with message: Il y a une erreur dans vos identifiants', async()=>{
        const request = {
            body:  {
                email: "martin.fretto@gmail.com",
                password: "2eTapaovnezdjnj"
            }
        } as Partial<Request>;

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        await loginUser(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({ status: 401, message: "Il y a une erreur dans vos identifiants" });
    }); 
    test('Correct email and password returns 201 with a token', async()=>{
        const request = {
            body:  {
                email: "martin.fretto@gmail.com",
                password: "1Azertyuiop"
            }
        } as Partial<Request>;

        const jsonMock = jest.fn()

        const response = {
            status: jest.fn().mockReturnValue({ json: jsonMock }),
        } as Partial<Response>;


        await loginUser(request as Request, response as Response);

        const responseData = jsonMock.mock.calls[0][0] as { token: string }

        expect(responseData.token).toBeDefined()
        expect(typeof responseData.token).toBe('string')

    });  
})

const tokenPayload: TokenPayloadType ={
    id: 2,
    email: "bobby@gmail.com"
}
const mockTocken = generateToken(tokenPayload);

describe('testing createBudget from budgetController', () => {
    test('Valid data returns 201', async()=>{
        const request = {
            body:  {
                name: "voyages",
                warning_amount: 600,
                allocated_amount: 700,
                color: "#ffffff",
                icon:"/src/assets/icons/aquarium-dolphin-fish-svgrepo-com.svg"
            },
            token: mockTocken
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

    test('Warning_amount over allocated_amount data returns 201 with message Le montant d\'alerte  doit être inférieur au montant alloué .', async()=>{
        const request = {
            body:  {
                name: "voyages",
                warning_amount: 700,
                allocated_amount: 700,
                color: "#ffffff",
                icon:"/src/assets/icons/aquarium-dolphin-fish-svgrepo-com.svg"
            },
            token: mockTocken 
        } as Partial<Request>;
          
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        await createBudget(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({message: "Le montant d'alerte  doit être inférieur au montant alloué ."});

    });
    test('Empty string for name returns 400', async()=>{
        const request = {
            body:  {
                name: "",
                warning_amount: 600,
                allocated_amount: 700,
                color: "#ffffff",
                icon:"/src/assets/icons/aquarium-dolphin-fish-svgrepo-com.svg"
            },
            token: mockTocken 
        } as Partial<Request>;
          
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        await createBudget(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(400);
    });
    test('Negative number for amount returns 400', async()=>{
        const request = {
            body:  {
                name: "",
                warning_amount: -600,
                allocated_amount: 700,
                color: "#ffffff",
                icon:"/src/assets/icons/aquarium-dolphin-fish-svgrepo-com.svg"
            },
            token: mockTocken 
        } as Partial<Request>;
          
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        await createBudget(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(400);
    });
    test('Decimal number with "." is valid and returns 201', async()=>{
        const request = {
            body:  {
                name: "voyages",
                warning_amount: 600.5,
                allocated_amount: 700,
                color: "#ffffff",
                icon:"/src/assets/icons/aquarium-dolphin-fish-svgrepo-com.svg"
            },
            token: mockTocken 
        } as Partial<Request>;
          
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        await createBudget(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(201);
    });
    test('empty string for color and icon is valid and returns 201', async()=>{
        const request = {
            body:  {
                name: "voyages",
                warning_amount: 600,
                allocated_amount: 700,
                color: "",
                icon: ""
            },
            token: mockTocken 
        } as Partial<Request>;
          
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        await createBudget(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(201);
    });
});

const tokenPayload2: TokenPayloadType ={
    id: 3,
    email: "johnny@gmail.com"
}
const mockTocken2 = generateToken(tokenPayload2);

describe('testing createExpenditure from expenditureController', () => {
    test('Valid data returns 201 with message Dépense créée', async()=>{

        const request = {
            body:  {
                budget_id: "6",
                description: "billet TGV",
                date: "2012-12-12T00:00:00.000Z",
                payment_method: "card",
                amount: 150
            },
            token: mockTocken2
            //C'est le middleware d'authentification qui rajoute le token venant du front dans une clé "token"
            //Il transmet ensuite cette requête au controller
        } as Partial<Request>;
          
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        await createExpenditure(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.json).toHaveBeenCalledWith({ status: 201, message: "Dépense créée"});
    });
    test('Empty string for description returns 201 with message Dépense créée', async()=>{

        const request = {
            body:  {
                budget_id: "6",
                description: "",
                date: "2012-12-12T00:00:00.000Z",
                payment_method: "card",
                amount: 20
            },
            token: mockTocken2
            //C'est le middleware d'authentification qui rajoute le token venant du front dans une clé "token"
            //Il transmet ensuite cette requête au controller
        } as Partial<Request>;
          
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        await createExpenditure(request as Request, response as Response);
        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.json).toHaveBeenCalledWith({ status: 201, message: "Dépense créée"});
    });
});


