import { Request, Response } from "express";
import { ExpenditureObject } from "../types/ModelTypes";
import { ExpenditureDatamapper } from "../datamappers/ExpenditureDatamapper";
import { getUserIdInToken } from "../libs/jwtToken";
import { amountSchema } from "../libs/validationSchemas";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";


export async function getAllExpenditures(req: AuthenticatedRequest, res: Response): Promise<void> {
    
    const { budgetId } = req.query;

    const user_id_for_db = getUserIdInToken(req);
    let expenditures; 

    if(budgetId){
        const budget_id_for_db = Number(budgetId)
        expenditures = await ExpenditureDatamapper.findByBudget(budget_id_for_db, user_id_for_db);
    } else{
        console.log("findwith icon and color")
        expenditures = await ExpenditureDatamapper.findAllWithIconAndColor(user_id_for_db);
    }

    console.log("resultat: ", expenditures);
 
    if(expenditures?.length){
         res.status(200).json({ status: 200, data: expenditures});
         return;
     } else {
         res.status(204).json({ status: 204, message: "Aucune dépense trouvé pour cet utilisateur." });
         return;
     }
}

export async function getOneExpenditure(req: AuthenticatedRequest, res: Response): Promise<void> {
     //le budget_id se trouve dans le endpoint (route paramétrée) "/expenses"
     const { expenditure_id} = req.params;
     //on convertit ce qui doit être convertit 
    //Ce qui vient du token est de la route est au format string, on veut des number 
     const expenditure_id_for_db = Number(expenditure_id)

    //On récupère l'id de l'utilisateur dans le token
    const user_id_for_db = getUserIdInToken(req);

    
    const expenditure = await ExpenditureDatamapper.findById(expenditure_id_for_db, user_id_for_db);

    if(expenditure){
        res.status(200).json({ status: 200, data: expenditure});
        return;
    } else {
        res.status(404).json({status: 404, message: "Cette dépense est introuvable" });
        return;
    }
}

export async function createExpenditure(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user_id_for_db = getUserIdInToken(req);

    const { budget_id, description, payment_method, amount, date} = req.body;

    const amount_for_db = 
    typeof amount === "string" 
    ? Number(amount.replace(',', '.')) 
    : amount;

    const budget_id_for_db = Number(budget_id);
    
    let date_for_db: Date | null;
    if(date){
        date_for_db= new Date(date);
    } else{
        date_for_db=null; 
    }
    
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

    const newExpenditure = await ExpenditureDatamapper.create(expenditureData);

    if(newExpenditure){
        res.status(201).json({ status: 201, message: "Dépense créée"});
    } else {
        res.status(500).json({status:500, message: "Une erreur est survenue lors de l'enregistrement' de la dépense" });
    }
}

export async function deleteExpenditure(req: AuthenticatedRequest, res: Response): Promise<void> {
     
    const { expenditure_id } = req.params;
     const expenditure_id_for_db = Number(expenditure_id)

    //On récupère l'id de l'utilisateur dans le token
    const user_id_for_db = getUserIdInToken(req);

    const expenditure = await ExpenditureDatamapper.findById(expenditure_id_for_db, user_id_for_db);

    if(expenditure){
        await ExpenditureDatamapper.destroy(expenditure);
        res.status(200).json({ status: 200, message: "Dépense supprimée"});
        return;
    } else{
        res.status(404).json({ status: 404, message: "Le dépense que vous voulez supprimer n'existe pas!"});
        return;
    }  
}

export async function updateExpenditure(req: AuthenticatedRequest, res: Response): Promise<void> {

    const { expenditure_id} = req.params;
    const expenditure_id_for_db = Number(expenditure_id)

    const user_id_for_db = getUserIdInToken(req);

    const expenditure = await ExpenditureDatamapper.findById(expenditure_id_for_db, user_id_for_db);

    const { description, payment_method, amount, date} = req.body;
    
    const amount_for_db = 
    typeof amount === "string" ? Number(amount.replace(',', '.')) : amount;

    const {error} = amountSchema.validate(amount_for_db);
    if (error) {
        res.status(400).json({
            message: "Validation échouée !",
            details: error.details.map((detail)=>detail.message)
        });
        return;
    }

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

        const updatedExpenditure = await ExpenditureDatamapper.update(expenditureData);
        res.status(201).json({ status: 200, message: "dépense modifiée", data: updatedExpenditure});
    } else {
        res.status(404).json({status: 404, message: "Cette dépense est introuvable" });
    }    
}
