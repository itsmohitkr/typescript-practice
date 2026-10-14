import { User } from "../domain/user/user.types";
import { Product } from "../domain/product/product.types";

export interface Repository<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(input: T): Promise<T>;
    update(id: string, input: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}

export interface UserRepository extends Repository<User> {
    findByEmail(email: string): Promise<User | null>;
}

export interface ProductRepository extends Repository<Product> {
    findByCategory(category: string): Promise<Product[]>;
}
