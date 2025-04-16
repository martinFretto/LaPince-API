import { client } from "../database/client";
import { Expenditure } from "../models/Expenditure";
import { ExpenditureObject } from "../types/ModelTypes";

class expenditureDatamapper {

    static async findById(id: number): Promise<Expenditure| null> {
     
            const query = {
                text: `SELECT * FROM "expenditure" WHERE id = $1;`,
                values: [id],
            };
    
            const results = await client.query(query);
    
            if (!results.rowCount) {
                return null;
            }
    
            const expenditure = new Expenditure(results.rows[0]);
    
            return expenditure;
    }

    static async findByBudget(budget_id: number): Promise<Expenditure[]|null> {
        const query = {
            text: `SELECT * FROM "expenditure" WHERE budget_id= $1;`,
            values: [budget_id],
        };

        const results = await client.query(query);

        if (!results.rowCount) {
            console.log("ici")
            return null;
        }

        // On va construire un tableau de dépenses
        const expenditures= [];

        for (let i = 0; i < results.rows.length; i++) {
            // on instancie un level à chaque tour de boucle
            const expenditure = new Expenditure(results.rows[i]);

            expenditures.push(expenditure);
        }

        return expenditures;
    }

    static async create(dataObj: ExpenditureObject): Promise <Expenditure|null>{
        const query = {
            text: `
                INSERT INTO "expenditure" (description, payment_method, amount, date, user_id, budget_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;`,
            values: [
                dataObj.description,
                dataObj.payment_method,
                dataObj.amount,
                dataObj.date,
                dataObj.user_id,
                dataObj.budget_id
            ],
        };

        const result = await client.query(query);

        if (!result.rowCount) {
            return null;
        }

        const expenditure = new Expenditure(result.rows[0]);

        return expenditure;
    }

    static async update(dataObj: ExpenditureObject): Promise <Expenditure|null>{
        const query = {
            text: `
                UPDATE "expenditure" SET  
                description = $1,
                payment_method = $2,
                amount = $3,
                date = $4
                WHERE id = $5
                RETURNING *;`,
            values: [
                dataObj.description,
                dataObj.payment_method,
                dataObj.amount,
                dataObj.date,
                dataObj.id
            ],
        };

        const result = await client.query(query);

        if (!result.rowCount) {
            return null;
        }

        const expenditure = new Expenditure(result.rows[0]);

        return expenditure;
    }

    static async destroy(expenditure: Expenditure): Promise<boolean> {
        try{
            const query = {
                text: `DELETE FROM "expenditure" WHERE id = $1;`,
                values: [expenditure.id],
            };
    
            await client.query(query);
    
            return true;
        } catch(error){
            return false;
        }      
    }
}

export {expenditureDatamapper}