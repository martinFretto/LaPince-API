export interface CoreObject {
    id: Number;
    created_at: Date;
    updated_at: Date;
}

export interface UserObject {
    id: Number;
    email: String;
    password: String;
    last_name: String;
    first_name: String;
    total_budget: Number;
    total_expenses: Number;
    created_at: Date;
    updated_at: Date;
}
