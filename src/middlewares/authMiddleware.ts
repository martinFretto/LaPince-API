import { NextFunction, Response } from "express";
import { verifyJwtToken } from "../libs/jwtToken";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";


export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log("middleware d'authentification")
  
    const token = req.headers?.["authorization"]?.split("Bearer ")[1];
    console.log("token: ", token);
    if (!token) {  
      res.status(401).json({ status: 401, message: "Cette route n'est pas accessible sans token" }); 
      return;
    }
   
    //Vérification du token
    const decodedToken = verifyJwtToken(token);
    if (! decodedToken) { 
      res.status(401).json({ status: 401, message: "Le token n'est pas valide" }); 
      return;
    }
    
    console.log('Requete acceptée (JWT TOKEN)')
  
    req.token = token;
    
    next();
}