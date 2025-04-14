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

}

export { CoreModel };
