import { z } from "zod";
import { ProductId } from "../product/product";
import { UserId } from "../share";

/**
 * MEMO
 * パフォーマンス観点で取得の際にエンティティの単位にしていない
 * 上記の場合でもリポジトリとクエリサービスを分けていない
 */
export interface CartRepository {
  load: (userId: UserId) => Cart;
  getItemCount: (cartId: CartId) => number;
  isInCart: (cartId: CartId, productId: ProductId) => boolean;
}

export const CartId = z.string().uuid();
export type CartId = z.infer<typeof CartId>;

export const Cart = z.object({
  id: CartId,
});
export type Cart = z.infer<typeof Cart>;
