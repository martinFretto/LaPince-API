import { db } from "../database/db";
import { BudgetObject } from "../types/ModelTypes";


const BudgetModel = {
    async findByUserId(userId: number) {
        const query = "SELECT * FROM budget WHERE user_id = $1";
        const result = await db.query(query, [userId]);
        return result.rows;
    },

    async findById(id: number) {
        const query = "SELECT * FROM budget WHERE id = $1";
        const result = await db.query(query, [id]);
        return result.rows[0];
    },
    
    async create(budget: BudgetObject) {
        const query = `
            INSERT INTO budget (name, warning_amount, spent_amount, allocated_amount, color, icon, user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`;
        const values = [
            budget.name,
            budget.warning_amount,
            budget.spent_amount,
            budget.allocated_amount,
            budget.color,
            budget.icon,
            budget.user_id
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    async update(id: number, updates: Partial<BudgetObject>) {
        const query = `
            UPDATE budget
            SET
                name = COALESCE($1, name),
                warning_amount = COALESCE($2, warning_amount),
                spent_amount = COALESCE($3, spent_amount),
                allocated_amount = COALESCE($4, allocated_amount),
                color = COALESCE($5, color),
                icon = COALESCE($6, icon)
            WHERE id = $7
            RETURNING *`;
        const values = [
            updates.name,
            updates.warning_amount,
            updates.spent_amount,
            updates.allocated_amount,
            updates.color,
            updates.icon,
            id
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    async delete(id: number) {
        const query = "DELETE FROM budget WHERE id = $1 RETURNING *";
        const result = await db.query(query, [id]);
        return result.rowCount! > 0;
    },
};

export { BudgetModel };