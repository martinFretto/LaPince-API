import { Request, Response } from "express";


export async function registerUser(req: Request, res: Response) {
    console.log("register?")
}

export async function loginUser(req: Request, res: Response) {
    console.log("login?")

    const { email, password } = req.body;

    console.log("email, password : ", email, password)

}