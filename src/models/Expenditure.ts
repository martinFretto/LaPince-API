import { CoreModel } from './CoreModel';
import { ExpenditureObject } from '../types/ModelTypes';
import { client } from '../database/client';

class Expenditure extends CoreModel {
    static table = 'expenditure';
    
    description: string | null;
    payment_method: string | null;
    amount: number;
    date: Date | null;
    user_id: number;
    budget_id: number;

    constructor (obj: ExpenditureObject){
        super(obj); 
        this.description= obj.description;
        this.payment_method = obj.payment_method;
        this.amount = obj.amount;
        this.date = obj.date;
        this.user_id = obj.user_id;
        this.budget_id = obj.budget_id;     
    }

    static async create(dataObj: ExpenditureObject) {

        const query = {
            text: `
                INSERT INTO "${this.table}" (description, payment_method, amount, date, user_id, budget_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
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

        const user = new this(result.rows[0]);

        return user;
    }

}

export { Expenditure };
