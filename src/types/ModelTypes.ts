
export interface CoreObject {
    id?: number | undefined,
    created_at?: Date,
    updated_at?: Date
}

export interface UserObject extends CoreObject {
    email: string,
    password: string,
    first_name: string | null,
    last_name: string | null,  
    total_budget: number,
    total_expenses: number
} 

