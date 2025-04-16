import { db } from "../database/db";
import { BudgetObject } from "../types/ModelTypes";
import { CoreModel } from "./CoreModel";

class Budget extends CoreModel {
    static table = "budget";

    name: string;
    warning_amount: number;
    spent_amount: number;
    allocated_amount: number;
    color: string;
    icon: string;
    user_id: number;

    constructor(obj: BudgetObject) {
        super(obj);
        this.name = obj.name;
        this.warning_amount = obj.warning_amount;
        this.spent_amount = obj.spent_amount;
        this.allocated_amount = obj.allocated_amount;
        this.color = obj.color;
        this.icon = obj.icon;
        this.user_id = obj.user_id;
    }

    async findByUserId(userId: number) {
        const query = `SELECT * FROM ${Budget.table} WHERE user_id = $1`;
        const result = await db.query(query, [userId]);
        return result.rows;
    }

    async findById(id: number) {
        const query = `SELECT * FROM ${Budget.table} WHERE id = $1 AND user_id = `;
        const result = await db.query(query, [id], [user_id]);
        return result.rows[0];
    }

    async create(budgetObj: BudgetObject) {
        const query = {
            text: `
            INSERT INTO ${Budget.table} (name, warning_amount, spent_amount, allocated_amount, color, icon, user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            values: [
                budgetObj.name,
                budgetObj.warning_amount,
                budgetObj.spent_amount,
                budgetObj.allocated_amount,
                budgetObj.color,
                budgetObj.icon,
                budgetObj.user_id,
            ],
        };
        const result = await db.query(query);
        return result.rows[0];
    }

    async update(id: number, updatesObj: Partial<BudgetObject>) {
        const query = {
            text: `
            UPDATE ${Budget.table}
            SET
                name = COALESCE($1, name),
                warning_amount = COALESCE($2, warning_amount),
                spent_amount = COALESCE($3, spent_amount),
                allocated_amount = COALESCE($4, allocated_amount),
                color = COALESCE($5, color),
                icon = COALESCE($6, icon)
            WHERE id = $7
            RETURNING *`,
            values: [
                updatesObj.name || null,
                updatesObj.warning_amount || null,
                updatesObj.spent_amount || null,
                updatesObj.allocated_amount || null,
                updatesObj.color || null,
                updatesObj.icon || null,
                id,
            ],
        };
        const result = await db.query(query);
        return result.rows[0];
    }

    async delete(id: number) {
        const query = `DELETE FROM ${Budget.table} WHERE id = $1 RETURNING *`;
        const result = await db.query(query, [id]);
        return result.rowCount! > 0;
    }
}

export { Budget };
