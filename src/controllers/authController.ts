import { Request, Response } from "express";
import { User } from "../models/User";
import { UserObject } from "../types/ModelTypes";
import Joi from "joi";
import argon2 from "argon2"
import { generateToken } from "../libs/jwtToken";
import { TokenPayloadType } from "../types/TokenPayloadType";



export async function registerUser(req: Request, res: Response) {

    const { email, password, first_name, last_name } = req.body;

    // Schema de validation pour registerUser
    const registerSchema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email":"Le format de l'email est invalide.",
                "any.required":"Le champ email est obligatoire."
            
        }),
        password: Joi.string()
            .pattern(/^(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/)
            .required()
            .messages({
                "string.pattern.base": "Le mot de passe doit contenir au moins 8 caractères, dont 1 chiffre et 1 majuscule.",
                "any.required": "Le champ password est obligatoire."
            }),
            first_name: Joi.string()
                .optional(),
            last_name: Joi.string()
                .optional()
    });
    /* VALIDATION JOI */
    const {error} = registerSchema.validate({email,password, first_name, last_name});
    if (error) {
        res.status(400).json({
            message: "Validation échouée !",
            details: error.details.map((detail)=>detail.message)
        });
        return;
    }
    console.log("email, password, first_name, last_name : ", email, password, first_name, last_name);
   
// Verification si un utilisateur avec cet email existe déjà
    const sameEmailUser = await User.findByEmail(email);
    console.log(sameEmailUser);

    if (sameEmailUser){
        res.status(409).json({status: 409, message: "Cet email est déjà utilisé!" }); 
        return;
    }
    console.log("Password: ", password)

    const hashedPassword: string = await argon2.hash(password);
    if(hashedPassword==="error"){
        res.status(500).json({status:500, message: "Une erreur est survenue lors du hashage votre mot de passe!" });
        return; 
    }

    console.log("hashedPassword: ", hashedPassword)

    const userData: UserObject = {
        email: email,
        password: hashedPassword,
        first_name: first_name? first_name: null,
        last_name: last_name? last_name: null,
        total_budget: 0,  
        total_expenses: 0
    } 

    await User.create(userData);


    res.status(201).json({ status: 201, message: "Utilisateur créé",  });
    return;
}

export async function loginUser(req: Request, res: Response): Promise<void> {
    //console.log("login?")

    const { email, password } = req.body;


    // Validation des données avec Joi
    const loginSchema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Le format de l'email est invalide.",
            "any.required": "Le champ email est obligatoire."
        }),
        password: Joi.string().required().messages({
            "any.required": "Le champ password est obligatoire."
        })
    });

    const { error } = loginSchema.validate({ email, password });
        if (error) {
            res.status(400).json({
                message: "Validation échouée !",
                details: error.details.map((detail) => detail.message)
            });
        }

        console.log("email, password : ", email, password);
        const user = await User.findByEmail(email);
     
        if (! user) { 
            console.log("Cet utilisateur n'existe pas")
            res.status(401).json({ status: 401, message: "Il y a une erreur dans vos identifiants" }); 
            return;
        }
        console.log("correct??")
        const correctPassword = await argon2.verify(user!.password, password);
        console.log("correct password??")
        if (typeof correctPassword === "boolean") {
            if(!correctPassword){
                res.status(401).json({ status: 401, message: "Il y a une erreur dans vos identifiants" }); 
                return;
            }
        } else {
            res.status(500).json({ status: 500, message: "Une erreur est survenue lors de la vérification du mot de passe" });
            return; 
        }
    
        console.log("Mot de pass correcte, génération du jwt");
    
        // Create authentication tokens
   
        const tokenPayload: TokenPayloadType ={
            id: user.id,
            email: user.email
        }
        const jwtToken = generateToken(tokenPayload);

        console.log("jwttoken: ", jwtToken);
      
        res.status(201).json({ status: 201, message: "token généré", token: jwtToken});
        return;

}
