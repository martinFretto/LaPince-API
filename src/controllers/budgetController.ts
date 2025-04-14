import { Request,Response } from "express";
import { BudgetModel, BudgetObject } from "../models/Budget";

async function getAllBudgets(req: Request, res: Response): Promise<void> {
    try {     
        const userId = req.params.userId;
        const budgets = await BudgetModel.findByUserId(parseInt(userId));
        res.status(200).json({status: 200, data: budgets});
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
            return res.status(404).json({ status: 404, message: "Budget introuvable." });
        }

        res.status(200).json({ status: 200, data: budget });
    } catch (error) {
        console.error("Erreur dans getBudgetById :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
}

async function createBudget(req: Request, res: Response): Promise<void> {
    try {
        const { userId, category, limit } = req.body;
        
        if (!userId || !category || !limit) {
            return res.status(400).json({
                status: 400,
                message: "Les champs userId, category, et limit sont obligatoires.",
            });
        }

        const newBudget: BudgetObject = {
            userId: parseInt(userId),
            category,
            limit: parseFloat(limit),
        };

        // Création d'un budget
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
        const { category, limit } = req.body;

        
        if (!category && !limit) {
            return res.status(400).json({
                status: 400,
                message: "Veuillez fournir au moins un champ à mettre à jour.",
            });
        }

        // Mise à jour d'un budget existant
        const updatedBudget = await BudgetModel.update(parseInt(id), {
            category,
            limit: limit ? parseFloat(limit) : undefined,
        });

        if (!updatedBudget) {
            return res.status(404).json({ status: 404, message: "Budget introuvable." });
        }

        res.status(200).json({ status: 200, message: "Budget mis à jour avec succès.", data: updatedBudget });
    } catch (error) {
        console.error("Erreur dans updateBudget :", error);
        res.status(500).json({ status: 500, message: "Une erreur serveur s'est produite." });
    }
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