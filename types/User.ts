import { type } from "os"

export interface User {
    id: string
    email: string
    password: string
    account: String
    roles: string[]
}

export interface UserLogin {
    password: string    
    account: String
}

export type UserWithoutPassword = Omit<User, 'password'>