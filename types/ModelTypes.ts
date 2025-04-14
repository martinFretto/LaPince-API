export interface CoreObject {
    id?: Number,
    created_at?: Date,
    updated_at?: Date
}

export interface UserObject extends CoreObject {
    email: String,
    password: String,
    first_name: String | null,
    last_name: String | null,  
    total_budget: Number,
    total_expenses: Number
} 