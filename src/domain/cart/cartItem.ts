import { z } from "zod";
import { ProductId, OnSaleProductId } from "../product/product";
import { Quantity } from "../share";
import { CartId } from "./cart";

export interface CartItemRepository {
  insert: (cartItem: CartItem) => void;
  update: (cartItem: CartItem) => void;
}

export const CartItemId = z.string().uuid();
export type CartItemId = z.infer<typeof CartItemId>;

// 使用されている箇所にジャンプできない...
export const CartItem = z.object({
  cartId: CartId,
  productId: ProductId,
  quantity: Quantity,
});

export type CartItem = z.infer<typeof CartItem>;

export type Addable = {
  isNew: boolean;
};

export type AddableCartItem = CartItem & Addable;
