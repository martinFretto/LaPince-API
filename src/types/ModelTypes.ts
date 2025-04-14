export interface CoreObject {
    id?: Number,
    created_at?: Date,
    updated_at?: Date
}

export interface UserObject extends CoreObject {
    email: string,
    password: string,
    first_name: string | null,
    last_name: string | null,  
    total_budget: Number,
    total_expenses: Number
} 
