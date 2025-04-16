import { Request, Response } from "express";
import { Budget } from "../models/Budget";
import { BudgetObject } from "../types/ModelTypes";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { getUserIdInToken } from "../libs/jwtToken";


interface AuthenticatedRequest extends Request {
    token?: string;
  }

  // Schéma de validation Joi pour les budgets
const budgetSchema = Joi.object({
    name: Joi.string().max(255).required(),
    warning_amount: Joi.number().min(0).required(),
    spent_amount: Joi.number().min(0).optional(),
    allocated_amount: Joi.number().min(0).required(),
    color: Joi.string().max(255).optional(),
    icon: Joi.string().max(255).optional(),
});

async function getAllBudgets(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        
       //On récupère l'id de l'utilisateur dans le token
        const user_id_for_db = getUserIdInToken(req);
        

       

        // Requête pour obtenir tous les budgets liés à cet utilisateur
        const budgets = await BudgetDatamapper.findByUserId(user_id_for_db);
        if (budgets?.length) {
            res.status(200).json({ status: 200, data: budgets });
        } else {
            res.status(404).json({ status: 404, message: "Aucun budget trouvé pour cet utilisateur." });
        }
    } catch (error) {
        //Capture des erreurs
        console.error("Erreur dans getAllBudgets :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
}

async function getBudgetById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        // On récupère l'id depuis les paramètre de la requete puis on l'affiche dans les logs
        const { id } = req.params;
        const user_id_for_db = getUserIdInToken(req)

        console.log("ID:",id, "Token:", user_id_for_db);
        //Requete pour rechercher un budget selon son id

        const budget = await BudgetDatamapper.findById(id, user_id_for_db);

            //Si le budget existe il le retourne sinon on retourne un message d'erreur
        if (budget) {
            res.status(200).json({ status: 200, data: budget });
        } else {
            res.status(404).json({ status: 404, message: "Ce budget est introuvable." });
        }
    } catch (error) {
        //Capture les erreurs
        console.error("Erreur dans getBudgetById :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
}

async function createBudget(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const user_id_for_db = getUserIdInToken(req);
        const { name, warning_amount, spent_amount, allocated_amount, color, icon, user_id } = req.body;

        // Valider les données avec Joi
        const { error } = budgetSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                message: "Validation échouée !",
                details: error.details.map((detail) => detail.message),
            });
            return;
        }
        // Crée un objet de Budget avec donnée 
        const newBudget: BudgetObject = {
            name,
            warning_amount: Number(warning_amount) || 0,
            spent_amount: Number(spent_amount) || 0,
            allocated_amount: Number(allocated_amount),
            color: color || null,
            icon: icon || null,
            user_id: Number(user_id),
        };
        //Inserer le budget dans la base de donnée
        const createdBudget = await BudgetDatamapper.create(newBudget);
        if (createdBudget) {
            res.status(201).json({ status: 201, message: "Budget créé avec succès.", data: createdBudget });
        } else {
            res.status(500).json({ status: 500, message: "Une erreur est survenue lors de la création du budget." });
        }
    } catch (error) {
        // Capture les erreurs
        console.error("Erreur dans createBudget :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
}

async function updateBudget(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        //Recupere l'id et les données à mettre a jour

        const { id } = req.params;
        const user_id_for_db = getUserIdInToken(req);

        const budget = await BudgetDatamapper.findById(id, user_id_for_db);

        if (!budget) {
            res.status(404).json({ status: 404, message: "Ce budget est introuvable." });
            return;
        }

        const { name, warning_amount, spent_amount, allocated_amount, color, icon } = req.body;

        // Crée un objet partiel avec les donnée a mettre a jour
        const updates: Partial<BudgetObject> = {
            name,
            warning_amount: warning_amount ? Number(warning_amount) : undefined,
            spent_amount: spent_amount ? Number(spent_amount) : undefined,
            allocated_amount: allocated_amount ? Number(allocated_amount) : undefined,
            color,
            icon,
        };

       // Valider les données avec Joi
       const { error } = budgetSchema.validate(updates, { allowUnknown: true });
       if (error) {
           res.status(400).json({
               message: "Validation échouée !",
               details: error.details.map((detail) => detail.message),
           });
           return;
       }
    
        
        //Utilise le modèle pour effectuer la mise a jour dans la BDD
        const updatedBudget = await BudgetDatamapper.update(id, updates);

        if (updatedBudget) {
            res.status(200).json({ status: 200, message: "Budget mis à jour avec succès.", data: updatedBudget });
        } else {
            res.status(500).json({ status: 500, message: "Une erreur est survenue lors de la modification du budget." });
        }    
    } catch (error) {
        console.error("Erreur dans updateBudget :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
    return;
}

async function deleteBudget(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        // On recupere l'd du buget a supprimer
        const { id } = req.params;
        const user_id_for_db = getUserIdInToken(req);
        // On verifie que le budget a supprimer existe bien avent de le supprimer

        const budget = await BudgetDatamapper.findById(id, user_id_for_db);

        if (budget) {
            await BudgetDatamapper.delete(id);
            res.status(204).json({ status: 204, message: "Budget supprimé avec succès." });
        } else {
            res.status(404).json({ status: 404, message: "Le budget que vous souhaitez supprimer n'existe pas." });
        }
    } catch (error) {
        console.error("Erreur dans deleteBudget :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
}

export { getAllBudgets, getBudgetById, createBudget, updateBudget, deleteBudget };
