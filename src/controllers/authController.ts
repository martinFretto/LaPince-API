import { Request, Response } from "express";
import { User } from "../models/User";
import { UserObject } from "../../types/ModelTypes";


export async function registerUser(req: Request, res: Response) {

    console.log("register?")
    
    const { email, password, first_name, last_name } = req.body;

    if(!email || !password){
        res.status(400).json({message: "Les champs email et password sont obligatoire!" }); 
    }

    /* VALIDATION JOI */



    /******* */

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

    //console.log("email, password : ", email, password)
}

