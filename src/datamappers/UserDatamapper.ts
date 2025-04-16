import { db } from "../database/db";
import { User } from "../models/User";
import { UserObject } from "../types/ModelTypes";

class UserDatamapper {
    static async findByEmail(email: string): Promise<null|User> {
        const query = {
            text: 'SELECT * FROM "user" WHERE email = $1',
            values: [email],
        };

        const results = await db.query(query);

        if (!results.rowCount) {
            return null;
        }

        const user = new User(results.rows[0]);

        return user;
    }

    static async create(dataObj: UserObject){
        const query = {
            text: `
                INSERT INTO "user" (first_name, last_name, email, password, total_budget, total_expenses)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;`,
            values: [
                dataObj.first_name,
                dataObj.last_name,
                dataObj.email,
                dataObj.password,
                dataObj.total_budget,
                dataObj.total_expenses
            ],
        };

        const result = await db.query(query);

        if (!result.rowCount) {
            return null;
        }

        const user = new User(result.rows[0]);

        return user;
    }

}

export {UserDatamapper}