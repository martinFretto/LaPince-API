import { Request, Response } from "express";
import { User } from "../models/User";
import { UserObject } from "../types/ModelTypes";


export async function registerUser(req: Request, res: Response) {
    console.log("register?")
    const { email, password, first_name, last_name } = req.body;

    console.log("email, password, first_name, last_name : ", email, password, first_name, last_name)

    const userData: UserObject = {
        email: email,
        password: password,
        first_name: first_name? first_name: null,
        last_name: last_name? last_name: null,
        total_budget: 0,  
        total_expenses: 0
    } 

    const user = await User.create(userData)


  res.status(201).json({ status: 201, message: "User created" });
}

export async function loginUser(req: Request, res: Response) {
    //console.log("login?")

    const { email, password } = req.body;

    //console.log("email, password : ", email, password)

}