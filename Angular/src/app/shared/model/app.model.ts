export interface User {
    id: Number,
    name: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    enabled: Boolean,
    role: Role,
    createdAt: String,
    updatedAt: String
    }
    
export enum Role {
    host,
    guest
}