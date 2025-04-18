import { db } from "../database/db";
import { Expenditure, ExpenditureWithDetails } from "../models/Expenditure";
import { ExpenditureObject } from "../types/ModelTypes";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class ExpenditureDatamapper {

    static async findById(id: number, user_id: number): Promise<Expenditure| null> {
        //L'id est suffisant pour la requête
        //Mais on vérifie que la dépense demandée  appartient bien à l'utilisateur authentifié
        //On vérifie également que la dépense appartient budget (présent dans l'URL) 
        //Car on va potentiellement se servir de l'entité retournée pour la destroy
        const query = {
            text: `SELECT * FROM "expenditure" WHERE id = $1 AND user_id= $2;`,
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
            text: `SELECT * FROM "expenditure" WHERE budget_id= $1 and user_id= $2 ORDER BY date DESC;`,
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

    static async findAllWithIconAndColor(user_id: number): Promise<ExpenditureWithDetails[]|null> {
        //Le Budget_ID est suffisant pour la requête
        //Mais on vérifie que le budget appartient bien à l'utilisateur authentifié
        console.log("requête préparée")
        const query = {
            text: 
            `SELECT expenditure.id, expenditure.budget_id, date, description, amount, budget.color, budget.icon FROM expenditure
            JOIN BUDGET on budget.id = expenditure.budget_id
            WHERE expenditure.user_id= $1 ORDER BY date DESC;`,
            values: [user_id],
        };
        console.log("requête préparée: ")

        const results = await db.query(query);
        console.log("results: ", results)

        if (!results.rowCount) {
            return null;
        }

        // On va construire un tableau de dépenses avec icon et color
        const expendituresWithDetails= [];

        for (let i = 0; i < results.rows.length; i++) {
            // on instancie un level à chaque tour de boucle
            const expenditureWithDetails:ExpenditureWithDetails = {
                expenditure: new Expenditure(results.rows[i]),
                budgetColor: results.rows[i].color,
                budgetIcon: results.rows[i].icon
            }               
            
            expendituresWithDetails.push(expenditureWithDetails);
        }

        return expendituresWithDetails;
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
        await this.updateBudgetAndUserAfterExpenditure(expenditure.user_id, expenditure.budget_id);

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
                WHERE id = $5 and budget_id
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
        // biome-ignore lint/complexity/noThisInStatic: <explanation>
        await this.updateBudgetAndUserAfterExpenditure(dataObj.user_id, dataObj.budget_id);

        if (!result.rowCount) {
            return null;
        }

        const expenditure = new Expenditure(result.rows[0]);

        return expenditure;
    }

    static async destroy(expenditure: Expenditure){
        //On précise dans la requête l'user id(pour ne pas qu'un utilisateur puisse supprimer la dépense d'un autre via une requête dans l'url)
        //On précise également le budget
        const query = {
            text: `DELETE FROM "expenditure" WHERE id = $1 and budget_id = $2 and user_id = $3;`,
            values: [expenditure.id, expenditure.budget_id, expenditure.user_id],
        };
    
        await db.query(query);

        // biome-ignore lint/complexity/noThisInStatic: <explanation>
        await this.updateBudgetAndUserAfterExpenditure(expenditure.user_id, expenditure.budget_id);
      
    }

    static async updateBudgetAndUserAfterExpenditure(user_id: number, budget_id:number){
        const budgetQuery = {
            text: ` UPDATE "budget" 
                    SET spent_amount = 
                    (SELECT COALESCE(SUM(amount), 0)
                    FROM expenditure
                    WHERE budget_id = $1)
                    WHERE id = $1;`,
            values: [budget_id],
        };

        await db.query(budgetQuery);

        const userQuery = {
            text: ` Update "user" 
                    SET total_expenses = 
                    (SELECT COALESCE(SUM(amount), 0)
                    FROM expenditure
                    WHERE user_id = $1)
                    WHERE id = $1;`,
            values: [user_id],
        };

        await db.query(userQuery);
    }
}

export {ExpenditureDatamapper}