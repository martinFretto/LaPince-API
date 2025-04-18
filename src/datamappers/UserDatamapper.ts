import { db } from "../database/db";
import { User } from "../models/User";
import { UserObject } from "../types/ModelTypes";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class UserDatamapper {
    static async findByEmail(email: string): Promise<null|User> {
        const query = {
            text: 'SELECT * FROM "user" WHERE email = $1',
            values: [email],
        };
        console.log("DB: ", db)
        const results = await db.query(query);
        console.log("results: ", results)

        if (!results.rowCount) {
            return null;
        }

        const user = new User(results.rows[0]);

        return user;
    }

    static async findById(id: number): Promise<User | null> {
        const query = {
            text: 'SELECT * FROM "user" WHERE id = $1;',
            values: [id],
        };
    
        const results = await db.query(query);
    
        
        if (results && results.rowCount && results.rowCount > 0) {
            return new User(results.rows[0]);
        }
    
        return null; 
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
    static async update(dataObj: Partial<UserObject>): Promise<User | null> {
        const query = {
            text: `
                UPDATE "user"
                SET
                    first_name = COALESCE($1, first_name),
                    last_name = COALESCE($2, last_name),
                    email = COALESCE($3, email),
                    password = COALESCE($4, password)
                WHERE id = $5
                RETURNING *;`,
            values: [
                dataObj.first_name || null,
                dataObj.last_name || null,
                dataObj.email || null,
                dataObj.password || null,
                dataObj.id,
            ],
        };
    
        const result = await db.query(query);
    
        if (!result.rowCount) {
            return null;
        }
    
        return new User(result.rows[0]);
    }
    
    static async delete(user: User): Promise<boolean> {
        try {
            const query = {
                text: `DELETE FROM "user" WHERE id = $1;`,
                values: [user.id],
            };
    
            await db.query(query);
            return true;
        } catch (error) {
            console.error("Erreur dans delete :", error);
            return false;
        }
    }
}

export {UserDatamapper}