import { Request, Response } from "express";
import argon2 from "argon2";
import { UserDatamapper } from "../datamappers/UserDatamapper";
import { getUserIdInToken } from "../libs/jwtToken";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";


export async function getUserInfo(req: AuthenticatedRequest, res: Response): Promise<void> {

    const user_id = getUserIdInToken(req);
    const user = await UserDatamapper.findById(user_id);
        
    if (!user) {
        res.status(404).json({ status: 404, message: "Utilisateur introuvable." });
        return;
    }
    res.status(200).json({ status: 200, data: user});
}

    export async function updateUserProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
        const user_id = getUserIdInToken(req);
        const { email, first_name, last_name, total_budget } = req.body;

        const updatedUser = await UserDatamapper.updateById({
            id: user_id,
            email,
            first_name,
            last_name,
            total_budget
        });

        if (!updatedUser) {
            res.status(500).json({ status: 500, message: "Erreur lors de la mise à jour du profil." });
            return;
        }

        res.status(200).json({
            id: updatedUser.id,
            email: updatedUser.email,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            total_budget: updatedUser.total_budget,
            total_expenses: updatedUser.total_expenses,
            updated_at: updatedUser.updated_at,
        });
    }

/*
    export async function deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
        const user_id = getUserIdInToken(req);
        const user = await UserDatamapper.findById(user_id);

        if (!user) {
            res.status(404).json({ status: 404, message: "Utilisateur introuvable." });
            return;
        }

        const isDeleted = await UserDatamapper.delete(user);

        if (!isDeleted) {
            res.status(500).json({ status: 500, message: "Erreur lors de la suppression du compte utilisateur." });
            return;
        }

        res.status(200).json({ success: true });
    }*/
