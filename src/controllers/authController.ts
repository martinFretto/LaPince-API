import { Request, Response } from "express";
import { User } from "../models/User";
import { UserObject } from "../types/ModelTypes";
import Joi from "joi";


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
export async function registerUser(req: Request, res: Response) {

    console.log("register?")
    
    const { email, password, first_name, last_name } = req.body;

    if(!email || !password){
        res.status(400).json({message: "Les champs email et password sont obligatoire!" }); 
    }

    /* VALIDATION JOI */
    const {error} = registerSchema.validate({email,password, first_name, last_name});
    if (error) {
        res.status(400).json({
            message: "Validation échouée !",
            détails: error.details.map((detail)=>detail.message)
        });
    }
    console.log("email, password, first_name, last_name : ", email, password, first_name, last_name);
   
// Verification si un utilisateur avec cet email existe déjà
    const sameEmailUser = await User.findByEmail(email);
    console.log(sameEmailUser);

    if (sameEmailUser){
        res.status(409).json({ message: "Cet email est déjà utilisé!" }); 
    }
    const userData: UserObject = {
        email: email,
        password: password,
        first_name: first_name? first_name: null,
        last_name: last_name? last_name: null,
        total_budget: 0,  
        total_expenses: 0
    } 

    await User.create(userData)


    res.status(201).json({ status: 201, message: "User created" });
}

export async function loginUser(req: Request, res: Response) {
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

}

