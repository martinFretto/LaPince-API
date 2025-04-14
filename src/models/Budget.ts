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

    async findById(id:number) {
        const query = "SELECT * FROM budget WHERE id = $1";
        const result = await db.query(query, [id]);
        return result.rows[0];
    },
    
    async create(budget: BudgetObject) {
        const query = "INSERT INTO budget (user_id, category, limit) VALUES ($1, $2, $3) returning *";
        const values = [budget.userId, budget.category, budget.limit];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    async update(id: number, updates: Partial<BudgetObject>) {
        const query =
            "UPDATE budgets SET category = COALESCE($1, category), limit = COALESCE($2, limit) WHERE id = $3 RETURNING *";
        const values = [updates.category, updates.limit, id];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    async delete(id: number) {
        const query = "DELETE FROM budgets WHERE id = $1 RETURNING *";
        const result = await db.query(query, [id]);
        return result.rowCount > 0;
    },

    };
    
export {BudgetModel}