import { NextFunction, Request, Response } from "express";


export const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({ status: 400, message: "Vous cherchez une page inexistante" });
    return;
}