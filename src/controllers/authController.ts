import { Request, Response } from "express";
import { UserDatamapper } from "../datamappers/UserDatamapper";
import { UserObject } from "../types/ModelTypes";
import { TokenPayloadType } from "../types/TokenPayloadType";
import { generateToken } from "../libs/jwtToken";
import { registerSchema } from "../libs/validationSchemas";
import {hash, verify} from "../libs/crypto";
import crypto from "crypto";
import nodemailer from "nodemailer";

const tokenStore = new Map<string, { email: string, expires: number }>();


export async function registerUser(req: Request, res: Response) {
    //Récupération des données du formulaire
    const { email, password, first_name, last_name } = req.body;

    const {error} = registerSchema.validate({email,password, first_name, last_name});
    if (error) {
        res.status(400).json({
            status: 400,
            message: error.details.map((detail)=>detail.message).join(' ')
        });         
        return;
    }

    const sameEmailUser = await UserDatamapper.findByEmail(email);
    if (sameEmailUser){
        res.status(409).json({status: 409, message: "Cet email est déjà utilisé!" }); 
        return;
    }

    const hashedPassword: string = await hash(password);
    if(hashedPassword==="error"){
        res.status(500).json({status:500, message: "Une erreur est survenue lors du hashage votre mot de passe!" });
        return; 
    }

    const userData: UserObject = {
        email: email,
        password: hashedPassword,
        first_name: first_name? first_name: null,
        last_name: last_name? last_name: null,
        total_budget: 0,  
        total_expenses: 0
    } 

    const newUser = await UserDatamapper.create(userData);
    if(newUser){
        res.status(201).json({ status: 201, message: "Utilisateur créé"});
    } else {
        res.status(500).json({status:500, message: "Une erreur est survenue lors de la création de l'utilisateur" });
    }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    //On va vérifier qu'un utilisateur avec cet email existe
    const user = await UserDatamapper.findByEmail(email);
    if (! user) {
        //Ici l'email n'existe pas dans la BDD. Pour des raisons de sécurité, on ne le précisera pas dans la réponse
        res.status(401).json({ status: 401, message: "Il y a une erreur dans vos identifiants" }); 
        return;
    }

    //On compare le password saisi avec celui en BDD 
    //Si le password est bon, la fonction verify renvoie true, s'il est faux, elle renvoie false. 
    //En cas d'erreur, elle revoie la chaine de caractère "error"
    const correctPassword = await verify(user!.password, password);
    if (typeof correctPassword === "boolean") {
        if(!correctPassword){
            res.status(401).json({ status: 401, message: "Il y a une erreur dans vos identifiants" }); 
            return;
        }
    } else {
        res.status(500).json({ status: 500, message: "Une erreur est survenue lors de la vérification du mot de passe" });
        return; 
    }

    //Arrivé ici, le mail et le password sont corrects, on passe à la génération du token jwt
    const tokenPayload: TokenPayloadType ={
        id: user.id,
        email: user.email
    }
    const jwtToken = generateToken(tokenPayload);


    //NEW!!!!!!
    res.cookie('token', jwtToken, {
      httpOnly: true,    // Protégé contre XSS
      secure: false,     // true en production (HTTPS)
      sameSite: 'strict',// Protégé contre CSRF
      maxAge: 3600000,   // 1 heure
    });
  
  //  res.status(201).json({ status: 201, message: "token généré", token: jwtToken});
    res.status(201).json({ status: 201, message: "token généré"});
    return;
}

export async function resetPasswordEmail(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
  
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 3600000; // 1h


     tokenStore.set(token, { email, expires });
  
    const resetUrl = `http://localhost:5173/auth/newPassword?token=${token}`; // Adapté à ton front

    // Envoie l'email
    const transporter = nodemailer.createTransport({
        service: "Gmail", 
        auth: {
        user: "martin.fretto@gmail.com",
        pass: "ldzk lgnm izjt avli"
        }
    });

    const mailOptions = {
        from: '"La Pince (ne pas répondre)" <martin.fretto@gmail.com>',
        to: email,
        subject: "Réinitialisation du mot de passe La Pince",
        html: `<p>Cliquer ici pour réinitialiser votre mot de passe :</p>
            <a href="${resetUrl}">${resetUrl}</a>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Erreur lors de l'envoi de l'email" });
    }
}

export async function setNewPassword(req: Request, res: Response): Promise<void> {
    const { password, token } = req.body;

    if (!token || typeof token !== 'string') {
        res.status(400).json({ message: "Token manquant ou invalide" });
        return;
    }
    const record = tokenStore.get(token);

    if (!record || record.expires < Date.now()) {
        res.status(400).json({ message: "Token invalide ou expiré" });
        return;
    }

    const email = record.email;

    const {error} = registerSchema.validate({email,password});
    if (error) {
        res.status(400).json({
            status: 400,
            message: error.details.map((detail)=>detail.message).join(' ')
        });         
        return;
    }

    const hashedPassword: string = await hash(password);
    if(hashedPassword==="error"){
        res.status(500).json({status:500, message: "Une erreur est survenue lors du hashage votre mot de passe!" });
        return; 
    }

    const updateData: Partial<UserObject> = {
        email: email,
        password: hashedPassword,
    };

    const updatedUser = await UserDatamapper.updateByEmail(updateData);

    if(updatedUser){
        res.status(201).json({ status: 201});
    } else {
        res.status(500).json({status:500, message: "Une erreur est survenue lors de la création de l'utilisateur" });
    }
}
