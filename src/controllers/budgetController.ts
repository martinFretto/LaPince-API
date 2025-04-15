import { Request,Response } from "express";
import { BudgetModel, BudgetObject } from "../models/Budget";
import jwt from "jsonwebtoken"

const SECRET_KEY = "process.env.JWT8SECRET"

async function getAllBudgets(req: Request, res: Response): Promise<void> {
    try {
        // Récupérer le token depuis les headers
        const authHeader = req.headers.authorization;
        if (!authHeader) {
             res.status(401).json({ status: 401, message: "Token manquant. Accès refusé." });
        }

        const token = authHeader.split(" ")[1]; // Format attendu : "Bearer <token>"
        if (!token) {
             res.status(401).json({ status: 401, message: "Format du token incorrect." });
        }

        // Décoder le token
        let decodedToken: any;
        try {
            decodedToken = jwt.verify(token, SECRET_KEY); // Vérifie et décode le token
        } catch (error) {
            res.status(403).json({ status: 403, message: "Token invalide. Accès refusé." });
        }

        // Récupérer l'identifiant utilisateur depuis le payload du token
        const userId = decodedToken.user_id;
        if (!userId) {
            res.status(400).json({ status: 400, message: "Aucun user_id trouvé dans le token." });
        }

        // Rechercher tous les budgets de l'utilisateur
        const budgets = await BudgetModel.findByUserId(userId);
        res.status(200).json({ status: 200, data: budgets });
    } catch (error) {
        console.error("Erreur dans getAllBudgets :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
}
async function getBudgetById(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;       
        const budget = await BudgetModel.findById(parseInt(id));

        if (!budget) {
            res.status(404).json({ status: 404, message: "Budget introuvable." });
        }

        res.status(200).json({ status: 200, data: budget });
    } catch (error) {
        console.error("Erreur dans getBudgetById :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
}

async function createBudget(req: Request, res: Response): Promise<void> {
    try {
        const { name, warning_amount, spent_amount, allocated_amount, color, icon, user_id } = req.body;

        // Validation des champs obligatoires
        if (!name || !allocated_amount || !user_id) {
            res.status(400).json({
                status: 400,
                message: "Les champs name, allocated_amount, et user_id sont obligatoires.",
            });
            return;
        }

        const newBudget: BudgetObject = {
            name,
            warning_amount: parseFloat(warning_amount) || 0,
            spent_amount: parseFloat(spent_amount) || 0,
            allocated_amount: parseFloat(allocated_amount),
            color: color || "default",
            icon: icon || "default",
            user_id: parseInt(user_id),
        };

        const createdBudget = await BudgetModel.create(newBudget);
        res.status(201).json({ status: 201, message: "Budget créé avec succès.", data: createdBudget });
    } catch (error) {
        console.error("Erreur dans createBudget :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
}


async function updateBudget(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { name, warning_amount, spent_amount, allocated_amount, color, icon } = req.body;

        if (!name && !warning_amount && !spent_amount && !allocated_amount && !color && !icon) {
            res.status(400).json({
                status: 400,
                message: "Veuillez fournir au moins un champ à mettre à jour.",
            });
            return;
        }

        const updates: Partial<BudgetObject> = {
            name,
            warning_amount: warning_amount ? parseFloat(warning_amount) : undefined,
            spent_amount: spent_amount ? parseFloat(spent_amount) : undefined,
            allocated_amount: allocated_amount ? parseFloat(allocated_amount) : undefined,
            color,
            icon,
        };

        const updatedBudget = await BudgetModel.update(parseInt(id), updates);

        if (!updatedBudget) {
            res.status(404).json({ status: 404, message: "Budget introuvable." });
        }
        

        res.status(200).json({ status: 200, message: "Budget mis à jour avec succès.", data: updatedBudget });
    } catch (error) {
        console.error("Erreur dans updateBudget :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
    return;
}


async function deleteBudget(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        // Suppression d'un budget par son ID
        const deleted = await BudgetModel.delete(parseInt(id));

        if (!deleted) {
            return res.status(404).json({ status: 404, message: "Budget introuvable." });
        }

        res.status(200).json({ status: 200, message: "Budget supprimé avec succès." });
    } catch (error) {
        console.error("Erreur dans deleteBudget :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
}

export {getAllBudgets, getBudgetById, createBudget, updateBudget,deleteBudget}