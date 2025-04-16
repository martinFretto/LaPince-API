import { Router } from "express";
import * as budgetController from '../controllers/budgetController';
import { authMiddleware } from "../middlewares/authMiddleware";

const budgetRouter = Router();


budgetRouter.get("/",authMiddleware, budgetController.getAllBudgets);

budgetRouter.get("/:id",authMiddleware, budgetController.getBudgetById);

budgetRouter.post("/",authMiddleware, budgetController.createBudget);

budgetRouter.patch("/:id",authMiddleware, budgetController.updateBudget);

budgetRouter.delete("/:id",authMiddleware, budgetController.deleteBudget);

export {budgetRouter}