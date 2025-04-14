import { CoreModel } from './CoreModel.js';
import { UserObject} from '../types/ModelTypes'
import { client } from '../database/client';

class User extends CoreModel {
    static table = 'user';
    
    email: String;
    password: String;
    last_name: String;
    first_name: String;
    total_budget: Number;
    total_expenses: Number;

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
                INSERT INTO "${this.table}" (first_name, last_name, email, password)
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
            values: [
                dataObj.firstname,
                dataObj.lastname,
                dataObj.email,
                dataObj.password,
            ],
        };

        const result = await client.query(query);

        if (!result.rowCount) {
            return null;
        }

        const user = new this(result.rows[0]);
        // const user = new User(result.rows[0]);

        return user;
    }

  
}

export { User };

