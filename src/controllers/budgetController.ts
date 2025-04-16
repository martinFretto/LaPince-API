import { Request, Response } from "express";
import { Budget } from "../models/Budget";
import { BudgetObject } from "../types/ModelTypes";
import jwt from "jsonwebtoken";


interface AuthenticatedRequest extends Request {
    token?: string;
  }


async function getAllBudgets(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        // On récupère l'Id depuis les paramètre de la requete puis on l'affiche dans les logs
        const { userId } = req.params;
        console.log("USERID:", userId);

        // Decodage du token avec une clé secrète
        const decoded = jwt.verify

        ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiYm9iYnlAb2Nsb2NrLmlvIiwiaWQiOjJ9LCJpYXQiOjE3NDQ3MTc2OTMsImV4cCI6MTc0NDcxODg5M30.tk0pA6wwWRqe5Ax6DL0RXA3eXwJ7-zXoybeU289aEo4",
            process.env.JWT_SECRET as jwt.Secret) as jwt.JwtPayload;

            //Extraire l'id utilisateur du token décodé puis l'affiché dans les logs
        const user_id = decoded.user.id;
        console.log("user_id???: ", user_id)
        const token=""

        //On convertit l'id utilisateur en type number puis on verifie avec les logs
        const user_id_for_db= parseInt(user_id);

        console.log("user_id_for_db: ", user_id_for_db, "  type: ", typeof user_id_for_db)
        

        // Requête pour obtenir tous les budgets liés à cet utilisateur
        const budgets = await Budget.prototype.findByUserId(parseInt(userId));
        res.status(200).json({ status: 200, data: budgets });
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
        console.log("ID:",id);
        //Requete pour rechercher un budget selon son id
        const budget = await Budget.prototype.findById(parseInt(id));

        if (!budget) {
            // Si aucun budget n'est trouvé retourné une reponse avec un message.
            res.status(404).json({ status: 404, message: "Budget introuvable." });
        }
        // Retourne le budget trouvé
        res.status(200).json({ status: 200, data: budget });
    } catch (error) {
        //Capture les erreurs
        console.error("Erreur dans getBudgetById :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
}

async function createBudget(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { name, warning_amount, spent_amount, allocated_amount, color, icon, user_id } = req.body;

        // Validation de la présence des champs obligatoires
        if (!name || !allocated_amount || !user_id) {
            res.status(400).json({
                status: 400,
                message: "Les champs name, allocated_amount, et user_id sont obligatoires.",
            });
            //Arrete l'execution si les champs obligatoire sont absent
            return;
        }
        // Crée un objet de Budget avec donnée 
        const newBudget: BudgetObject = {
            name,
            warning_amount: parseFloat(warning_amount) || 0,
            spent_amount: parseFloat(spent_amount) || 0,
            allocated_amount: parseFloat(allocated_amount),
            color: color || null,
            icon: icon || null,
            user_id: parseInt(user_id),
        };
        //Inserer le budget dans la base de donnée
        const createdBudget = await Budget.prototype.create(newBudget);
        res.status(201).json({ status: 201, message: "Budget créé avec succès.", data: createdBudget });
    } catch (error) {
        // Capture les erreurs
        console.error("Erreur dans createBudget :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
}

async function updateBudget(req: Request, res: Response): Promise<void> {
    try {
        //Recupere l'id et les données à mettre a jour
        const { id } = req.params;
        const { name, warning_amount, spent_amount, allocated_amount, color, icon } = req.body;

        //Valide qu'au moins un champs est fourni pour la mise a jour
        if (!name && !warning_amount && !spent_amount && !allocated_amount && !color && !icon) {
            res.status(400).json({
                status: 400,
                message: "Veuillez fournir au moins un champ à mettre à jour.",
            });
            return;
        }
        // Crée un objet partiel avec les donnée a mettre a jour
        const updates: Partial<BudgetObject> = {
            name,
            warning_amount: warning_amount ? parseFloat(warning_amount) : undefined,
            spent_amount: spent_amount ? parseFloat(spent_amount) : undefined,
            allocated_amount: allocated_amount ? parseFloat(allocated_amount) : undefined,
            color,
            icon,
        };
        //Utilise le modèle pour effectuer la mise a jour dans la BDD
        const updatedBudget = await Budget.prototype.update(parseInt(id), updates);

        if (!updatedBudget) {
            res.status(404).json({ status: 404, message: "Budget introuvable." });
        }
    
        //retourne le budget mis a jour
        res.status(200).json({ status: 200, message: "Budget mis à jour avec succès.", data: updatedBudget });
    } catch (error) {
        console.error("Erreur dans updateBudget :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
    return;
}

async function deleteBudget(req: Request, res: Response): Promise<void> {
    try {
        // On recupere l'd du buget a supprimer
        const { id } = req.params;
        // On verifie que le budget a supprimer existe bien avent de le supprimer

        // Supprime le budget de la BDD
        const deleted = await Budget.prototype.delete(parseInt(id));

        if (!deleted) {
            res.status(404).json({ status: 404, message: "Budget introuvable." });
        }
        //Retourne une confirmation 
        res.status(200).json({ status: 200, message: "Budget supprimé avec succès." });
    } catch (error) {
        // Capture des erreurs
        console.error("Erreur dans deleteBudget :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
    return;
}

export { getAllBudgets, getBudgetById, createBudget, updateBudget, deleteBudget };
