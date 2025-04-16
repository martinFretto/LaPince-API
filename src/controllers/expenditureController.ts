import { Request, Response } from "express";
import { ExpenditureObject } from "../types/ModelTypes";
import { expenditureDatamapper } from "../datamappers/expenditureDatamapper";
import Joi from 'joi';
import jwt from 'jsonwebtoken';


export async function getExpendituresByBudget(req: Request, res: Response): Promise<void> {
    //le budget_id se trouve dans le endpoint (route paramétrée) "/budgets/:budget_id/expenses"
    const { budget_id } = req.params;

    //on convertit ce qui doit être convertit 
    //Ce qui vient du token est de la route est au format string, on veut des number 
    const budget_id_for_db = Number(budget_id)
    const expenditures = await expenditureDatamapper.findByBudget(budget_id_for_db);

    if(expenditures?.length){
        res.status(201).json({ status: 200, data: expenditures});
        return;
    } else {
        res.status(404).json({status: 404, message: "Aucune dépense pour ce budget" });
        return;
    }
}

export async function getOneExpenditure(req: Request, res: Response): Promise<void> {
     //le budget_id se trouve dans le endpoint (route paramétrée) "/budgets/:budget_id/expenses"
    const { expenditure_id } = req.params;
    console.log("expenditure_id", expenditure_id)

    //on convertit ce qui doit être convertit 
    //Ce qui vient du token est de la route est au format string, on veut des number 
    const expenditure_id_for_db = Number(expenditure_id)
    const expenditure = await expenditureDatamapper.findById(expenditure_id_for_db);
    console.log("expenditure?: ", expenditure)
    if(expenditure){
        res.status(201).json({ status: 200, data: expenditure});
        return;
    } else {
        res.status(404).json({status: 404, message: "Cette dépense est introuvable" });
        return;
    }
}

export async function createExpenditure(req: Request, res: Response): Promise<void> {
    
    //On récupère l'id de l'utilisateur dans le token (dans un MIDDLEWARE IDEALEMENT?)
    const decoded = jwt.verify
    ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiYm9iQG9jbG9jay5pbyIsImlkIjoyfSwiaWF0IjoxNzQ0Nzg4ODk5LCJleHAiOjE3NDQ3OTAwOTl9.h2frKX8KRA9HQD6WpoRBihliqO8CV1PuP9FxQ7rNRHA",
        process.env.JWT_SECRET as jwt.Secret) as jwt.JwtPayload;
    const user_id = decoded.user.id;


    //le budget_id se trouve dans le endpoint (route paramétrée) "/budgets/:budget_id/expenses"
    const { budget_id } = req.params;
    //le reste est dans le body
    const { description, payment_method, amount, date} = req.body;
    const amount_for_db = Number(amount)
    
    let date_for_db: Date | null;
    if(date){
        date_for_db= new Date(date);
    } else{
        date_for_db=null; 
    }

    //on convertit ce qui doit être convertit 
    //Ce qui vient du token est de la route est au format string, on veut des number 
    const budget_id_for_db = Number(budget_id)
    const user_id_for_db= Number(user_id);

    //Création d'un schéma pour le montant (on veut un nombre positif à maximum deux chiffres après la virgule)
    //En principe, la conversion du montant avec Number() a déjà réduit le nombre de chiffre après la virgule à 2
    //Le reste des champs (description, payment_method, date) n'est pas required et la date est séléctionnée via un calendrier
    const amountSchema = Joi.number()
    .positive()
    .precision(2)  // maximum 2 chiffres après la virgule
    .custom((value, helpers) => {
      // Vérifie qu'il n'y a pas plus de deux décimales
      if (!Number.isInteger(value * 100)) {
        return helpers.error('number.decimalPlaces');
      }
      return value;
    }, 'Decimal places validation')
    .messages({
      'number.base': 'Le champ doit être un nombre.',
      'number.positive': 'Le nombre doit être positif.',
      'number.decimalPlaces': 'Le nombre ne peut avoir que deux chiffres après la virgule au maximum.'
    });
    
    console.log("amount_for_db: ", amount_for_db)
    //Vérification de la validité du montant, réponse 400 avec un message personnalisé en cas d'échec
    const {error} = amountSchema.validate(amount_for_db);
    if (error) {
        res.status(400).json({
            message: "Validation échouée !",
            details: error.details.map((detail)=>detail.message)
        });
        return;
    }
      

    const expenditureData: ExpenditureObject = {
        description: description? description: null,
        payment_method: payment_method? payment_method:null ,
        amount: amount_for_db,
        date: date_for_db,
        budget_id: budget_id_for_db,
        user_id: user_id_for_db
    }   


    const newExpenditure = await expenditureDatamapper.create(expenditureData);

    if(newExpenditure){
        res.status(201).json({ status: 201, message: "Dépense créée"});
    return;
    } else {
        res.status(500).json({status:500, message: "Une erreur est survenue lors de l'enregistrement' de la dépense" });
        return;
    }
}

export async function deleteExpenditure(req: Request, res: Response): Promise<void> {
     
    const { expenditure_id } = req.params;
    const expenditure_id_for_db = Number(expenditure_id)

    const expenditure = await expenditureDatamapper.findById(expenditure_id_for_db);

    if(expenditure){
        await expenditureDatamapper.destroy(expenditure);
        res.status(204).json({ status: 204, message: "Dépense supprimée"});
        return;
    } else{
        res.status(404).json({ status: 404, message: "Le dépense que vous voulez supprimer n'existe pas!"});
        return;
    }  
}

export async function updateExpenditure(req: Request, res: Response): Promise<void> {


    const { expenditure_id } = req.params;
     
    const expenditure_id_for_db = Number(expenditure_id)
    const expenditure = await expenditureDatamapper.findById(expenditure_id_for_db);


    const { description, payment_method, amount, date} = req.body;
    const amount_for_db = Number(amount)

    let date_for_db: Date | null;
    if(date){
        date_for_db= new Date(date);
    } else{
        date_for_db=null; 
    }  
    
    if(expenditure){
        const expenditureData: ExpenditureObject = {
            id: expenditure.id,
            description: description? description: null,
            payment_method: payment_method? payment_method:null,
            amount: amount_for_db,
            date: date_for_db,
            budget_id: expenditure.budget_id,
            user_id: expenditure.user_id
        } 

        const updatedExpenditure = await expenditureDatamapper.update(expenditureData);
        res.status(201).json({ status: 200, message: "dépense modifiée", data: updatedExpenditure});
        return;
    } else {
        res.status(404).json({status: 404, message: "Cette dépense est introuvable" });
         return;
    }    
}

