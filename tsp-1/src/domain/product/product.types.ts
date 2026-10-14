export type Product = {
    id: string;
    name: string;
    price: number;
    category: string;
};

export type CreateProductInput = Omit<Product, "id">;
export type UpdateProductInput = Partial<Omit<Product, "id">>;
