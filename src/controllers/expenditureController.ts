import { Request, Response } from "express";
import { ExpenditureObject } from "../types/ModelTypes";
import { Expenditure } from "../models/Expenditure";
import jwt from 'jsonwebtoken';

export async function createExpenditure(req: Request, res: Response): Promise<void> {
    console.log("createExpenditure params? ", req.params)
    
    const { budget_id } = req.params;

    console.log("BUDGETID: ", budget_id)




    const budget_id_for_db = Number(budget_id)
    const { description, payment_method, amount, date} = req.body;
    const amount_for_db = Number(amount)
    
    let date_for_db: Date | null;
    if(date){
        date_for_db= new Date(date);
    } else{
        date_for_db=null; 
    }
    
    
    const decoded = jwt.verify
    ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiYm9iYnlAb2Nsb2NrLmlvIiwiaWQiOjJ9LCJpYXQiOjE3NDQ3MTc2OTMsImV4cCI6MTc0NDcxODg5M30.tk0pA6wwWRqe5Ax6DL0RXA3eXwJ7-zXoybeU289aEo4",
        process.env.JWT_SECRET as jwt.Secret) as jwt.JwtPayload;
    const user_id = decoded.user.id;
    console.log("user_id???: ", user_id)
    const token=""
    const user_id_for_db= Number(user_id);


    console.log("budgetid: ", budget_id_for_db, "  type: ", typeof budget_id_for_db)
    console.log("user_id_for_db: ", user_id_for_db, "  type: ", typeof user_id_for_db)


    const expenditureData: ExpenditureObject = {
        description: description? description: null,
        payment_method: payment_method? payment_method:null ,
        amount: amount_for_db,
        date: date_for_db,
        budget_id: budget_id_for_db,
        user_id: user_id_for_db
    } 

    await Expenditure.create(expenditureData);

    res.status(201).json({ status: 201, message: "Dépense créée"});
    return;
}