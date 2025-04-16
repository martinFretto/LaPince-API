import { db } from "../database/db";
import { Expenditure } from "../models/Expenditure";
import { ExpenditureObject } from "../types/ModelTypes";

class ExpenditureDatamapper {

    static async findById(id: number, user_id: number): Promise<Expenditure| null> {
            //L'id est suffisant pour la requête
            //Mais on vérifie que la dépense demandée  appartient bien à l'utilisateur authentifié
            const query = {
                text: `SELECT * FROM "expenditure" WHERE id = $1 and user_id= $2;`,
                values: [id, user_id],
            };
    
            const results = await db.query(query);
    
            if (!results.rowCount) {
                return null;
            }
    
            const expenditure = new Expenditure(results.rows[0]);
    
            return expenditure;
    }

    static async findByBudget(budget_id: number, user_id: number): Promise<Expenditure[]|null> {
        //Le Budget_ID est suffisant pour la requête
        //Mais on vérifie que le budget appartient bien à l'utilisateur authentifié
        const query = {
            text: `SELECT * FROM "expenditure" WHERE budget_id= $1 and user_id= $2;`,
            values: [budget_id, user_id],
        };

        const results = await db.query(query);

        if (!results.rowCount) {
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

        const result = await db.query(query);

        if (!result.rowCount) {
            return null;
        }

        const expenditure = new Expenditure(result.rows[0]);
        await this.updateBudgetAfterExpenditure(expenditure.budget_id);

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

        const result = await db.query(query);
        await this.updateBudgetAfterExpenditure(dataObj.budget_id);

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
    
            await db.query(query);

            await this.updateBudgetAfterExpenditure(expenditure.budget_id);
    
            return true;
        } catch(error){
            return false;
        }      
    }

    static async updateBudgetAfterExpenditure(budget_id:number){
        const query = {
            text: ` Update "budget" 
                    SET spent_amount = 
                    (SELECT COALESCE(SUM(amount), 0)
                    FROM expenditure
                    WHERE budget_id = $1)
                    WHERE id = $1;`,
            values: [budget_id],
        };

        await db.query(query);

        return;
    }
}

export {ExpenditureDatamapper}