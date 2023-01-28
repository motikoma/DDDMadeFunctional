import { z } from "zod";

export interface ProductRepository {
  findOnSale: (productId: ProductId) => OnSaleProductId;
}

export const ProductId = z.string().uuid();
export type ProductId = z.infer<typeof ProductId>;

export type OnSaleProductId = ProductId;
