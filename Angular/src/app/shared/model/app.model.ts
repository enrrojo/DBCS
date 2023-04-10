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

export interface Reserva{
    id: Number,
    guestName: String,
    guestEmail: String,
    price: Number,
    units: Number,
    numGuest: Number,
    status: Status,
    dateIn: Date,
    dateOut: Date,
    createdAt: Date,
    updatedAt: Date
}

export enum Status{
    PENDING,
    CONFIRMED,
    CANCELLED
}