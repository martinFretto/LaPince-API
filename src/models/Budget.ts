import { Pool } from "pg"; //Afin de gerer les requetes

const db = new Pool();

export interface BudgetObject {
    userId: number;
    category: string;
    limit: number;    
}

const BudgetModel = {
    async findByUserId(userId:number) {
        const query = "SELECT * FROM budget WHERE user_id = $1";
        const result = await db.query(query, [userId]);
        return result.rows;
    },
    
}