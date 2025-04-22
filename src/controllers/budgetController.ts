import { Request, Response } from "express";
import { getUserIdInToken } from "../libs/jwtToken";
import { BudgetDatamapper } from "../datamappers/BudgetDatamapper";
import { BudgetObject } from "../types/ModelTypes";
import { amountSchema, budgetSchema } from "../libs/validationSchemas";

interface AuthenticatedRequest extends Request {
    token?: string;
}

export async function getAllBudgets(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user_id_for_db = getUserIdInToken(req);

    const budgets = await BudgetDatamapper.findByUser(user_id_for_db);

    if (budgets?.length) {
        res.status(200).json({ status: 200, data: budgets });
        return;
    } else {
        res.status(404).json({ status: 404, message: "Aucun budget trouvé pour cet utilisateur." });
        return;
    }
}

export async function getBudgetById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { budget_id } = req.params;
    const user_id_for_db = getUserIdInToken(req);
    const budget_id_for_db = Number(budget_id);

    const budget = await BudgetDatamapper.findById(budget_id_for_db, user_id_for_db);

    if (budget) {
        res.status(200).json({ status: 200, data: budget });
        return;
    } else {
        res.status(404).json({ status: 404, message: "Ce budget est introuvable." });
        return;
    }
}

export async function createBudget(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user_id_for_db = getUserIdInToken(req);

    const { name, warning_amount, allocated_amount, color, icon } = req.body;
    const warning_amount_for_db = Number(warning_amount.replace(',','.'))
    const allocated_amount_for_db = Number(allocated_amount.replace(',','.'))


    const { error } = budgetSchema.validate({ name, warning_amount_for_db, allocated_amount_for_db, color, icon });
    if (error) {
        res.status(400).json({
            message: "Validation échouée.",
            details: error.details.map((detail) => detail.message),
        });
        return;
    }

    const budgetData: BudgetObject = {
        name,
        warning_amount: warning_amount_for_db,
        spent_amount: 0,
        allocated_amount: allocated_amount_for_db,
        color: color || null,
        icon: icon || null,
        user_id: user_id_for_db,
    };

    const newBudget = await BudgetDatamapper.create(budgetData);

    if (newBudget) {
        res.status(201).json({ status: 201, message: "Budget créé avec succès.", data: newBudget });
        return;
    } else {
        res.status(500).json({ status: 500, message: "Une erreur est survenue lors de la création du budget." });
        return;
    }
}

export async function updateBudget(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { budget_id } = req.params;
    const user_id_for_db = getUserIdInToken(req);
    const budget_id_for_db = Number(budget_id);

    const budget = await BudgetDatamapper.findById(budget_id_for_db, user_id_for_db);

    if (!budget) {
        res.status(404).json({ status: 404, message: "Ce budget est introuvable." });
        return;
    }

    const { error } = budgetSchema.validate(req.body);
    if (error) {
        res.status(400).json({
            message: "Validation échouée.",
            details: error.details.map((detail) => detail.message),
        });
        return;
    }

    const { name, warning_amount, allocated_amount, color, icon } = req.body;

    const updateData: Partial<BudgetObject> = {
        id: budget.id,
        name: name || budget.name,
        warning_amount: warning_amount ?? budget.warning_amount,   
        spent_amount:  budget.spent_amount,
        allocated_amount: allocated_amount ?? budget.allocated_amount,
        color: color || budget.color,
        icon: icon || budget.icon,
    };

    const updatedBudget = await BudgetDatamapper.update(updateData);

    if (updatedBudget) {
        res.status(200).json({ status: 200, message: "Budget modifié avec succès.", data: updatedBudget });
        return;
    } else {
        res.status(500).json({ status: 500, message: "Une erreur est survenue lors de la modification du budget." });
        return;
    }
}

export async function deleteBudget(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { budget_id } = req.params;
    const user_id_for_db = getUserIdInToken(req);
    const budget_id_for_db = Number(budget_id);

    const budget = await BudgetDatamapper.findById(budget_id_for_db, user_id_for_db);

    if (!budget) {
        res.status(404).json({ status: 404, message: "Le budget que vous souhaitez supprimer n'existe pas." });
        return;
    }

    const deleted = await BudgetDatamapper.destroy(budget);

    if (deleted) {
        res.status(204).send();
        return;
    } else {
        res.status(500).json({ status: 500, message: "Une erreur est survenue lors de la suppression du budget." });
        return;
    }
}
