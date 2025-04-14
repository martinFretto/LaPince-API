import { CoreModel } from './CoreModel';
import { UserObject } from '../types/ModelTypes';
import { client } from '../database/client';

class User extends CoreModel {
    static table = 'user';
    
    email: string;
    password: string;
    last_name: string | null;
    first_name: string | null;
    total_budget: number;
    total_expenses: number;

    constructor (obj: UserObject){
        super(obj); 
        this.email= obj.email;
        this.password = obj.password;
        this.last_name = obj.last_name;
        this.first_name = obj.first_name;
        this.total_budget = obj.total_budget;
        this.total_expenses = obj.total_expenses;     
    }

    static async create(dataObj: UserObject) {

        const query = {
            text: `
                INSERT INTO "${this.table}" (first_name, last_name, email, password, total_budget, total_expenses)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
            values: [
                dataObj.first_name,
                dataObj.last_name,
                dataObj.email,
                dataObj.password,
                dataObj.total_budget,
                dataObj.total_expenses
            ],
        };

        const result = await client.query(query);

        if (!result.rowCount) {
            return null;
        }

        const user = new this(result.rows[0]);

        return user;
    }

    static async findByEmail(email:string) {
        const query = {
            text: 'SELECT * FROM "' + this.table + '" WHERE email = $1',
            values: [email],
        };

        const results = await client.query(query);

        if (!results.rowCount) {
            return null;
        }

        const user = new this(results.rows[0]);

        return user;
    }

  
}

export { User };
