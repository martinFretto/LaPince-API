import { Request, Response } from "express";
import { User } from "../models/User";
import { UserObject } from "../types/ModelTypes";
import { hash, verify } from "../libs/crypto";


export async function registerUser(req: Request, res: Response): Promise<void> {

    const { email, password, first_name, last_name } = req.body;

    if(!email || !password){
        res.status(400).json({status:400, message: "Les champs email et password sont obligatoire!" }); 
        return;
    }

    const sameEmailUser = await User.findByEmail(email);
    console.log(sameEmailUser);

    if (sameEmailUser){
        res.status(409).json({status: 409, message: "Cet email est déjà utilisé!" }); 
    }
    console.log("Password: ", password)

    const hashedPassword: string = await hash(password);
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

    const user = await User.findByEmail(email);
     
    if (! user) { 
        console.log("Cet utilisateur n'existe pas")
        res.status(401).json({ status: 401, message: "Il y a une erreur dans vos identifiants" }); 
        return;
    }

    const correctPassword = await verify(user!.password, password);
    if (correctPassword=="error") { 
        res.status(500).json({ status: 500, message: "Une erreur est survenue lors de la vérification du mot de passe" });
        return; 
    } else if(!correctPassword){
        res.status(401).json({ status: 401, message: "Il y a une erreur dans vos identifiants" }); 
        return;
    }

    console.log("Mot de pass correcte, génération du jwt");



}