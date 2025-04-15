import {CoreObject} from '../types/ModelTypes';

class CoreModel {

    static table: string ;
    #id: number |undefined;
    created_at: Date |undefined;
    updated_at: Date |undefined;


    constructor(obj: CoreObject) {
        this.#id = obj.id;
        this.created_at = obj.created_at;
        this.updated_at = obj.updated_at;
    } 

    get id() {
        return this.#id;
    }

    set id(newId) {
        this.#id = newId;
    }  
    /*
    static async findById(id: number) {
        const query = {
            text: `SELECT * FROM "${this.table}" WHERE id = $1;`,
            values: [id],
        };

        const results = await client.query(query);

        if (!results.rowCount) {
            return null;
        }

        const instance = new this(results.rows[0]);

        return instance;
    }

    async delete(tableName: string) {
        const query = {
            text: 'DELETE FROM "' + tableName + '" WHERE id = $1',
            values: [this.id],
        };

        await client.query(query);

        return null;
    }*/

}

export { CoreModel };
