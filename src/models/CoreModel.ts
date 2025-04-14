import { client } from '../database/client';
import {CoreObject} from '../types/CoreObject';

class CoreModel {

    static table: String;
    #id: Number;
    created_at: Date;
    updated_at: Date;

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
    

}

export { CoreModel };